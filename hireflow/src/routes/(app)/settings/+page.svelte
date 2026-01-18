<script lang="ts">
	/**
	 * Settings Page
	 *
	 * Organization and account settings.
	 */
</script>

<svelte:head>
	<title>Settings - HireFlow</title>
</svelte:head>

<div class="p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Settings</h1>
		<p class="text-gray-600 mt-1">Manage your account and organization preferences.</p>
	</div>

	<div class="grid gap-6">
		<!-- Organization Settings -->
		<div class="card p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
			<div class="space-y-4">
				<div>
					<label class="label">Company Name</label>
					<input type="text" class="input" value="Acme Corp" disabled />
				</div>
				<div>
					<label class="label">Industry</label>
					<input type="text" class="input" value="Technology" disabled />
				</div>
			</div>
		</div>

		<!-- Account Settings -->
		<div class="card p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Account</h2>
			<div class="space-y-4">
				<div>
					<label class="label">Name</label>
					<input type="text" class="input" value="John Doe" disabled />
				</div>
				<div>
					<label class="label">Email</label>
					<input type="email" class="input" value="john@company.com" disabled />
				</div>
			</div>
		</div>

		<!-- AI Settings -->
		<div class="card p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium text-gray-900">Auto-analyze resumes</p>
						<p class="text-sm text-gray-500">Automatically analyze incoming applications</p>
					</div>
					<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600">
						<span class="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
					</button>
				</div>
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium text-gray-900">Include AI recommendations</p>
						<p class="text-sm text-gray-500">Show interview/pass recommendations from AI</p>
					</div>
					<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600">
						<span class="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
