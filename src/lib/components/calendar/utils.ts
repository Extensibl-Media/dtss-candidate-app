import { formatTimestampForDisplay, getUserTimezone } from '$lib/_helpers/UTCTimezoneUtils';
import { format, parseISO } from 'date-fns';

export type CalendarEvent = {
	start: Date;
	end: Date;
	title: string;
	resourceIds?: string[];
	resourceId?: string;
	id: string;
	extendedProps: Record<string, any>;
};

export function createEvents() {
	const days = [];
	for (let i = 0; i < 7; ++i) {
		const day = new Date();
		const diff = i - day.getDay();
		day.setDate(day.getDate() + diff);
		days[i] = day.getFullYear() + '-' + _pad(day.getMonth() + 1) + '-' + _pad(day.getDate());
	}

	return [
		{ start: days[0] + ' 00:00', end: days[0] + ' 09:00', resourceId: 1, display: 'background' },
		{ start: days[1] + ' 12:00', end: days[1] + ' 14:00', resourceId: 2, display: 'background' },
		{ start: days[2] + ' 17:00', end: days[2] + ' 24:00', resourceId: 1, display: 'background' },
		{
			start: days[0] + ' 10:00',
			end: days[0] + ' 14:00',
			resourceId: 1,
			title: 'The calendar can display background and regular events',
			color: '#FE6B64'
		},
		{
			start: days[1] + ' 16:00',
			end: days[2] + ' 08:00',
			resourceId: 2,
			title: 'An event may span to another day',
			color: '#B29DD9'
		},
		{
			start: days[2] + ' 09:00',
			end: days[2] + ' 13:00',
			resourceId: 2,
			title: 'Events can be assigned to resources and the calendar has the resources view built-in',
			color: '#779ECB'
		},
		{
			start: days[3] + ' 14:00',
			end: days[3] + ' 20:00',
			resourceId: 1,
			title: '',
			color: '#FE6B64'
		},
		{
			start: days[3] + ' 15:00',
			end: days[3] + ' 18:00',
			resourceId: 1,
			title: 'Overlapping events are positioned properly',
			color: '#779ECB'
		},
		{
			start: days[5] + ' 10:00',
			end: days[5] + ' 16:00',
			resourceId: 2,
			title: { html: 'You have complete control over the <i><b>display</b></i> of events…' },
			color: '#779ECB'
		},
		{
			start: days[5] + ' 14:00',
			end: days[5] + ' 19:00',
			resourceId: 2,
			title: '…and you can drag and drop the events!',
			color: '#FE6B64'
		},
		{
			start: days[5] + ' 18:00',
			end: days[5] + ' 21:00',
			resourceId: 2,
			title: '',
			color: '#B29DD9'
		},
		{
			start: days[1],
			end: days[3],
			resourceId: 1,
			title: 'All-day events can be displayed at the top',
			color: '#B29DD9',
			allDay: true
		}
	];
}

export function _pad(num: number) {
	const norm = Math.floor(Math.abs(num));
	return (norm < 10 ? '0' : '') + norm;
}

const requisitionStatusColorEnum = {
	OPEN: '#3b82f6',
	FILLED: '#31c48d',
	UNFULFILLED: '#ff8a4c',
	CANCELED: '#f05252'
} as const;

export function convertRecurrenceDayToEvent(data: {
	recurrenceDay: { id?: any; date?: any; startTime?: any; endTime?: any; status?: any };
	requisition: { id: any; title?: any; hourlyRate?: number };
	workday: any | null;
	company: { id: string; name?: string; logo?: string };
	location: { completeAddress: string };
}) {
	const {
		recurrenceDay: { id: recurrenceDayId, date, startTime, endTime, status },
		requisition,
		workday,
		company,
		location
	} = data;
	const isoDate = parseISO(date);
	const dateString = format(isoDate, 'yyyy-MM-dd');

	// Get reference timezone from the requisition
	const timezone = getUserTimezone() || 'America/New_York'; // Default to EST if no timezone is set

	// Convert UTC timestamps to local timezone display times
	// We need to create proper Date objects from the timestamps
	const localDayStart = formatTimestampForDisplay(startTime, timezone);
	const localDayEnd = formatTimestampForDisplay(endTime, timezone);

	return {
		start: localDayStart, // Display the local start time
		end: localDayEnd, // Display the local end time
		resourceIds: [requisition.id, recurrenceDayId],
		title: requisition.title,
		data: requisition,
		color: status
			? requisitionStatusColorEnum[status as keyof typeof requisitionStatusColorEnum]
			: '#b3b3b3',
		extendedProps: {
			type: 'RECURRENCE_DAY',
			requisition: { ...requisition },
			recurrenceDay: { ...data.recurrenceDay },
			workday: { ...workday },
			company: { ...company },
			location: { ...location }
		}
	};
}
