import type { PageServerLoad } from './$types';
import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { getSavedJobs } from '$lib/server/cache/cacheUtils';
import { generateToken } from '$lib/server/utils';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { requisitionApplicationSchema } from '$lib/config/zod-schemas';

export const load: PageServerLoad = async (event) => {
	const { id } = event.params;
	const user = event.locals.user;

	if (!user) {
		redirect(302, '/sign-in');
	}

	const token = generateToken(user.id);

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	try {
		const response = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getRequisitionDetails/${id}`,
			{
				method: 'GET'
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(response.status, 'Failed to fetch requisitions');
		}

		const requisition = await response.json();
		const savedOpenings = await getSavedJobs(user.id, token);
		const appliedReq = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getAppliedRequisitions`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		const appliedOpenings = await appliedReq.json();

		console.log({ savedOpenings, appliedOpenings });

		const applyForm = await superValidate(event, requisitionApplicationSchema);

		return {
			requisition,
			saved: savedOpenings.includes(requisition.id),
			appliedToOpening: appliedOpenings
				?.map((opening) => opening.application.requisitionId)
				.includes(requisition.id),
			applyForm
		};
	} catch (err) {
		console.error('Error loading requisitions:', err);
		throw error(500, 'Internal server error');
	}
};

export const actions = {
	// toggleSave: async (event: RequestEvent) => {
	// 	const userId = event.locals.user?.id;
	// 	const requisitionId = event.params.id;
	// 	const token = generateToken(userId);
	// 	if (!userId || !requisitionId) return;
	// 	try {
	// 		const result = await toggleSaveJob(userId, requisitionId, token);
	// 	} catch (err) {
	// 		console.log(err);
	// 		throw error(500, 'error saving opening');
	// 	}
	// },
	applyForOpening: async (event: RequestEvent) => {
		console.log('applying to opening');
		const userId = event.locals.user?.id;
		const requisitionId = event.params.id;
		const token = generateToken(userId);
		const form = await superValidate(event, requisitionApplicationSchema);

		if (!userId || !requisitionId) {
			return fail(400, {
				form: { ...form, errors: { message: 'Missing required information' } }
			});
		}

		const idAsNum = Number(requisitionId);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const req = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/applyForRequisition`, {
				method: 'POST',
				body: JSON.stringify({ requisitionId: idAsNum }),
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				// Add this to get a proper error response instead of HTML
				credentials: 'include'
			});

			// Log the entire response for debugging
			console.log('Response status:', req.status);
			console.log('Response headers:', Object.fromEntries(req.headers.entries()));

			if (!req.ok) {
				const errorText = await req.text();
				console.error('API Error Response:', errorText);
				return fail(req.status, {
					form: { ...form, errors: { message: 'Failed to submit application' } }
				});
			}

			try {
				const result = await req.json();
				if (result.success) {
					return message(form, 'Application submitted successfully!');
				} else {
					return setError(form, result.message || 'Application submission failed');
				}
			} catch (jsonError) {
				console.error('JSON parsing error:', jsonError);
				return fail(500, {
					form: { ...form, errors: { message: 'Invalid response from server' } }
				});
			}
		} catch (err) {
			console.error('Application submission error:', err);
			return fail(500, {
				form: { ...form, errors: { message: 'Something went wrong' } }
			});
		}
	}
};
