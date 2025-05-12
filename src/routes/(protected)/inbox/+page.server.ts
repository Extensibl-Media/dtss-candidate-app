import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '$lib/server/utils';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const { user } = locals;
	const userId = user?.id;

	if (!userId) {
		redirect(301, '/auth/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	// Generate a token for this request
	const token = generateToken(userId);

	try {
		const response = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/inbox/getConversationsForUser`,
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
