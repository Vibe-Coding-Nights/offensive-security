<script lang="ts">
	/**
	 * Candidates Page
	 *
	 * View all candidates across all jobs.
	 */
</script>

<svelte:head>
	<title>Candidates - HireFlow</title>
</svelte:head>

<div class="p-6">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Candidates</h1>
		<p class="text-gray-600 mt-1">View and manage all candidates across your jobs.</p>
	</div>

	<div class="card p-12 text-center">
		<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
			<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
			</svg>
		</div>
		<h3 class="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
		<p class="text-gray-500 mb-6">Candidates will appear here once people apply to your jobs.</p>
		<a href="/jobs" class="btn-primary">
			View Jobs
		</a>
	</div>
</div>
