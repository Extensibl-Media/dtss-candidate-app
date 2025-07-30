import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '$lib/server/utils';
import { superValidate, message, setError } from 'sveltekit-superforms/server';
import { newCandidateDisciplinesSchema } from '$lib/config/zod-schemas';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { user } = event.locals;
	if (!user) {
		return redirect(302, '/sign-in');
	}
	const userId = user.id;

	if (!user.completedOnboarding && user.onboardingStep > 2) {
		redirect(302, '/onboarding/resume');
	}

	const token = generateToken(userId);

	// Fetch candidate profile
	const profileReq = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getCandidateProfile`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!profileReq.ok) {
		if (profileReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(profileReq.status, 'Failed to fetch profile');
	}

	// Fetch all disciplines
	const disciplinesReq = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getAllDisciplines`);

	if (!disciplinesReq.ok) {
		if (disciplinesReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(disciplinesReq.status, 'Failed to fetch disciplines');
	}

	// Fetch experience levels
	const experienceReq = await fetch(`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getExperienceLevels`);

	if (!experienceReq.ok) {
		if (experienceReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(experienceReq.status, 'Failed to fetch experience levels');
	}

	const profDisciplinesReq = await fetch(
		`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getCandidateDisciplines`,
		{
			headers: { Authorization: `Bearer ${token}` }
		}
	);
	if (!profDisciplinesReq.ok) {
		if (profDisciplinesReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(profDisciplinesReq.status, 'Failed to fetch candidate disciplines');
	}

	if (!disciplinesReq.ok) {
		if (disciplinesReq.status === 401) {
			throw error(401, 'Authentication failed');
		}
		throw error(disciplinesReq.status, 'Failed to fetch disciplines');
	}

	// Parse all responses
	const profile = await profileReq.json();
	const disciplines = await disciplinesReq.json();
	const experienceLevels = await experienceReq.json();
	const candidateDisciplines = await profDisciplinesReq.json();

	// Initialize forms
	const form = await superValidate(event, newCandidateDisciplinesSchema);

	// Return all data needed for the page
	return {
		user,
		profile,
		form,
		disciplines: disciplines.disciplines,
		experienceLevels: experienceLevels.experienceLevels,
		candidateDisciplines: candidateDisciplines.disciplines || []
	};
};

export const actions: Actions = {
	submitExperience: async (event) => {
		const { locals, request } = event;
		const { user } = locals;

		if (!user) {
			return redirect(302, '/sign-in');
		}

		const form = await superValidate(request, newCandidateDisciplinesSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const disciplines = form.data.disciplines;

		// Validate that at least one discipline is selected
		if (!disciplines || disciplines.length === 0) {
			setError(form, 'Please select at least one discipline');
			return fail(400, { form });
		}

		try {
			const token = generateToken(user.id);
			const response = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/updateCandidateExperience`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ disciplines })
				}
			);

			if (!response.ok) {
				return setError(form, `Failed to update disciplines: ${response.statusText}`);
			}

			setFlash({ type: 'success', message: 'Work experience updated successfully' }, event);
		} catch (err) {
			console.error('Error updating disciplines:', err);
			setFlash({ type: 'error', message: 'Failed to update work experience' }, event);
			return setError(form, 'Failed to update work experience');
		}
		return message(form, 'Work experience updated successfully');
	}
};
