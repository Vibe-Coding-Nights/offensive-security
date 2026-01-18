<script lang="ts">
	/**
	 * CandidateCard Component
	 *
	 * The primary interface element for reviewing candidates.
	 * Optimized for rapid triage and scanning.
	 *
	 * Perceptual Engineering:
	 * - 4 key pieces of info (respects working memory limits):
	 *   1. Score ring (peripheral-visible)
	 *   2. Name (primary focus)
	 *   3. Headline/email (secondary info)
	 *   4. Stage pill (status at glance)
	 * - Details progressive-disclosed on click
	 * - Hover state provides additional context
	 */

	import type { Application } from '@prisma/client';
	import ScoreRing from '$lib/components/ui/ScoreRing.svelte';
	import StagePill from '$lib/components/ui/StagePill.svelte';
	import RecommendationBadge from '$lib/components/ui/RecommendationBadge.svelte';

	interface Props {
		application: Application;
		selected?: boolean;
		onclick?: () => void;
	}

	let { application, selected = false, onclick }: Props = $props();

	// Generate initials for avatar fallback
	const initials = $derived(
		application.candidateName
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);

	// Format date for display
	const appliedDate = $derived(
		new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
			Math.ceil(
				(new Date(application.createdAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
			),
			'day'
		)
	);
</script>

<button
	class="candidate-card w-full text-left {selected ? 'card-selected' : ''}"
	onclick={onclick}
	type="button"
>
	<!-- Score Ring -->
	<div class="flex-shrink-0">
		<ScoreRing score={application.matchScore} size="md" />
	</div>

	<!-- Main Content -->
	<div class="candidate-card-content">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0 flex-1">
				<h3 class="candidate-card-name">{application.candidateName}</h3>
				<p class="candidate-card-headline">{application.candidateEmail}</p>
			</div>

			<!-- Recommendation Badge -->
			<RecommendationBadge recommendation={application.recommendation} size="sm" />
		</div>

		<!-- Meta Row -->
		<div class="candidate-card-meta">
			<StagePill stage={application.stage} />
			<span class="text-xs text-gray-400">{appliedDate}</span>
		</div>

		<!-- Analysis Summary Preview (if available) -->
		{#if application.analysisSummary}
			<p class="mt-2 text-sm text-gray-600 truncate-2">
				{application.analysisSummary}
			</p>
		{/if}
	</div>
</button>
