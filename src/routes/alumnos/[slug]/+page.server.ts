import type { Actions, PageServerLoad } from './$types';
import { client } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Plan } from '@prisma/client';
import { PLAN } from '$lib/constants/const';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
	const session =  await cookies.get('auth_session');
	if (!session) throw redirect(302, '/');	
	
	const user = await client.user.findUnique({
		where: {
			id: params.slug
		},
		include: {
			payments: {
				orderBy: {
					expiresAt: 'desc'
				},
				take: 1
			}
		}
	});

	return { user };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');

		try {
			await client.payment.deleteMany({
				where: {
					user: {
						id: String(id)
					}
				}
			});
			await client.user.delete({
				where: {
					id: String(id)
				}
			});
		} catch (error) {
			console.log(error);
		}
		throw redirect(302, '/alumnos');
	},
	update: async (event) => {
		const formData = await event.request.formData();

		const id = formData.get('id');
		const level = formData.get('level');

		const user = await client.user.update({
			where: {
				id: id
			},
			data: {
				level
			}
		});
		return {
			user
		};
	},
	addPayment: async (event) => {
		const formData = await event.request.formData();

		const id = formData.get('id');
		const amount = formData.get('amount');
		const date = formData.get('expire');
		const plan = formData.get('plan') as string;
		const expire = new Date(date).toISOString();

		let classToAdd = 0;
		if (plan === PLAN.FOUR) classToAdd = 4;
		if (plan === PLAN.EIGHT) classToAdd = 8;
		if (plan === PLAN.TWELVE) classToAdd = 12;
		if (plan === PLAN.SIXTEEN) classToAdd = 16;

		try {
			await client.user.update({
				where: {
					id: id
				},
				data: {
					classesRemaining: {
						increment: classToAdd
					},
					payments: {
						create: {
							amount: Number(amount),
							expiresAt: expire,
							plan: plan as Plan
						}
					}
				}
			});

			return {
				success: true,
				message: 'Pago agregado'
			};
		} catch (error) {
			return console.log(error);
		}
	}
};
