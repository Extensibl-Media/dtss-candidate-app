import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { generateToken } from '$lib/server/utils';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async (event: RequestEvent) => {
	event.setHeaders({
		'cache-control': 'max-age=60'
	});
	const user = event.locals.user;

	if (!user) {
		redirect(301, '/auth/sign-in');
	}

	const token = generateToken(user.id);
	const { id } = event.params;

	const workdayReq = await fetch(
		`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getWorkdayDetailsForCandidate/${id}`,
		{
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}
	);

	const response = await workdayReq.json();

	// console.log('Workday response:', response);

	return {
		user,
		workday: response.data || null
	};
};
