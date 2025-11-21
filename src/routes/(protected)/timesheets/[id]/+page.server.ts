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
		// Fetch the timesheet details
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

		// ✅ Fetch all workdays for this candidate during this week
		const workdaysResponse = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getWorkdaysForWeek`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					weekStartDate: data.timesheet.weekBeginDate,
					requisitionId: data.requisition.id
				})
			}
		);

		let workdays = [];
		if (workdaysResponse.ok) {
			const workdaysData = await workdaysResponse.json();
			workdays = workdaysData.workdays || [];
		}

		return {
			timesheet: data.timesheet,
			requisition: data.requisition,
			company: data.company,
			workday: data.workday,
			recurrenceDay: data.recurrenceDay,
			workdays // ✅ Add workdays to the return
		};
	} catch (err) {
		console.error('Error loading timesheet details:', err);
		throw error(500, 'Failed to load timesheet details');
	}
};

export const actions = {
	submitTimesheet: async (event: RequestEvent) => {
		const timesheetId = event.params.id;
		const { user } = event.locals;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const token = generateToken(user.id);
		const formData = await event.request.formData();
		const entries = JSON.parse(formData.get('entries') as string);
		const totalHours = parseFloat(formData.get('totalHours') as string);

		try {
			// ✅ First, fetch the timesheet to get the necessary IDs
			const timesheetResponse = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetDetails/${timesheetId}`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (!timesheetResponse.ok) {
				throw error(500, 'Failed to fetch timesheet details');
			}

			const timesheetData = await timesheetResponse.json();

			// ✅ Convert entries object to array format expected by API
			const entriesArray = Object.entries(entries)
				.filter(([_, value]: [string, any]) => value.hours > 0)
				.map(([date, value]: [string, any]) => ({
					date,
					startTime: value.startTime,
					endTime: value.endTime,
					hours: value.hours,
					workdayId: value.workdayId || timesheetData.workday?.id || ''
				}));

			const response = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/submitTimesheetForCandidate`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userId: user.id,
						companyId: timesheetData.company.id,
						weekStartDate: timesheetData.timesheet.weekBeginDate,
						entries: entriesArray,
						totalHours
					})
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setFlash(
					{ type: 'error', message: errorData.message || 'Failed to submit timesheet' },
					event
				);
				return { success: false, error: errorData.message };
			}

			setFlash({ type: 'success', message: 'Timesheet submitted successfully!' }, event);
			return { success: true };
		} catch (err) {
			console.error('Error submitting timesheet:', err);
			setFlash({ type: 'error', message: 'Failed to submit timesheet' }, event);
			return { success: false, error: 'Failed to submit timesheet' };
		}
	},

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
				setFlash({ type: 'error', message: 'Failed to validate timesheet' }, event);
				return { success: false, error: errorData.message };
			}

			setFlash({ type: 'success', message: 'Timesheet resubmitted for validation' }, event);
			return { success: true };
		} catch (err) {
			console.error('Error validating timesheet:', err);
			setFlash({ type: 'error', message: 'Failed to validate timesheet' }, event);
			return { success: false, error: 'Failed to validate timesheet' };
		}
	},
	resubmitTimesheet: async (event: RequestEvent) => {
		const timesheetId = event.params.id;
		const { user } = event.locals;

		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const token = generateToken(user.id);
		const formData = await event.request.formData();
		const entries = JSON.parse(formData.get('entries') as string);
		const totalHours = parseFloat(formData.get('totalHours') as string);

		try {
			// Fetch timesheet to get necessary IDs
			const timesheetResponse = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetDetails/${timesheetId}`,
				{
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			if (!timesheetResponse.ok) {
				throw error(500, 'Failed to fetch timesheet details');
			}

			const timesheetData = await timesheetResponse.json();

			// Convert entries to array format
			const entriesArray = Object.entries(entries)
				.filter(([_, value]: [string, any]) => value.hours > 0)
				.map(([date, value]: [string, any]) => ({
					date,
					startTime: value.startTime,
					endTime: value.endTime,
					hours: value.hours,
					workdayId: value.workdayId || timesheetData.workday?.id || ''
				}));

			console.log('data being submitted', {
				userId: user.id,
				companyId: timesheetData.company.id,
				weekStartDate: timesheetData.timesheet.weekBeginDate,
				entries: entriesArray,
				totalHours
			});
			// Call the submit API to update and change status back to PENDING
			const response = await fetch(
				`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/timesheets/submitTimesheetForCandidate`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userId: user.id,
						companyId: timesheetData.company.id,
						weekStartDate: timesheetData.timesheet.weekBeginDate,
						entries: entriesArray,
						totalHours
					})
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setFlash(
					{ type: 'error', message: errorData.message || 'Failed to resubmit timesheet' },
					event
				);
				return { success: false, error: errorData.message };
			}

			setFlash(
				{ type: 'success', message: 'Timesheet corrected and resubmitted successfully!' },
				event
			);
			return { success: true };
		} catch (err) {
			console.error('Error resubmitting timesheet:', err);
			setFlash({ type: 'error', message: 'Failed to resubmit timesheet' }, event);
			return { success: false, error: 'Failed to resubmit timesheet' };
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
				setFlash({ type: 'error', message: 'Failed to cancel timesheet' }, event);
				return { success: false, error: errorData.message };
			}

			setFlash({ type: 'success', message: 'Timesheet cancelled successfully' }, event);
		} catch (err) {
			console.error('Error cancelling timesheet:', err);
			setFlash({ type: 'error', message: 'Failed to cancel timesheet' }, event);
			return { success: false, error: 'Failed to cancel timesheet' };
		}

		redirect(302, '/timesheets');
	}
};
