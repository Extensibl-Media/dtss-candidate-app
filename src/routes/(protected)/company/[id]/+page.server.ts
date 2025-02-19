import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { id } = params;

	try {
		const response = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getCompanyDetails/${id}`, {
			method: 'GET'
		});

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
