import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { auth, client } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Level } from '@prisma/client';
import { error } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ cookies }) => {

	const session = await cookies.get("auth_session")
	if (!session) throw redirect(302, "/");


	const users = await client.user.findMany({
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			level: true,
			avatarUrl: true,
			classesRemaining: true,
		},
		where: {
			role: {
				equals: "USER"
			}
		}
	});
	
	return {
		users,
	};
};

export const actions: Actions = {
	default: async ( event ) => {
		const form = await event.request.formData();

		const first_name = form.get("first_name");
		const last_name = form.get("last_name");
		const email = form.get("email");
		const password = form.get("password");
		const level = form.get("level");
		const plan = form.get("plan");

		try {
			await auth.createUser({
				key: {
					providerId: "username", // auth method
					providerUserId: email.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					first_name,
					last_name,
					email,
					plan,
					level: level as Level
				}
			});
		} catch (e) {
			// this part depends on the database you're using
			// check for unique constraint error in user table
			console.log(e);
			if (
				e instanceof PrismaClientKnownRequestError 
			) {
				throw error(400, {
					message:  'El correo ya esta registrado'
				});
			}
			throw error(400, {
				message:  'Ocurrio un error inesperado'
			});
		}
	}
};
