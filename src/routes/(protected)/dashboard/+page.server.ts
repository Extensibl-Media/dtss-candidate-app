import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { recurrenceDayClaimSchema } from '$lib/config/zod-schemas.js';
import { generateToken } from '$lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { RequestEvent } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';
export const load = async (event) => {
	event.setHeaders({
		'cache-control': 'max-age=60'
	});
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/auth/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}
	const token = generateToken(user.id);

	const [workdays, timesheets, requisitions] = await Promise.all([
		fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getUpcomingWorkdaysForCandidate`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}).then(async (res) => {
			if (!res.ok) throw new Error(`Workdays API failed: ${res.status}`);
			const result = await res.json();
			// console.log(result);
			return result;
		}),

		fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getPendingTimesheetsForUser`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}).then(async (res) => {
			if (!res.ok) throw new Error(`Timesheets API failed: ${res.status}`);
			const result = await res.json();
			// console.log(result);
			return result;
		}),
		fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getUpcomingTempRequisitionsForCandidate`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}).then(async (res) => {
			if (!res.ok) throw new Error(`Requisitions API failed: ${res.status}`);
			const result = await res.json();
			// console.log(JSON.stringify(result, null, 2));
			return result;
		})
	]);

	return {
		user,
		workdays: workdays.data,
		timesheets: timesheets.data,
		requisitions: requisitions.recurrenceDays
	};
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
			const req = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/applyForTempRequisition`, {
				method: 'POST',
				body: JSON.stringify({ recurrenceDayId }),
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			const responseData = await req.json();

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
			setFlash(
				{
					type: 'success',
					message: 'Successfully claimed shift.'
				},
				event
			);
			return message(form, 'Successfully claimed shift!');
		} catch (err) {
			console.error('Server Error:', {
				error: err,
				userId,
				recurrenceDayId,
				timestamp: new Date().toISOString()
			});
			setFlash(
				{
					type: 'error',
					message: 'Something went wrong while claiming the shift'
				},
				event
			);
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
