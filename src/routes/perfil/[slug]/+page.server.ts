import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { auth, client } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { supabase } from '$lib/server/supabase';
import type { Plan } from '@prisma/client';


function generateRandomFilename(extension: string): string {
	const timestamp = Date.now();
	const randomNumber = Math.floor(Math.random() * 1000000);
	return `${timestamp}-${randomNumber}.${extension}`;
  }

export const load: PageServerLoad = async ({ params, cookies }) => {
	const session =  await cookies.get('auth_session');
	if (!session) throw redirect(302, '/');	
	// bring my user info from the database
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

	return {
		user,
	};
};

export const actions: Actions = {
	updateAvatar: async ({params, request}) => {
		const formData = await request.formData();


		const avatarFile = formData.get('file') as File;
		console.log(avatarFile);
		const mimeType = avatarFile?.type;
		const parts = mimeType.split('/');
		const subtype = parts[1];

		const filename = generateRandomFilename(subtype);

		
		if (avatarFile instanceof File) {
		try {
			// upload profile image to supabase storage
			const { data } = await supabase.storage
				.from('profiles')
				.upload(`${params.slug}/${filename}`, avatarFile as File, {
					cacheControl: '3600',
					upsert: true
			});

			const user = await client.user.update({
				where: {
					id: params.slug
				},
				data: {
					avatarUrl: data?.path
				}
			});
			return {
				success: true, message: 'Avatar actualizado', user
			};
		} catch (e) {
			return fail(500, {
				success: false, message: 'Error al actualizar el avatar'
			});
		}
	}
	},
	update: async ({params, request}) => {
		const form = await request.formData();


		const first_name = form.get('first_name');
		const last_name = form.get('last_name');
		const plan = form.get("plan") || 'FOUR';
		
		try {
			const user = await client.user.update({
				where: {
					id: params.slug
				},
				data: {
					first_name,
					last_name,
					plan: plan as Plan,
				}
			});
			return {
				user
			};
		} catch (e) {
			if (e instanceof LuciaError || e instanceof PrismaClientKnownRequestError) {
				// user does not exist
				// or invalid password
				throw fail(401, {
					error: e.message
				})
				};
			}
			return fail(500, {
				message: 'Error al actualizar el usuario'
			});
		}
	}

