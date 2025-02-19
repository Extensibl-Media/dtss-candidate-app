import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const { user } = locals;
	const userId = user?.id;

	if (!userId) {
		throw error(401, 'Not authenticated');
	}

	// Generate a token for this request
	const token = generateToken(userId);

	try {
		const response = await fetch(
			`${env.CLIENT_APP_DOMAIN}/api/external/inbox/getConversationsForUser`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(response.status, 'Failed to fetch conversations');
		}

		const conversations = await response.json();

		return { user: user, conversations };
	} catch (err) {
		console.error('Error loading conversations:', err);
		throw error(500, 'Internal server error');
	}
};
