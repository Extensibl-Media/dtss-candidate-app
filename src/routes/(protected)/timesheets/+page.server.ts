import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateToken } from '$lib/server/utils';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async (event) => {
	event.setHeaders({
		'cache-control': 'max-age=60'
	});
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}

	const token = generateToken(user.id);

	const timesheetsReq = await fetch(
		`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetsForUser`,
		{
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}
	);

	const timesheets = await timesheetsReq.json();

	return {
		user,
		timesheets: timesheets.data || []
	};
};
