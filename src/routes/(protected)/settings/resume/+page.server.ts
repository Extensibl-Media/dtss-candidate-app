import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';
import { superValidate, message, setError } from 'sveltekit-superforms/server';
import { documentUrlSchema } from '$lib/config/zod-schemas';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	if (!user) {
		return redirect(302, '/sign-in');
	}

	const userId = user.id;

	const token = generateToken(userId);

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

	const resumeReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getRecentCandidateResume`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!resumeReq.ok) {
		throw error(resumeReq.status, 'Failed to fetch resume');
	}

	const resume = await resumeReq.json();

	const resumeForm = await superValidate(event, documentUrlSchema);

	// Return all data needed for the page
	return {
		user,
		resumeForm,
		resume: resume.resume
	};
};

export const actions: Actions = {
	resumeUpload: async (event) => {
		const { locals, request } = event;
		const { user } = locals;

		if (!user) {
			return redirect(302, '/sign-in');
		}

		const form = await superValidate(request, documentUrlSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const url = form.data.url;
		const filename = form.data.filename;

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
						url: url,
						type: 'RESUME',
						filename: filename
					})
				}
			);
			console.log(await response.text());

			if (!response.ok) {
				throw new Error(`Failed to update resume: ${response.statusText}`);
			}

			setFlash({ type: 'success', message: 'Resume uploaded successfully' }, event);
			return message(
				{
					...form,
					data: {
						url: undefined,
						filename: undefined,
						type: undefined,
						createdAt: undefined
					}
				},
				'Resume uploaded successfully'
			);
		} catch (err) {
			console.error('Error updating resume:', err);
			setFlash({ type: 'error', message: 'Failed to update resume' }, event);
			return setError(form, 'Failed to update resume');
		}
	}
};
