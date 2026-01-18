<script lang="ts">
	/**
	 * Analytics Page
	 *
	 * Hiring metrics and insights.
	 */
</script>

<svelte:head>
	<title>Analytics - HireFlow</title>
</svelte:head>

<div class="p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
		<p class="text-gray-600 mt-1">Track your hiring performance and candidate insights.</p>
	</div>

	<div class="card p-12 text-center">
		<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
			<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
		</div>
		<h3 class="text-lg font-medium text-gray-900 mb-2">Not enough data</h3>
		<p class="text-gray-500 mb-6">Analytics will become available once you have more hiring activity.</p>
		<a href="/dashboard" class="btn-primary">
			Go to Dashboard
		</a>
	</div>
</div>
