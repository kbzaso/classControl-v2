<script lang="ts">
	import { enhance } from '$app/forms';
	import { LEVEL } from '$lib/constants/const.js';
	import Collapse from '$lib/components/Collapse.svelte';

	export let data;

	interface User {
		id: string;
		name: string;
		role: 'ADMIN' | 'USER';
		level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
	}

	interface Class {
		id: string;
		name: string;
		level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
	}

	function canAccessClass(user: User, classObj: Class): boolean {
		if (user.role === 'ADMIN') {
			return true; // Admin users can access any class
		} else if (user.level === LEVEL.ADVANCED) {
			return true; // Advanced users can access any class
		} else if (user.level === LEVEL.INTERMEDIATE && classObj.level !== LEVEL.ADVANCED) {
			return true; // Intermediate users can access basic and intermediate classes
		} else if (user.level === LEVEL.BASIC && classObj.level === LEVEL.BASIC) {
			return true; // Basic users can only access basic classes
		} else {
			return false; // User cannot access class
		}
	}
	console.log(data);
</script>

<main class="mb-20">
	<p class="font-semibold text-lg">Bienvenido {data.session.user.first_name} 👋</p>

	{#if data.session.user.level === null && data.session.user.role !== 'ADMIN'}
	<p class="text-warning">Contactate con la profesora para actuvar tu cuenta</p>
	{:else}

	<span class="text-warning">Clases disponibles: {data.session.user.classesRemaining}</span>

	{#if data.classes.length === 0}
		<p class="text-sm">Actualmente no hay clases agendadas 😔</p>
	{:else}
		<h1 class="text-2xl font-semibold mt-4">Próximas clases</h1>
		{#each data.classes as training, index}
			{#if canAccessClass(data.session.user, training)}
				<Collapse data={training} user={data.session.user} classId={training.id} />
			{/if}
		{/each}
	{/if}
	{#if data.session.user.role === 'ADMIN'}
		<button
			class="btn backdrop-blur-xl bg-white/10 border-none rounded-full w-16 h-16 fixed bottom-20 right-6"
			onclick="my_modal_5.showModal()"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
				><path fill="#f9e710" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg
			>
		</button>
	{/if}
	{/if}
</main>

<!-- ADD CLASS -->
<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box">
		<!-- <SuperDebug data={$form} /> -->
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<form
			method="POST"
			action="?/create"
			use:enhance
			class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
		>
			<h2 class="text-xl uppercase tracking-widest text-yellow-300 text-center">Agregar clase</h2>
			<label for="when" class="text-gray-600"
				>Fecha

				<input
					type="datetime-local"
					id="when"
					name="when"
					class="input input-bordered input-primary w-full mt-1 text-left"
					required
				/>
			</label>
			<!-- {#if $errors.when}
			<FormAlert bind:errorMessage={$errors.when} />
		{/if} -->

			<label for="level" class="text-gray-600 flex flex-col gap-1">
				Nivel
				<select id="level" class="select select-primary w-full" name="level">
					<option value="BASIC">Básico</option>
					<option value="INTERMEDIATE">Intermedio</option>
					<option value="ADVANCED">Avanzado</option>
				</select>
			</label>
			<!-- {#if $errors.level}
			<FormAlert bind:errorMessage={$errors.level} />
		{/if} -->
			<button class="btn btn-success" onclick="my_modal_5.close()" type="submit"> Crear </button>
			<button onclick="my_modal_5.close()" class="btn btn-outline btn-warning" type="reset"
				>Cerrar</button
			>
		</form>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
