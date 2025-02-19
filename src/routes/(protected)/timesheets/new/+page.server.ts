import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { generateToken } from '$lib/server/utils';

export const load: PageServerLoad = async ({ fetch, setHeaders, locals }) => {
  setHeaders({
    'cache-control': 'max-age=60'
  });

  const { user } = locals;

  if (!user) {
    return redirect(303, '/sign-in');
  }

  const userId = user.id;

  const token = generateToken(userId);
  try {
    const response = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/timesheets/getCompaniesForCandidate`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
    const { data: { companies } } = await response.json();

    const profileReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/getCandidateProfile`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

    if (!profileReq.ok) {
      if (profileReq.status === 401) {
        throw error(401, 'Authentication failed');
      }
      throw error(profileReq.status, 'Failed to fetch requisitions');
    }

    const profile = await profileReq.json();

    const workdayReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/timesheets/getWorkdaysForCandidate`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const { data: { workdays } } = await workdayReq.json();

    const timesheetsReq = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/timesheets/getTimesheetsForUser`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

    const timesheets = await timesheetsReq.json();

    console.log(timesheets)

    return {
      user,
      companies,
      workdays,
      timesheets,
      profile
    };
  } catch (error) {
    console.error('Error in timesheets/new load file:', error);
    return {
      companies: []
    };
  }
};
