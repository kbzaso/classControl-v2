<script lang="ts">
	import { enhance } from '$app/forms';

	export let data
	export let form
	console.log(form)
</script>

<main class="grow flex flex-col justify-center">
	<form
		method="POST"
		use:enhance
		action="?/login"
		class="flex flex-col gap-4 border border-gray-800 p-4 rounded-xl"
	>
		<label for="email" class="text-gray-600">
			Email
			<input
				type="email"
				id="email"
				name="email"
				class="input input-bordered input-primary w-full mt-1"
				required
			/>
		</label>
		<label for="password" class="text-gray-600">
			Password
			<input
				type="password"
				name="password"
				id="password"
				class="input input-bordered input-primary w-full mt-1"
				required
			/>
		</label>
	{#if form?.error}
		<p class="text-error">{form?.error}</p>
	{/if}
		<button class="btn btn-success" type="submit">
				Ingresar
		</button>
	</form>
	<a href="/signup" class="text-center mt-2 underline text-warning">Crea tu cuenta</a>
</main>

