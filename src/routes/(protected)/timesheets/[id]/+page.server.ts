import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
	const timesheetId = params.id;
	if (!timesheetId) {
		throw error(404, 'Timesheet ID is required');
	}

	const { user } = locals;
	if (!user) {
		throw redirect(303, '/sign-in');
	}

	const token = generateToken(user.id);

	try {
		// Fetch the timesheet details from your API
		const response = await fetch(
			`${env.CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetDetails/${timesheetId}`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Timesheet not found');
			}
			throw error(response.status, 'Failed to fetch timesheet details');
		}

		const data = await response.json();

		console.log({ timesheet: data.timesheet });

		return {
			timesheet: data.timesheet,
			requisition: data.requisition,
			company: data.company,
			workday: data.workday,
			recurrenceDay: data.recurrenceDay
		};
	} catch (err) {
		console.error('Error loading timesheet details:', err);
		throw error(500, 'Failed to load timesheet details');
	}
};

// Add actions for validating the timesheet if needed
export const actions = {
	validateTimesheet: async ({ request, params, locals }) => {
		const timesheetId = params.id;
		const { user } = locals;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const token = generateToken(user.id);

		try {
			const response = await fetch(
				`${env.CLIENT_APP_DOMAIN}/api/external/timesheets/${timesheetId}/validate`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				return { success: false, error: errorData.message };
			}

			return { success: true };
		} catch (err) {
			console.error('Error validating timesheet:', err);
			return { success: false, error: 'Failed to validate timesheet' };
		}
	}
};
