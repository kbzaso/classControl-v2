// routes/login/+page.server.ts
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = await cookies.get('auth_session');
	if (session) throw redirect(302, '/horarios');	
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			// find user by key
			// and validate password
			const user = await auth.useKey('username', email.toLowerCase(), password);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist
				// or invalid password
				return fail(400, {
					error: 'Usuario no existe o cont craseña incorrecta'
				});
			}
			return fail(500, {
				error: 'Error del servidor'
			});
		}
		// // redirect to
		// // make sure you don't throw inside a try/catch block!
		throw redirect(302, '/horarios');
	}
};
