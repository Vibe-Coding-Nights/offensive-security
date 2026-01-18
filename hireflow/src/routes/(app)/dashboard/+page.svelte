<script lang="ts">
	/**
	 * Dashboard Page
	 *
	 * Overview of hiring activity across all jobs.
	 * Designed for ambient awareness and quick navigation.
	 */

	import StagePill from '$lib/components/ui/StagePill.svelte';

	let { data } = $props();

	function getScoreColor(score: number | null) {
		if (!score) return 'bg-gray-100 text-gray-600';
		if (score >= 8) return 'bg-emerald-100 text-emerald-600';
		if (score >= 5) return 'bg-amber-100 text-amber-600';
		return 'bg-red-100 text-red-600';
	}

	function timeAgo(date: Date | string) {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffHours < 1) return 'Just now';
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return '1d ago';
		return `${diffDays}d ago`;
	}
</script>

<svelte:head>
	<title>Dashboard - HireFlow</title>
</svelte:head>

<div class="p-6">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
		<p class="text-gray-600 mt-1">Welcome back. Here's what's happening with your hiring.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
		<!-- Active Jobs -->
		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Active Jobs</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{data.stats.activeJobs}</p>
				</div>
				<div class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- Total Candidates -->
		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Total Candidates</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{data.stats.totalApplications}</p>
				</div>
				<div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- Pending Review -->
		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Pending Review</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{data.stats.pendingReview}</p>
				</div>
				<div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
			</div>
		</div>

		<!-- Interviews Scheduled -->
		<div class="card p-5">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-500">Interviews</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{data.stats.interviewCount}</p>
				</div>
				<div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
		</div>
	</div>

	<!-- Two Column Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Recent Candidates -->
		<div class="lg:col-span-2">
			<div class="card">
				<div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
					<h2 class="font-semibold text-gray-900">Recent Candidates</h2>
					<a href="/jobs" class="text-sm text-violet-600 hover:text-violet-700">View all</a>
				</div>

				<div class="divide-y divide-gray-200">
					{#if data.recentApplications.length === 0}
						<div class="p-8 text-center text-gray-500">
							<p>No applications yet</p>
						</div>
					{:else}
						{#each data.recentApplications as app}
							<a href="/jobs/{app.job.id}" class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors block">
								<div class="w-12 h-12 rounded-full {getScoreColor(app.matchScore)} flex items-center justify-center">
									<span class="text-lg font-bold">{app.matchScore ?? '?'}</span>
								</div>
								<div class="flex-1 min-w-0">
									<p class="font-medium text-gray-900">{app.candidateName}</p>
									<p class="text-sm text-gray-500 truncate">{app.job.title} • Applied {timeAgo(app.createdAt)}</p>
								</div>
								<StagePill stage={app.stage} />
							</a>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Active Jobs -->
		<div>
			<div class="card">
				<div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
					<h2 class="font-semibold text-gray-900">Active Jobs</h2>
					<a href="/jobs" class="text-sm text-violet-600 hover:text-violet-700">View all</a>
				</div>

				<div class="divide-y divide-gray-200">
					{#if data.jobs.length === 0}
						<div class="p-8 text-center text-gray-500">
							<p>No active jobs</p>
						</div>
					{:else}
						{#each data.jobs as job}
							<a href="/jobs/{job.id}" class="p-4 block hover:bg-gray-50 transition-colors">
								<p class="font-medium text-gray-900">{job.title}</p>
								<div class="flex items-center gap-2 mt-2">
									<span class="text-sm text-gray-500">{job._count?.applications ?? 0} candidates</span>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
