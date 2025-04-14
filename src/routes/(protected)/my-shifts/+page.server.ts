import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { generateToken } from '$lib/server/utils';
import { CLIENT_APP_DOMAIN } from '$env/static/private';

export const load: PageServerLoad = async (event: RequestEvent) => {
	event.setHeaders({
		'cache-control': 'max-age=60'
	});
	const user = event.locals.user;

	if (!user) {
		redirect(301, '/auth/sign-in');
	}

	const token = generateToken(user.id);

	const workdaysReq = await fetch(`${CLIENT_APP_DOMAIN}/api/external/getWorkdaysForCandidate`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});

	const response = await workdaysReq.json();

	return {
		user,
		workdays: response.data || []
	};
};
