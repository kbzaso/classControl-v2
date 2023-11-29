<script lang="ts">
	import 'iconify-icon';
	import { fly, slide } from 'svelte/transition';
	import Badge from './Badge.svelte';
	import { PUBLIC_PROJECT_URL } from '$env/static/public';
	import { enhance } from '$app/forms';
	import { classOpenId } from '$lib/stores.js';

	import { format, formatDistance, formatRelative, subDays } from 'date-fns';
	import es from 'date-fns/locale/es/index'
	import { utcToZonedTime } from 'date-fns-tz';

	export let data: any;
	export let user: any;
	export let users: any;
	export let training: any;
	export let form: any;

	const date = utcToZonedTime(new Date(data.when), 'America/Santiago', 'yyyy-MM-dd HH:mm:ss zzz');
	const formattedDate = format(date, 'EEEE d MMMM', { locale: es });
	const formattedTime = format(date, 'HH:mm', { locale: es });

	$: firstThreeChars = data.id.substring(0, 5);

	$: isOpen = $classOpenId === training.id ? true : false;

	function toggle() {
		if ($classOpenId === training.id) {
			$classOpenId = '';
		} else {
			$classOpenId = training.id;
		}
	}

	$: filteredUsers = users.filter(
		(user) => !training.assistants.some((assistant) => assistant.id === user.id)
	);
</script>

<button
	class={`active:scale-105 w-full h-fit  p-4 mt-2 space-y-1 flex justify-between min-w-[345px] transition-all ${
		isOpen ? 'bg-blue-950 rounded-t-xl' : 'bg-white/10 rounded-md'
	}`}
	on:click={toggle}
>
	<div class="space-y-2 flex flex-col">
		<h2 class="font-semibold capitalize">
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
		<span>{formattedTime}</span>
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
						<a href={assistant.role !== 'MASTER' ? `/alumnos/${assistant.id}`: ''} class="flex flex-col">
							<p>{assistant.first_name} {assistant.last_name}</p>
							<Badge level={assistant.level} size={'badge-sm'} />
						</a>
					</figure>

					<form method="POST" action="?/deleteUserToClass" use:enhance>
						<input type="hidden" name="class_id" value={training.id} />
						<input type="hidden" name="user_id" value={assistant.id} />
						<button type="submit" class="btn btn-sm btn-circle btn-ghost text-error">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM9 17h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"
								/></svg
							>
						</button>
					</form>
				</li>
			{/each}

			{#if form?.error}
				<p class="text-error">{form?.error}</p>
			{/if}

			{#if user.role === 'ADMIN'}
				<div>
					<button class="btn btn-success w-full" onclick={`my_modal_${firstThreeChars}.showModal()`}
						>Agregar alumno</button
					>
				</div>
			{/if}
		{/key}
	</ul>
{/if}

<!-- ADD USER TO CLASS -->
<dialog id={`my_modal_${firstThreeChars}`} class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<form
			method="POST"
			action="?/addUserToClass"
			class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
			use:enhance
		>
			<h2 class="text-xl uppercase tracking-widest text-yellow-300 text-center">Agregar alumno</h2>
			<input type="hidden" name="class_id" value={training.id} />

			<label for="level" class="text-gray-600 flex flex-col gap-1">
				Alumnos
				<select id="user_id" class="select select-primary w-full" required name="user_id">
					{#each filteredUsers as user}
						<option value={user.id}>{user.first_name} {user.last_name}</option>
					{/each}
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
