import { generateToken } from '$lib/server/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { recurrenceDayClaimSchema } from '$lib/config/zod-schemas';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	const { user } = locals;

	if (!user) {
		return redirect(303, '/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	const userId = user.id;

	const token = generateToken(userId);

	try {
		const recurrenceDayReq = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getTempRequisitionsForCandidate`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		if (!recurrenceDayReq.ok) {
			if (recurrenceDayReq.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(recurrenceDayReq.status, 'Failed to fetch requisitions');
		}

		const recurrenceDays = await recurrenceDayReq.json();

		const profileReq = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getCandidateProfile`, {
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

		return { user, profile, recurrenceDays };
	} catch (error) {
		console.error(error);
	}
};

export const actions = {
	claimWorkdayShift: async (event: RequestEvent) => {
		console.log('Starting workday claim process', {
			timestamp: new Date().toISOString()
		});

		const userId = event.locals.user?.id;
		const token = generateToken(userId);
		const form = await superValidate(event, recurrenceDayClaimSchema);
		const recurrenceDayId = form.data.recurrenceDayId;

		console.log('Form validation:', {
			isValid: form.valid,
			recurrenceDayId,
			formErrors: form.errors
		});

		if (!userId || !recurrenceDayId) {
			console.log('Missing required data:', {
				userId: !!userId,
				recurrenceDayId: !!recurrenceDayId
			});
			return fail(400, {
				form: { ...form, errors: { message: 'Missing required information' } }
			});
		}

		if (!form.valid) {
			console.log('Form validation failed:', form.errors);
			return fail(400, { form });
		}

		try {
			console.log('Sending claim request to API:', {
				endpoint: `${PUBLIC_CLIENT_APP_DOMAIN}/api/external/applyForTempRequisition`,
				recurrenceDayId
			});

			const req = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/applyForTempRequisition`, {
				method: 'POST',
				body: JSON.stringify({ recurrenceDayId }),
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			console.log('API Response:', {
				status: req.status,
				statusText: req.statusText,
				headers: Object.fromEntries(req.headers.entries()),
				url: req.url
			});

			const responseData = await req.json();
			console.log('API Response Data:', responseData);

			if (!req.ok || !responseData.success) {
				return fail(req.status || 403, {
					form: {
						...form,
						errors: {
							message: responseData.message || 'Failed to claim shift'
						}
					}
				});
			}

			return message(form, 'Successfully claimed shift!');
		} catch (err) {
			console.error('Server Error:', {
				error: err,
				userId,
				recurrenceDayId,
				timestamp: new Date().toISOString()
			});

			return fail(500, {
				form: {
					...form,
					errors: {
						message: 'Something went wrong while claiming the shift'
					}
				}
			});
		}
	}
};
