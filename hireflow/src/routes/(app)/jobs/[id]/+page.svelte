<script lang="ts">
	/**
	 * Job Detail Page
	 *
	 * Shows candidates for a specific job with filtering and sorting.
	 * This is where recruiters spend most of their time reviewing candidates.
	 */

	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import ScoreRing from '$lib/components/ui/ScoreRing.svelte';

	let { data } = $props();

	// Selected candidate for detail view
	let selectedId = $state<string | null>(null);
	let showNoteModal = $state(false);
	let showResumeModal = $state(false);
	let noteText = $state('');
	let isSubmitting = $state(false);

	// Filter and sort state
	let stageFilter = $state<string>('all');
	let sortBy = $state<'score' | 'date' | 'name'>('score');

	// Reactive data
	const job = $derived(data.job);
	const rawApplications = $derived(data.applications);

	// Filtered and sorted applications
	const applications = $derived(() => {
		let filtered = rawApplications;

		// Apply stage filter
		if (stageFilter !== 'all') {
			filtered = filtered.filter(app => app.stage === stageFilter);
		}

		// Apply sorting
		return [...filtered].sort((a, b) => {
			if (sortBy === 'score') {
				return (b.matchScore ?? 0) - (a.matchScore ?? 0);
			} else if (sortBy === 'date') {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else {
				return a.candidateName.localeCompare(b.candidateName);
			}
		});
	});

	const selectedCandidate = $derived(applications().find(c => c.id === selectedId));

	function timeAgo(date: Date | string) {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffHours < 1) return 'Just now';
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return '1 day ago';
		return `${diffDays} days ago`;
	}

	function handleFormResult() {
		isSubmitting = false;
		return async ({ result }: { result: { type: string } }) => {
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	}
</script>

<svelte:head>
	<title>{job.title} - HireFlow</title>
</svelte:head>

<div class="h-full flex">
	<!-- Candidate List -->
	<div class="w-96 border-r border-gray-200 bg-white flex flex-col">
		<!-- Header -->
		<div class="p-4 border-b border-gray-200">
			<div class="flex items-center justify-between mb-3">
				<a href="/jobs" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Back to Jobs
				</a>
			</div>
			<h1 class="text-lg font-semibold text-gray-900">{job.title}</h1>
			<p class="text-sm text-gray-500">{applications().length} candidates</p>
		</div>

		<!-- Filters -->
		<div class="p-3 border-b border-gray-200">
			<div class="flex items-center gap-2">
				<select class="input text-sm py-1.5" bind:value={stageFilter}>
					<option value="all">All Stages</option>
					<option value="NEW">New</option>
					<option value="SCREENING">Screening</option>
					<option value="PHONE_SCREEN">Phone Screen</option>
					<option value="INTERVIEW">Interview</option>
					<option value="OFFER">Offer</option>
					<option value="HIRED">Hired</option>
					<option value="REJECTED">Rejected</option>
				</select>
				<select class="input text-sm py-1.5" bind:value={sortBy}>
					<option value="score">Sort: Score</option>
					<option value="date">Sort: Date</option>
					<option value="name">Sort: Name</option>
				</select>
			</div>
		</div>

		<!-- Candidate List -->
		<div class="flex-1 overflow-auto">
			{#if applications().length === 0}
				<div class="p-8 text-center text-gray-500">
					<p>No applications yet</p>
				</div>
			{:else}
				{#each applications() as candidate}
					<button
						class="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors {selectedId === candidate.id ? 'bg-violet-50 border-l-2 border-l-violet-500' : ''}"
						onclick={() => selectedId = candidate.id}
					>
						<div class="flex items-start gap-3">
							<ScoreRing score={candidate.matchScore} size="sm" showLabel={true} />
							<div class="flex-1 min-w-0">
								<p class="font-medium text-gray-900 truncate">{candidate.candidateName}</p>
								<p class="text-sm text-gray-500 truncate">{candidate.candidateEmail}</p>
								<div class="flex items-center gap-2 mt-1">
									{#if candidate.recommendation}
										<span class="text-xs px-1.5 py-0.5 rounded {
											candidate.recommendation === 'INTERVIEW' ? 'bg-emerald-100 text-emerald-700' :
											candidate.recommendation === 'MAYBE' ? 'bg-amber-100 text-amber-700' :
											'bg-gray-100 text-gray-600'
										}">
											{candidate.recommendation}
										</span>
									{/if}
									<span class="text-xs text-gray-400">
										{timeAgo(candidate.createdAt)}
									</span>
								</div>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Candidate Detail -->
	<div class="flex-1 overflow-auto bg-gray-50">
		{#if selectedCandidate}
			<div class="p-6">
				<!-- Header -->
				<div class="flex items-start justify-between mb-6">
					<div>
						<h2 class="text-2xl font-bold text-gray-900">{selectedCandidate.candidateName}</h2>
						<p class="text-gray-600">{selectedCandidate.candidateEmail}</p>
					</div>
					<div class="flex items-center gap-3">
						{#if selectedCandidate.resumeText}
							<button
								onclick={() => showResumeModal = true}
								class="btn-secondary"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								View Resume
							</button>
						{/if}
						<form
							method="POST"
							action="?/updateStage"
							use:enhance={() => {
								isSubmitting = true;
								return handleFormResult();
							}}
						>
							<input type="hidden" name="applicationId" value={selectedCandidate.id} />
							<input type="hidden" name="stage" value="INTERVIEW" />
							<Button type="submit" variant="primary" loading={isSubmitting}>
								{#snippet children()}
									Move to Interview
								{/snippet}
							</Button>
						</form>
					</div>
				</div>

				<!-- Score Card -->
				<div class="card p-6 mb-6">
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">AI Analysis</h3>
					<div class="flex items-start gap-6">
						<div class="flex flex-col items-center">
							<ScoreRing score={selectedCandidate.matchScore} size="lg" />
							<p class="text-sm text-gray-500 mt-2">Match Score</p>
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-3">
								<span class="rec-badge {
									selectedCandidate.recommendation === 'INTERVIEW' ? 'rec-interview' :
									selectedCandidate.recommendation === 'MAYBE' ? 'rec-maybe' :
									'rec-pass'
								}">
									{selectedCandidate.recommendation === 'INTERVIEW' ? '✓ Interview' :
									 selectedCandidate.recommendation === 'MAYBE' ? '? Maybe' :
									 '✕ Pass'}
								</span>
							</div>
							<p class="text-gray-700">{selectedCandidate.analysisSummary}</p>
						</div>
					</div>
				</div>

					<!-- Actions -->
				<div class="card p-6">
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
					<div class="grid grid-cols-4 gap-3">
						<a href="mailto:{selectedCandidate.candidateEmail}" class="btn-secondary justify-center">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							Email
						</a>
						<form
							method="POST"
							action="?/updateStage"
							use:enhance={() => {
								isSubmitting = true;
								return handleFormResult();
							}}
						>
							<input type="hidden" name="applicationId" value={selectedCandidate.id} />
							<input type="hidden" name="stage" value="PHONE_SCREEN" />
							<button type="submit" class="btn-secondary justify-center w-full">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
								Phone Screen
							</button>
						</form>
						<button
							type="button"
							class="btn-secondary justify-center"
							onclick={() => showNoteModal = true}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							Add Note
						</button>
						<form
							method="POST"
							action="?/updateStage"
							use:enhance={() => {
								isSubmitting = true;
								return handleFormResult();
							}}
						>
							<input type="hidden" name="applicationId" value={selectedCandidate.id} />
							<input type="hidden" name="stage" value="REJECTED" />
							<button type="submit" class="btn-ghost text-red-600 hover:bg-red-50 justify-center w-full">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								Reject
							</button>
						</form>
					</div>
				</div>

				<!-- Note Modal -->
				{#if showNoteModal}
					<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
							<form
								method="POST"
								action="?/addNote"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ result }) => {
										isSubmitting = false;
										if (result.type === 'success') {
											showNoteModal = false;
											noteText = '';
											await invalidateAll();
										}
									};
								}}
							>
								<input type="hidden" name="applicationId" value={selectedCandidate.id} />
								<textarea
									name="note"
									bind:value={noteText}
									class="input w-full h-32 resize-none"
									placeholder="Write your note here..."
									required
								></textarea>
								<div class="flex justify-end gap-3 mt-4">
									<button
										type="button"
										class="btn-secondary"
										onclick={() => showNoteModal = false}
									>
										Cancel
									</button>
									<button type="submit" class="btn-primary" disabled={isSubmitting}>
										{isSubmitting ? 'Saving...' : 'Save Note'}
									</button>
								</div>
							</form>
						</div>
					</div>
				{/if}

				<!-- Resume Modal -->
				{#if showResumeModal && selectedCandidate.resumeText}
					<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
							<div class="flex items-center justify-between p-4 border-b">
								<h3 class="text-lg font-semibold text-gray-900">Resume: {selectedCandidate.candidateName}</h3>
								<button
									onclick={() => showResumeModal = false}
									class="text-gray-400 hover:text-gray-600"
								>
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div class="p-4 overflow-auto flex-1">
								<pre class="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded">{selectedCandidate.resumeText}</pre>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="h-full flex items-center justify-center">
				<div class="text-center">
					<svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<p class="text-gray-500">Select a candidate to view details</p>
				</div>
			</div>
		{/if}
	</div>
</div>
