import { parseISO, startOfWeek, format, parse } from 'date-fns';

// Function to get the correct weekBeginDate regardless of timezone
export function getConsistentWeekBeginDate(dateString: string): string {
	// Parse the date string
	const date = parse(dateString, 'yyyy-MM-dd', new Date());

	// Get start of week (Sunday) for this date
	const weekBegin = startOfWeek(date);

	// Format as YYYY-MM-DD string for consistent comparison
	return format(weekBegin, 'yyyy-MM-dd');
}
