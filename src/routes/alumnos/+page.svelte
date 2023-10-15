<script lang="ts">
		import { fly, slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { PUBLIC_PROJECT_URL } from '$env/static/public';
	import Badge from '$lib/components/Badge.svelte';


	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	$: ({ users, session } = data);

</script>

<section class="mb-40">
	<h1 class="text-xl uppercase tracking-widest text-yellow-300 mb-4">Lista de alumnos</h1>

	<div class="overflow-x-auto border rounded-xl border-blue-900">
		<ul class="space-y-4 border-x border-b border-blue-900 rounded-b-xl p-4">
			{#each users as user}
			<li in:fly={{ y: 20 }} out:slide class="flex gap-2 items-center justify-between">
				<figure class="flex items-center gap-2">
					<div class="avatar">
						<div class="w-10 mask mask-squircle">
							<img
								alt="Avatar"
								src={user.avatarUrl
									? `${PUBLIC_PROJECT_URL}/storage/v1/object/public/profiles/${user.avatarUrl}`
									: 'https://assets.adnradio.cl/2022/03/Stone-Cold-Steve-Austin-WrestleMania-38-WWE.png'}
							/>
						</div>
					</div>
					<a
					href={`/alumnos/${user.id}`}
						class="flex flex-col"
					>
						<p>{user.first_name} {user.last_name}</p>
						<Badge level={user.level} size={'badge-sm'} />
					</a>
				</figure>
			</li>
			{/each}
		</ul>
	</div>
</section>

<button
	class="btn bg-white/10 backdrop-blur-lg rounded-full w-16 h-16 fixed bottom-20 right-6 border-white"
	onclick="my_modal_1.showModal()"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
		><path fill="#f9e710" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg
	>
</button>

<dialog id="my_modal_1" class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<h2 class="text-xl uppercase tracking-widest text-yellow-300 text-center">Agregar Alumno</h2>
		<form
			method="post"
			use:enhance
			class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
		>
			<label for="first_name" class="text-gray-600">
				Nombre
				<input

					type="text"
					id="first_name"
					name="first_name"
					class="input input-bordered input-primary w-full mt-1"
				/></label
			>

			<label for="last_name" class="text-gray-600">
				Apellido
				<input

					type="text"
					id="last_name"
					name="last_name"
					class="input input-bordered input-primary w-full mt-1"
				/></label
			>

			<label for="level" class="text-gray-600 flex flex-col gap-1">
				Nivel
				<select
					id="level"
					class="select select-primary w-full"
					name="level"
				>
					<option value="BASIC">Básico</option>
					<option value="INTERMEDIATE">Intermedio</option>
					<option value="ADVANCED">Avanzado</option>
				</select>
			</label>
			<label for="plan" class="text-gray-600 flex flex-col gap-1">
				Plan
				<select id="plan" class="select select-primary w-full" name="plan" >
					<option value="FOUR">4 clases menusales</option>
					<option value="EIGHT">8 clases mensuales</option>
					<option value="TWELVE">12 clases mensuales</option>
					<option value="SIXTEEN">16 clases mensuales</option>
				</select>
			</label>
			<label for="email" class="text-gray-600">
				Email
				<input
					type="email"
					id="email"
					name="email"
					class="input input-bordered input-primary w-full mt-1"
				/></label
			>
			<label for="password" class="text-gray-600">
				Password
				<input
					type="password"
					name="password"
					id="password"
					class="input input-bordered input-primary w-full mt-1"
				/></label
			>

			<button class="btn btn-success" onclick="my_modal_1.close()" type="submit">
					Agregar Nuevo Alumno
			</button>
			<button onclick="my_modal_1.close()" class="btn btn-outline btn-warning" type="reset"
				>Cerrar</button
			>
		</form>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
