import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateToken } from '$lib/server/utils';
import { env } from '$env/dynamic/private';
import { documentUrlSchema } from '$lib/config/zod-schemas';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate, message, setError } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/auth/sign-in');
	}
	const token = generateToken(user.id);
	const documentsResponse = await fetch(
		`${env.CLIENT_APP_DOMAIN}/api/external/getCandidateDocuments`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}
	);
	if (!documentsResponse.ok) {
		throw new Error('Failed to fetch documents');
	}
	const documents = await documentsResponse.json();

	const documentsForm = await superValidate(event, documentUrlSchema);

	return {
		user,
		documents: documents.documents,
		documentsForm
	};
};

export const actions = {
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
			return message(
				{
					...form,
					data: {
						urls: undefined,
						filesData: undefined,
						url: undefined
					}
				},
				'Documents uploaded successfully'
			);
		} catch (err) {
			console.error('Error updating resume:', err);
			setFlash({ type: 'error', message: 'Failed to update resume' }, event);
			return setError(form, 'Failed to update resume');
		}
	}
};
