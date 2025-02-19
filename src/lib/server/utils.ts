import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

// Function to generate a token
export function generateToken(userId: string | undefined): string {
	if (!userId) throw error(500, 'User ID not provided');
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}
