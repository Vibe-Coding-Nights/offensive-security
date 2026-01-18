<script lang="ts">
	/**
	 * RecommendationBadge Component
	 *
	 * AI recommendation indicator with clear action signal.
	 *
	 * Perceptual Engineering:
	 * - Strong semantic color coding
	 * - Icon reinforces meaning
	 * - Visible at glance
	 */

	import type { Recommendation } from '@prisma/client';

	interface Props {
		recommendation: Recommendation | null;
		size?: 'sm' | 'md';
	}

	let { recommendation, size = 'md' }: Props = $props();

	const config: Record<
		Recommendation,
		{ label: string; class: string; icon: string }
	> = {
		INTERVIEW: {
			label: 'Interview',
			class: 'rec-interview',
			icon: '✓'
		},
		MAYBE: {
			label: 'Maybe',
			class: 'rec-maybe',
			icon: '?'
		},
		PASS: {
			label: 'Pass',
			class: 'rec-pass',
			icon: '✕'
		}
	};

	const current = $derived(recommendation ? config[recommendation] : null);
	const sizeClass = $derived(size === 'sm' ? 'text-xs px-2 py-1' : '');
</script>

{#if current}
	<span class="rec-badge {current.class} {sizeClass}">
		<span class="font-bold">{current.icon}</span>
		{current.label}
	</span>
{:else}
	<span class="rec-badge bg-gray-100 text-gray-400 {sizeClass}">
		Pending
	</span>
{/if}
