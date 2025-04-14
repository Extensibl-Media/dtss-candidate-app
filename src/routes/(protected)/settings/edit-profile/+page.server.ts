import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { updateProfileSchema, avatarUrlSchema } from '$lib/config/zod-schemas';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';
import { STATES } from '$lib/config/constants';
import { format } from 'date-fns';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;

	if (!user) {
		redirect(302, '/sign-in');
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

	const profile = await profileReq.json();

	const form = await superValidate(
		{
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			...profile,
			birthday: format(new Date(profile.birthday), 'yyyy-MM-dd'),
			address: profile.address || '',
			state:
				profile.state?.length > 0
					? STATES.find(
							(state) => state.name == profile.state || state.abbreviation === profile.state
						)?.abbreviation
					: ''
		},
		updateProfileSchema
	);

	const avatarForm = await superValidate(event, avatarUrlSchema);

	return { user, form, avatarForm, profile };
};

export const actions: Actions = {
	avatarUpload: async (event: RequestEvent) => {
		const { locals } = event;
		const { user } = locals;

		if (!user) {
			redirect(302, '/sign-in');
		}

		const userId = user.id;
		const token = generateToken(userId);
		const form = await superValidate(event, avatarUrlSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const url = form.data.url;

		console.log({ urlOnServer: url });

		try {
			const response = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/updateUserData`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ avatarUrl: url })
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw error(401, 'Authentication failed');
				}
				throw error(response.status, 'Failed to update avatar');
			}

			setFlash({ type: 'success', message: 'Avatar updated Successfully' }, event);
			return message(form, 'Avatar updated Successfully');
		} catch (err) {
			console.error(err);
			setFlash({ type: 'error', message: 'Failed to update profile.' }, event);
			setError(form, 'Something went wrong');
		}
	},
	submitProfile: async (event: RequestEvent) => {
		const { locals } = event;
		const { user } = locals;

		if (!user) {
			redirect(302, '/sign-in');
		}

		const userId = user.id;

		const token = generateToken(userId);
		const form = await superValidate(event, updateProfileSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const userData = {
			email: form.data.email,
			firstName: form.data.firstName,
			lastName: form.data.lastName
		};

		const candidateData = {
			birthday: form.data.birthday,
			address: form.data.address,
			state: form.data.state,
			city: form.data.city,
			zipcode: form.data.zipcode,
			cellPhone: form.data.cellPhone,
			hourlyRateMin: form.data.hourlyRateMin,
			hourlyRateMax: form.data.hourlyRateMax
		};

		try {
			const candidateResponse = await fetch(
				`${env.CLIENT_APP_DOMAIN}/api/external/updateCandidateProfile`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(candidateData)
				}
			);

			const userResponse = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/updateUserData`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (!userResponse.ok || !candidateResponse.ok) {
				if (userResponse.status === 401 || candidateResponse.status === 401) {
					throw error(401, 'Authentication failed');
				}
				throw error(500, 'Failed to update avatar');
			}

			setFlash({ type: 'success', message: 'Profile updated Successfully' }, event);
		} catch (err) {
			console.error(err);
			setFlash({ type: 'error', message: 'Failed to update profile.' }, event);
			setError(form, 'Something went wrong');
		}
		return { form };
	}
};
