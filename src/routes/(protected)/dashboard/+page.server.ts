import { redirect } from '@sveltejs/kit';
export const load = async (event) => {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/auth/sign-in');
	}
	console.log(user);

	// if (!user.completedOnboarding) {
	// 	redirect(302, '/onboarding');
	// }

	return user;
};
