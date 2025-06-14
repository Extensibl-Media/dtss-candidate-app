import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '$lib/server/utils';
import { setFlash } from 'sveltekit-flash-message/server';

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
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetDetails/${timesheetId}`,
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
	validateTimesheet: async (event: RequestEvent) => {
		const timesheetId = event.params.id;
		const { user } = event.locals;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const token = generateToken(user.id);

		try {
			const response = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/${timesheetId}/validate`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ status: 'PENDING' })
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error validating timesheet:', errorData);
				setFlash(
					{
						type: 'error',
						message: 'Failed to validate timesheet'
					},
					event
				);
				return { success: false, error: errorData.message };
			}
			setFlash(
				{
					type: 'success',
					message: 'Timesheet submitted for revalidation'
				},
				event
			);
			return { success: true };
		} catch (err) {
			console.error('Error validating timesheet:', err);
			return { success: false, error: 'Failed to validate timesheet' };
		}
	},
	cancelTimesheet: async (event: RequestEvent) => {
		const timesheetId = event.params.id;
		const { user } = event.locals;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const token = generateToken(user.id);

		try {
			const response = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/${timesheetId}/cancel`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ status: 'VOID' })
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error cancelling timesheet:', errorData);
				setFlash(
					{
						type: 'error',
						message: 'Failed to cancel timesheet'
					},
					event
				);
				return { success: false, error: errorData.message };
			}
			setFlash(
				{
					type: 'success',
					message: 'Timesheet cancelled successfully'
				},
				event
			);
		} catch (err) {
			console.error('Error cancelling timesheet:', err);
			return { success: false, error: 'Failed to cancel timesheet' };
		}
		redirect(302, '/timesheets'); // Redirect to timesheets list after cancellation
	}
};
