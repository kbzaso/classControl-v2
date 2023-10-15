<script lang="ts">
	import { enhance } from '$app/forms';
	import { LEVEL } from '$lib/constants/const.js';
	import HistoryCollapse from '$lib/components/HistoryCollapse.svelte';

	export let data;
	export let form;
	$: ({ users } = data);

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
</script>

<main class="mb-20">
	<h1 class="text-2xl font-semibold mt-4">Clases pasadas</h1>
	{#each data.classes as training, index}
		{#if canAccessClass(data.session.user, training)}
			<HistoryCollapse data={training} user={data.session.user} {users} {training} form={form} />
		{/if}
	{/each}
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
			<label for="level" class="text-gray-600 flex flex-col gap-1">
				Nivel
				<select id="level" class="select select-primary w-full" name="level">
					<option value="BASIC">Básico</option>
					<option value="INTERMEDIATE">Intermedio</option>
					<option value="ADVANCED">Avanzado</option>
				</select>
			</label>
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
