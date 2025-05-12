import { PUBLIC_CLIENT_APP_DOMAIN } from '$env/static/public';
import { generateToken } from '../utils';
import { error } from '@sveltejs/kit';

export async function getSavedJobs(userId: string, token: string | undefined = undefined) {
	try {
		// const cacheKey = `${SAVED_JOBS_CACHE_KEY}:${userId}`;

		// Try cache first
		// const cachedBookmarks = await redis.smembers(cacheKey);
		// console.log({ cachedBookmarks });
		// if (cachedBookmarks.length > 0) {
		// 	return cachedBookmarks.map(Number);
		// }

		if (!token) token = generateToken(userId);

		// Cache miss - fetch from server
		const res = await fetch(
			`${PUBLIC_CLIENT_APP_DOMAIN}/api/external/getSavedOpeningsForCandidate`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		const rows = await res.json();

		const ids: number[] = rows.map(
			(row: { id: string; requisitionId: number; candidateId: string; status: string }) => {
				return row.requisitionId;
			}
		);

		// if (ids.length > 0) {
		// 	await redis.sadd(cacheKey, ids.toString());
		// 	await redis.expire(cacheKey, 3600); // 1 hour
		// }

		return ids;
	} catch (err) {
		console.log(err);
		throw error(500, 'Error getting saved jobs from cache or database');
	}
}

export async function toggleBookmark(
	userId: string,
	requisitionId: string,
	token: string | undefined = undefined
) {
	// const cacheKey = `${SAVED_JOBS_CACHE_KEY}:${userId}`;
	if (!token) token = generateToken(userId);

	try {
		// get bookmarks
		const rows = await getSavedJobs(userId);

		// if exists
		if (rows.length > 0) {
			// delete rows
			// await redis.srem(cacheKey, requisitionId);
			return false;
		} else {
			// add to db
			// await redis.sadd(cacheKey, requisitionId);
			return true;
		}
	} catch (err) {
		console.log(err);
		throw error(500, 'Something went wrong');
	}
}
