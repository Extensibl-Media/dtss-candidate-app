import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';
import { superValidate, message, setError } from 'sveltekit-superforms/server';
import { documentUrlSchema } from '$lib/config/zod-schemas';
import { setFlash } from 'sveltekit-flash-message/server';
import { z } from 'zod';

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;

	if (!user) {
		return redirect(302, '/sign-in');
	}
	const userId = user.id;

	if (!user.completedOnboarding && user.onboardingStep > 4) {
		redirect(302, '/onboarding/awaiting-approval');
	}

	const token = generateToken(userId);

	// Fetch candidate profile
	const profileReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getCandidateProfile`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!profileReq.ok) {
		if (profileReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(profileReq.status, 'Failed to fetch profile');
	}

	// Parse all responses
	const profile = await profileReq.json();
	const documentsForm = await superValidate(event, documentUrlSchema);
	const skipForm = await superValidate({ userId: user.id }, z.object({ userId: z.string() }));

	// Return all data needed for the page
	return {
		user,
		profile,
		documentsForm,
		skipForm
	};
};

export const actions: Actions = {
	skipUpload: async (event) => {
		const { locals } = event;
		const { user } = locals;
		if (!user) {
			return redirect(302, '/sign-in');
		}

		try {
			const form = await superValidate(event, z.object({ userId: z.string() }));

			if (!form.valid) {
				return fail(400, { form });
			}
			const userId = form.data.userId;

			if (userId !== user.id) {
				return fail(403, { message: 'Unauthorized' });
			}

			const token = generateToken(user.id);
			const response = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/updateUserData`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ onboardingStep: 5 })
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw error(401, 'Authentication failed');
				}
				throw error(response.status, 'Failed to update user');
			}

			setFlash({ type: 'success', message: 'Skipped document upload' }, event);
		} catch (err) {
			console.error('Error skipping document upload:', err);
			setFlash({ type: 'error', message: 'Failed to skip document upload' }, event);
			return fail(500, { message: 'Failed to skip document upload' });
		}
		return redirect(302, '/onboarding/awaiting-approval');
	},
	documentsUpload: async (event) => {
		const { locals, request } = event;
		const { user } = locals;

		if (!user) {
			return redirect(302, '/sign-in');
		}

		const form = await superValidate(request, documentUrlSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const fileData = form.data.filesData;

		try {
			const token = generateToken(user.id);

			const response = await fetch(
				`${env.CLIENT_APP_DOMAIN}/api/external/createCandidateDocument`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						type: 'OTHER',
						filesData: fileData
					})
				}
			);

			if (!response.ok) {
				console.log(await response.text());
				throw new Error(`Failed to update resume: ${response.statusText}`);
			}

			const userResponse = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/updateUserData`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ onboardingStep: 5 })
			});

			if (!userResponse.ok) {
				if (userResponse.status === 401) {
					throw error(401, 'Authentication failed');
				}
				throw error(userResponse.status, 'Failed to update avatar');
			}

			setFlash({ type: 'success', message: 'Documents uploaded successfully' }, event);
		} catch (err) {
			console.error('Error updating resume:', err);
			setFlash({ type: 'error', message: 'Failed to update resume' }, event);
			return setError(form, 'Failed to update resume');
		}
		redirect(302, '/onboarding/awaiting-approval');
	}
};
