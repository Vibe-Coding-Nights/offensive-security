<script lang="ts">
	/**
	 * Signup Page
	 *
	 * User registration page.
	 */

	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let company = $state('');
	let error = $state<string | null>(null);
	let isLoading = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = null;

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password, company })
			});

			if (!response.ok) {
				const data = await response.json();
				error = data.message || 'Registration failed';
				return;
			}

			// Redirect to dashboard
			window.location.href = '/dashboard';
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - HireFlow</title>
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
			<h1 class="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
			<p class="mt-2 text-gray-600">Start hiring smarter with AI-powered screening.</p>
		</div>

		<!-- Signup Form -->
		<form onsubmit={handleSubmit} class="card p-8">
			{#if error}
				<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
					{error}
				</div>
			{/if}

			<div class="space-y-5">
				<Input
					label="Full name"
					name="name"
					bind:value={name}
					placeholder="Jane Doe"
					required
				/>

				<Input
					label="Work email"
					name="email"
					type="email"
					bind:value={email}
					placeholder="you@company.com"
					required
				/>

				<Input
					label="Company name"
					name="company"
					bind:value={company}
					placeholder="Acme Inc."
					required
				/>

				<Input
					label="Password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="At least 8 characters"
					required
				/>

				<Input
					label="Confirm password"
					name="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm your password"
					required
				/>

				<Button type="submit" variant="primary" size="lg" loading={isLoading}>
					{#snippet children()}
						{isLoading ? 'Creating account...' : 'Create account'}
					{/snippet}
				</Button>
			</div>
		</form>

		<!-- Demo note -->
		<div class="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-xl">
			<p class="text-sm text-violet-700">
				This is a demo application. For testing, use the demo credentials on the login page.
			</p>
		</div>

		<p class="mt-6 text-center text-sm text-gray-600">
			Already have an account?
			<a href="/login" class="text-violet-600 hover:text-violet-700 font-medium">Sign in</a>
		</p>
	</div>
</div>
