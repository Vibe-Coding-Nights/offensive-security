<script lang="ts">
	/**
	 * Login Page
	 *
	 * Simple authentication for the demo.
	 */

	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state<string | null>(null);
	let isLoading = $state(false);

	// Get redirect URL from query params, default to /dashboard
	const redirectTo = $derived($page.url.searchParams.get('redirect') || '/dashboard');

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = null;
		isLoading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				const data = await response.json();
				error = data.message || 'Invalid credentials';
				return;
			}

			// Redirect to original destination or dashboard
			window.location.href = redirectTo;
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - HireFlow</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
	<div class="max-w-md w-full">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-flex items-center gap-2">
				<div class="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
					<span class="text-white font-bold text-lg">H</span>
				</div>
				<span class="text-xl font-bold text-gray-900">HireFlow</span>
			</a>
			<h1 class="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h1>
			<p class="mt-2 text-gray-600">Welcome back! Please enter your credentials.</p>
		</div>

		<!-- Login Form -->
		<form onsubmit={handleSubmit} class="card p-8">
			{#if error}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
					{error}
				</div>
			{/if}

			<div class="space-y-5">
				<Input
					label="Email address"
					name="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					required
				/>

				<Input
					label="Password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
					required
				/>


				<Button type="submit" variant="primary" size="lg" loading={isLoading}>
					{#snippet children()}
						{isLoading ? 'Signing in...' : 'Sign in'}
					{/snippet}
				</Button>
			</div>
		</form>

		<!-- Demo credentials hint -->
		<div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
			<p class="text-sm font-medium text-amber-800">Demo Credentials</p>
			<p class="text-sm text-amber-700 mt-1">
				Email: <code class="bg-amber-100 px-1 rounded">recruiter@acme.com</code><br />
				Password: <code class="bg-amber-100 px-1 rounded">password123</code>
			</p>
		</div>

		<p class="mt-6 text-center text-sm text-gray-600">
			Don't have an account?
			<a href="/signup" class="text-violet-600 hover:text-violet-700 font-medium">Sign up</a>
		</p>
	</div>
</div>
