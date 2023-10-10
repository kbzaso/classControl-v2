import type { Actions } from '../$types';
import { client } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, request, cookies }) => {
	const session = await cookies.get('auth_session');
	if (!session) throw redirect(302, '/');

	const classes = async () =>
		await client.class.findMany({
			orderBy: {
				when: 'asc'
			},
			select: {
				id: true,
				createdAt: true,
				when: true,
				level: true,
				max_students: true,
				assistants: true
			},
			where: {
				when: {
					lt: new Date().toISOString()
				}
			}
		});

	const users = async () =>
		await client.user.findMany({
			orderBy: {
				first_name: 'asc'
			},
			select: {
				id: true,
				first_name: true,
				last_name: true
			},
			where: {
				classesRemaining: {
					gt: 0
				}
			}
		});

	return {
		classes: classes(),
		users: users()
	};
};

export const actions: Actions = {
	addUserToClass: async ({ request, locals }) => {
		const formData = await request.formData();

		const classId = formData.get('class_id');
		const userId = formData.get('user_id');

		try {
			await client.user.update({
				where: {
					id: userId
				},
				data: {
					classesRemaining: {
						decrement: 1
					},
					classes: {
						connect: {
							id: classId
						}
					}
				}
			});
			return { success: true, message: 'Usuario agregado a la clase' };
		} catch (err) {
			console.log(err);
		}
	},
	deleteUserToClass: async ({ request, locals }) => {
		const formData = await request.formData();
		const classId = formData.get('class_id');
		const userId = formData.get('user_id');

		await client.user.update({
			where: {
				id: userId
			},
			data: {
				classesRemaining: {
					increment: 1
				},
				classes: {
					disconnect: {
						id: classId
					}
				}
			}
		});
		return { success: true, message: 'Usuario eliminado de la clase' };
	}
};
