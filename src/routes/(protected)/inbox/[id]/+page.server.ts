import type { PageServerLoad } from './$types';
import { error, fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { generateToken } from '$lib/server/utils';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const messageSchema = z.object({
	body: z.string().min(1, 'Message cannot be empty'),
	isSystemMessage: z.boolean().default(false)
});


export const load: PageServerLoad = async (event) => {
	const { id } = event.params;
	const { user } = event.locals;
	const userId = user?.id;

	if (!user) {
		redirect(302, '/sign-in');
	}

	const token = generateToken(userId);

	try {
		const response = await fetch(
			`${env.CLIENT_APP_DOMAIN}/api/external/inbox/getConversationDetails/${id}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				throw error(401, 'Authentication failed');
			}
			throw error(response.status, 'Failed to fetch conversation');
		}

		const conversation = await response.json();
		const form = await superValidate(event, messageSchema);

		return {
			user,
			form,
			conversation
		};
	} catch (err) {
		console.error('Error loading requisitions:', err);
		throw error(500, 'Internal server error');
	}
};

export const actions = {
	default: async (event) => {
		const { user } = event.locals;
		const userId = user?.id;

		if (!user) {
			redirect(302, '/sign-in');
		}

		const token = generateToken(userId);
		const form = await superValidate(event, messageSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch(`${env.CLIENT_APP_DOMAIN}/api/external/inbox/sendMessage/${event.params.id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`

					},
					body: JSON.stringify({
						senderId: event?.locals?.user?.id,
						body: form.data.body,
						isSystemMessage: form.data.isSystemMessage,
					})
				});

			if (!response.ok) {
				const error = await response.json();
				return fail(response.status, {
					form,
					error: error.message || 'Failed to send message'
				});
			}

			// Reset form after successful submission
			form.data.body = '';

			return { form, success: true };

		} catch (error) {
			console.error('Error sending message:', error);
			return fail(500, {
				form,
				error: 'Failed to send message. Please try again.'
			});
		}
	}
} satisfies Actions;