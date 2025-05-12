import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
	const user = locals.user;

	if (!user) {
		redirect(302, '/auth/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	const { id } = params;

	try {
		const response = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getCompanyDetails/${id}`,
			{
				method: 'GET'
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(response.status, 'Failed to fetch company');
		}

		const { company, requisitions } = await response.json();

		return {
			company,
			requisitions
		};
	} catch (err) {
		console.error('Error loading company details:', err);
		throw error(500, 'Internal server error');
	}
};
