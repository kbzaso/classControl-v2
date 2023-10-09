import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }: { locals: any }) => {
	try {
		const session = await locals.auth.validate();
		locals.auth.session = session;
		return {
			session: locals.auth.session
		};
	} catch (error) {
		console.log(error);
	}
};
