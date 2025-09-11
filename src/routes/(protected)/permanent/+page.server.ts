import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '$lib/server/utils';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=60'
	});
	// Assuming you have the user's ID in the session
	const user = locals.user;

	if (!user) {
		redirect(302, '/auth/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	// Generate a token for this request
	const token = generateToken(user.id);

	try {
		const requisitionRes = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getOpeningsForCandidate`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!requisitionRes.ok) {
			if (requisitionRes.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(requisitionRes.status, 'Failed to fetch requisitions');
		}
		const appliedReq = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getAppliedRequisitions`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!appliedReq.ok) {
			if (appliedReq.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(appliedReq.status, 'Failed to fetch applied requisitions');
		}

		const [requisitions, applied] = await Promise.all([
			await requisitionRes.json(),
			await appliedReq.json()
		]);

		return {
			requisitions: requisitions.requisitions,
			applied
		};
	} catch (err) {
		console.error('Error loading requisitions:', err);
		throw error(500, 'Internal server error');
	}
};
