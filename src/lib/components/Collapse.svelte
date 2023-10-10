<script lang="ts">
	import 'iconify-icon';
	import { fly, slide } from 'svelte/transition';
	import Badge from './Badge.svelte';
	import { PUBLIC_PROJECT_URL } from '$env/static/public';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { classOpenId } from '$lib/stores.js';

	import { format, formatDistance, formatRelative, subDays } from 'date-fns';
	import { es } from 'date-fns/locale';
	import { utcToZonedTime } from 'date-fns-tz';
	export let data: any;
	export let user: any;
	export let classId: any;

	$: userExists = data.assistants.some((assistant) => assistant.id == user.id);

	const date = utcToZonedTime(new Date(data.when), 'America/Santiago', 'yyyy-MM-dd HH:mm:ss zzz');
	const formattedDate = format(date, 'EEEE d MMMM', { locale: es });
	const formattedTime = format(date, 'HH:mm', { locale: es });

	$: firstThreeChars = data.id.substring(0, 3);

	$: isOpen = $classOpenId === classId ? true : false;

	function toggle() {
		if ($classOpenId === classId) {
			$classOpenId = '';
		} else {
			$classOpenId = classId;
		}
	}
</script>

<button
	class={`active:scale-105 w-full h-fit  p-4 mt-2 space-y-1 flex justify-between min-w-[345px] transition-all ${
		isOpen ? 'bg-blue-950 rounded-t-xl' : 'bg-white/10 rounded-md'
	}`}
	on:click={toggle}
>
	<div class="space-y-2 flex flex-col">
		<h2 class="font-semibold capitalize text-left">
			{formattedDate}
		</h2>
		<div class="text-left flex gap-4">
			<Badge level={data?.level} size={'badge-md'} />
			<span class="flex gap-2 text-warning">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"
					/></svg
				>
				{data.assistants.length}
			</span>
		</div>
	</div>
	<div class="flex gap-1">
		<iconify-icon class="mt-1" icon="ri:time-line" />
		{formattedTime}
		<iconify-icon
			class="mt-1 h-fit text-yellow-300 transition-all"
			class:rotate-180={isOpen}
			icon="ion:chevron-down"
		/>
	</div>
</button>
{#if isOpen}
	<ul class=" space-y-4 border-x border-b border-blue-900 rounded-b-xl p-4" in:fly={{ y: 10 }}>
		{#key isOpen}
			{#each data?.assistants as assistant}
				<li in:fly={{ y: 20 }} out:slide class="flex gap-2 items-center justify-between">
					<figure class="flex items-center gap-2">
						<div class="avatar">
							<div class="w-10 mask mask-squircle">
								<img
									alt="Avatar"
									src={assistant.avatarUrl
										? `${PUBLIC_PROJECT_URL}/storage/v1/object/public/profiles/${assistant.avatarUrl}`
										: 'https://assets.adnradio.cl/2022/03/Stone-Cold-Steve-Austin-WrestleMania-38-WWE.png'}
								/>
							</div>
						</div>
						<p>{assistant.first_name} {assistant.last_name}</p>
						<Badge level={assistant.level} size={'badge-sm'} />
					</figure>
					{#if user.role === 'ADMIN' && $page.data.session.user.id !== assistant.id}
						<a href={`/alumnos/${assistant.id}`} class="btn btn-outline btn-warning"
							><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
								><path
									fill="currentColor"
									d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68ZM16 25c-5.3 0-10.9-3.93-12.93-9C5.1 10.93 10.7 7 16 7s10.9 3.93 12.93 9C26.9 21.07 21.3 25 16 25Z"
								/><path
									fill="currentColor"
									d="M16 10a6 6 0 1 0 6 6a6 6 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z"
								/></svg
							></a
						>
					{/if}
				</li>
			{/each}
			{#if !userExists && user.classesRemaining > 0 && data.max_students >= data.assistants.length}
				<form action="/horarios?/addUserToClass" method="POST" use:enhance>
					<input type="hidden" name="class_id" value={classId} />
					<input type="hidden" name="user_id" value={user.id} />
					<button class="btn btn-success w-full" type="submit"> Asistir </button>
				</form>
			{:else if userExists}
				<form action="/horarios?/deleteUserToClass" method="POST" use:enhance>
					<input type="hidden" name="class_id" value={classId} />
					<input type="hidden" name="user_id" value={user.id} />

					<button class="btn btn-error w-full" type="submit"> No Asistir </button>
				</form>
			{/if}

			{#if user.classesRemaining <= 0 && !userExists && data.level === user.level}
				<p class="text-center text-gray-600">No tienes clases disponibles</p>
			{/if}

			{#if user.role === 'ADMIN'}
				<div class="border border-gray-800 p-4 rounded-xl bg-zinc-900 space-y-4">
					<button class="btn btn-warning w-full" onclick={`my_modal_${firstThreeChars}.showModal()`}
						>Editar</button
					>
					<form action="/horarios?/delete" method="POST" class="w-full" use:enhance>
						<input type="hidden" name="id" value={classId} />
						<button class="btn btn-error w-full btn-outline" type="submit"> Eliminar </button>
					</form>
				</div>
			{/if}
		{/key}
	</ul>
{/if}

<!-- UPDATE CLASS -->
<dialog id={`my_modal_${firstThreeChars}`} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<form
			method="POST"
			action="/horarios?/update"
			class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
			use:enhance
		>
			<h2 class="text-xl uppercase tracking-widest text-yellow-300 text-center">Editar clase</h2>
			<input type="hidden" name="id" value={classId} />
			<label for="when" class="text-gray-600"
				>Fecha

				<input
					type="datetime-local"
					id="when"
					name="when"
					class="input input-bordered input-primary w-full mt-1 text-left"
					min="2023-01-01"
					required
				/>
			</label>

			<label for="level" class="text-gray-600 flex flex-col gap-1">
				Nivel
				<select
					id="level"
					class="select select-primary w-full"
					required
					name="level"
					bind:value={data.level}
				>
					<option value="BASIC">Básico</option>
					<option value="INTERMEDIATE">Intermedio</option>
					<option value="ADVANCED">Avanzado</option>
				</select>
			</label>
			<button
				class="btn btn-success w-full"
				onclick={`my_modal_${firstThreeChars}.close()`}
				type="submit"
			>
				Actualizar
			</button>

			<button
				onclick={`my_modal_${firstThreeChars}.close()`}
				class="btn btn-outline btn-warning"
				type="reset">Cerrar</button
			>
		</form>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
