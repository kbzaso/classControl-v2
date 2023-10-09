<script lang="ts">
	import type { PageData } from './$types';

	import { LEVEL, PLAN } from '$lib/constants/const.js';
	import Badge from '$lib/components/Badge.svelte';
	import { PUBLIC_PROJECT_URL } from '$env/static/public';
	import { enhance } from '$app/forms';

	import { dateFormat } from '$lib/utils';

	export let data: PageData;

	$: ({ user } = data);

	console.log(data)
</script>

<main class="mt-4 mb-20">
	<section class="flex flex-col">
		<div class="w-full flex flex-col items-center gap-4">
			<div class="avatar">
				<div class="w-56 mask mask-squircle">
					<img
						alt="Avatar"
						src={data?.user?.avatarUrl
							? `${PUBLIC_PROJECT_URL}/storage/v1/object/public/profiles/${data?.user?.avatarUrl}`
							: 'https://assets.adnradio.cl/2022/03/Stone-Cold-Steve-Austin-WrestleMania-38-WWE.png'}
					/>
				</div>
			</div>
			<div class="flex flex-col items-center gap-1">
				<h1 class="text-2xl text-center uppercase tracking-widest text-yellow-300">
					{data?.user?.first_name}
					{data?.user?.last_name}
				</h1>
				<span>{data?.user?.email}</span>
			</div>
		</div>
		<aside class="border border-gray-800 p-4 rounded-xl my-4">
			<ul class="space-y-2 text-lg">
				<li class="">
					<span class="uppercase tracking-widest text-yellow-300 text-left text-sm">Nivel: </span>
					<Badge level={user?.level} size={'badge-md'} />
				</li>
				<li class="flex items-center gap-2">
					<span class="uppercase tracking-widest text-yellow-300 text-left text-sm">Plan: </span>
					{#if PLAN[user?.plan] === 'FOUR'}
						<p>4 clases - $20.000</p>
					{:else if PLAN[user?.plan] === 'EIGHT'}
						<p>8 clases - $30.000</p>
					{:else if PLAN[user?.plan] === 'TWELVE'}
						<p>12 clases - $42.000</p>
					{:else if PLAN[user?.plan] === 'SIXTEEN'}
						<p>16 clases - $52.000</p>
					{/if}
				</li>
				<li class="flex items-center gap-2">
					<span class="uppercase tracking-widest text-yellow-300 text-left text-sm"
						>Clases disponibles:
					</span>
					<p>{data.user?.classesRemaining}</p>
				</li>
				<li class="flex items-center gap-2">
					<span class="uppercase tracking-widest text-yellow-300 text-left text-sm"
						>Su plan termina:
					</span>
					{#if data.user?.payments?.length === 0}
						<p class="text-sm">No hay registro</p>
					{:else}
					<p class="text-md">{dateFormat(data.user?.payments[0]?.expiresAt, 'es-CL', { month: 'numeric', day: 'numeric', year: "numeric", })}</p>
					{/if}
				</li>
			</ul>
			<button class="btn w-full mt-4 btn-warning" onclick="my_modal_3.showModal()"> Editar</button>
			<!-- DELETE FORM -->
			<form method="POST" action="?/delete" use:enhance class="mt-4">
				<input type="hidden" name="id" value={data.user?.id} />
				<button class="btn btn-error w-full" type="submit">
						Eliminar alumno
				</button>
			</form>
			<button class="btn w-full mt-4 btn-success" onclick="my_modal_4.showModal()">
				Agregar Pago</button
			>
		</aside>
	</section>

	<!-- UPDATE FORM -->
	<dialog id="my_modal_3" class="modal modal-bottom sm:modal-middle">
		<form method="dialog" class="modal-box">
			<!-- <SuperDebug data={$form} /> -->
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			<span class="text-xl uppercase tracking-widest text-yellow-300 text-center">Editar</span>

			<form
				method="POST"
				use:enhance
				action="?/update"
				class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
			>
				<input type="hidden" name="id" value={user?.id} />
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
				<button class="btn btn-success" onclick="my_modal_3.close()" type="submit">
						Guardar
				</button>
				<button onclick="my_modal_3.close()" class="btn btn-outline btn-warning" type="reset"
					>Cerrar</button
				>
			</form>
		</form>
	</dialog>

	<!-- ADD PAYMENT FORM -->
	<dialog id="my_modal_4" class="modal modal-bottom sm:modal-middle">
		<form method="dialog" class="modal-box">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			<div class="flex justify-center">
				<span class="text-xl uppercase tracking-widest text-yellow-300 text-center"
					>Agregar pago</span
				>
			</div>

			<form
				method="POST"
				action="?/addPayment"
				use:enhance
				class="mt-4 flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
			>
				<input type="hidden" name="id" value={user?.id} />
				<label for="amount" class="text-gray-600">
					Monto
					<input
						type="number"
						id="amount"
						name="amount"
						class="input input-bordered input-primary w-full mt-1"
						min="0"
						required
					/></label
				>
				<label for="plan" class="text-gray-600 flex flex-col gap-1">
					Plan
					<select id="plan" class="select select-primary w-full" name="plan">
						<option value="FOUR">4 clases - $20.000</option>
						<option value="EIGHT">8 clases - $30.000</option>
						<option value="TWELVE">12 clases - $42.000</option>
						<option value="SIXTEEN">16 clases - $52.000</option>
					</select>
				</label>

				<label for="expire" class="text-gray-600"
					>Fecha de expiración

					<input
						type="datetime-local"
						id="expire"
						name="expire"
						class="input input-bordered input-primary w-full mt-1 text-left"
					/>
				</label>

				<button class="btn btn-success" type="submit">
						Guardar
				</button>
				<button onclick="my_modal_4.close()" class="btn btn-outline btn-warning" type="reset"
					>Cerrar</button
				>
			</form>
		</form>
	</dialog>

	<button on:click={() => history.back()} class="btn btn-outline w-full btn-warning">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
			><path
				fill="currentColor"
				d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"
			/></svg
		>
		Regresar</button
	>
</main>
