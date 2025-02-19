import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=60'
	});
	// Assuming you have the user's ID in the session
	const userId = locals.user?.id;

	if (!userId) {
		throw error(401, 'Not authenticated');
	}

	// Generate a token for this request
	const token = generateToken(userId);

	try {
		const requisitionRes = await fetch(
			`${env.CLIENT_APP_DOMAIN}/api/external/getOpeningsForCandidate`,
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
		const appliedReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getAppliedRequisitions`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

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
			requisitions,
			applied
		};
	} catch (err) {
		console.error('Error loading requisitions:', err);
		throw error(500, 'Internal server error');
	}
};
