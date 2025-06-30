import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '$lib/server/utils.js';
import { redirect } from '@sveltejs/kit';
export const load = async (event) => {
	event.setHeaders({
		'cache-control': 'max-age=60'
	});
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/auth/sign-in');
	}

	if (!user.completedOnboarding) {
		redirect(302, '/onboarding');
	}
	const token = generateToken(user.id);

	const [workdays, timesheets] = await Promise.all([
		fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getUpcomingWorkdaysForCandidate`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}).then(async (res) => {
			if (!res.ok) throw new Error(`Workdays API failed: ${res.status}`);
			console.log(await res.json());

			return res.json();
		}),

		fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getPendingTimesheetsForUser`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		}).then(async (res) => {
			if (!res.ok) throw new Error(`Timesheets API failed: ${res.status}`);
			console.log(await res.json());
			return res.json();
		})
	]);

	console.log(timesheets.data);
	return {
		user,
		workdays: workdays.data,
		timesheets: timesheets.data
	};
};
