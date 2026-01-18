<script lang="ts">
	/**
	 * Jobs List Page
	 *
	 * Lists all jobs for the organization with quick stats.
	 */

	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	function formatSalary(min: number | null, max: number | null) {
		if (!min && !max) return '';
		if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
		if (min) return `From $${(min / 1000).toFixed(0)}k`;
		return `Up to $${(max! / 1000).toFixed(0)}k`;
	}

	function timeAgo(date: Date | string) {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const diffWeeks = Math.floor(diffDays / 7);

		if (diffDays < 1) return 'Today';
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffWeeks === 1) return '1 week ago';
		return `${diffWeeks} weeks ago`;
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'ACTIVE':
				return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' };
			case 'PAUSED':
				return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Paused' };
			case 'CLOSED':
				return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' };
			case 'DRAFT':
				return { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Draft' };
			default:
				return { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
		}
	}

	function getScoreClass(score: number | null) {
		if (!score) return '';
		if (score >= 7) return 'score-high';
		if (score >= 5) return 'score-mid';
		return 'score-low';
	}
</script>

<svelte:head>
	<title>Jobs - HireFlow</title>
</svelte:head>

<div class="p-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Jobs</h1>
			<p class="text-gray-600 mt-1">Manage your open positions</p>
		</div>
		<Button href="/jobs/new" variant="primary">
			{#snippet children()}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New Job
			{/snippet}
		</Button>
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-3 mb-6">
		<button class="btn-primary btn-sm">All Jobs</button>
		<button class="btn-ghost btn-sm">Active</button>
		<button class="btn-ghost btn-sm">Paused</button>
		<button class="btn-ghost btn-sm">Closed</button>
	</div>

	<!-- Jobs Grid -->
	<div class="grid gap-4">
		{#if data.jobs.length === 0}
			<div class="card p-12 text-center">
				<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
				<p class="text-gray-500 mb-6">Create your first job posting to start receiving applications.</p>
				<Button href="/jobs/new" variant="primary">
					{#snippet children()}
						Create Your First Job
					{/snippet}
				</Button>
			</div>
		{:else}
			{#each data.jobs as job}
				{@const status = getStatusBadge(job.status)}
				{@const salary = formatSalary(job.salaryMin, job.salaryMax)}
				{@const location = job.location || 'Remote'}
				<a href="/jobs/{job.id}" class="card-interactive p-5">
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="text-lg font-semibold text-gray-900">{job.title}</h3>
								<span class="px-2 py-0.5 {status.bg} {status.text} text-xs font-medium rounded">{status.label}</span>
							</div>
							<p class="text-gray-600 mt-1">{location}{salary ? ` • ${salary}` : ''}</p>
						</div>
						<div class="text-right">
							<p class="text-sm text-gray-500">Posted {timeAgo(job.createdAt)}</p>
						</div>
					</div>

					<div class="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
						<div>
							<p class="text-2xl font-bold text-gray-900">{job._count?.applications ?? 0}</p>
							<p class="text-sm text-gray-500">Candidates</p>
						</div>
						<div class="h-8 border-l border-gray-200"></div>
						<div>
							<p class="text-2xl font-bold text-emerald-600">{job.newCount}</p>
							<p class="text-sm text-gray-500">New</p>
						</div>
						<div class="h-8 border-l border-gray-200"></div>
						<div>
							<p class="text-2xl font-bold text-violet-600">{job.interviewingCount}</p>
							<p class="text-sm text-gray-500">Interviewing</p>
						</div>
						<div class="ml-auto flex items-center gap-2">
							{#if job.avgScore}
								<span class="score-ring {getScoreClass(job.avgScore)} w-10 h-10">
									<span class="text-sm font-bold">{job.avgScore}</span>
								</span>
								<span class="text-sm text-gray-500">Avg Score</span>
							{:else}
								<span class="text-sm text-gray-400">No scores yet</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>
