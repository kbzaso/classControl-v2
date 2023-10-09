import type { Actions } from '../$types';
import { client } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, request, cookies }) => {
	const session = await cookies.get('auth_session');
	if (!session) throw redirect(302, '/');	

	const classes = await client.class.findMany({
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

	return {
		classes
	};
};

export const actions: Actions = {
	// create a new class
	create: async (event) => {
		const formData = await event.request.formData();

		const date = formData.get('when');
		const when = new Date(date).toISOString();
		const level = formData.get('level');

		try {
			const newClass = await client.class.create({
				data: {
					when: when,
					level: level
				}
			});
			return { newClass, success: true, message: 'Clase creada' };
		} catch (err) {
			console.log(err);
		}
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const classes = await client.class.delete({
			where: {
				id: id
			}
		});
		return { success: true, message: 'Clase eliminada', classes };
	},
	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		const date = formData.get('when');
		const when = date !== null ? new Date(date).toISOString() : undefined;
		const level = formData.get('level') as Level;

		try {
			if (when !== undefined && level !== null) {
				await client.class.update({
					where: {
						id: id?.toString()
					},
					data: {
						when: when,
						level: level
					}
				});
				return { success: true, message: 'Clase actualizada' };
			} else {
				return { success: false, message: 'Level cannot be null' };
			}
		} catch (err) {
			console.log(err);
		}
	},
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
