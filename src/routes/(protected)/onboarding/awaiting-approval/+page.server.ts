import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateToken } from '$lib/server/utils';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/sign-in');
	}

	const userId = user.id;

	const token = generateToken(userId);

	// Fetch candidate profile
	const profileReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getCandidateProfile`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!profileReq.ok) {
		if (profileReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(profileReq.status, 'Failed to fetch profile');
	}

	const profile = await profileReq.json();
	console.log(profile);

	if (user.completedOnboarding && profile.approved) {
		redirect(302, '/dashboard');
	}

	return {
		user,
		profile
	};
};
