<script lang="ts">
	/**
	 * ScoreRing Component
	 *
	 * A distinctive circular score visualization optimized for peripheral scanning.
	 * The ring fills proportionally to the score, using semantic colors.
	 *
	 * Perceptual Engineering:
	 * - Color encodes meaning (green/amber/red = traffic light pattern)
	 * - Ring progress visible at glance without reading the number
	 * - Animation draws attention to score changes
	 */

	interface Props {
		score: number | null;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		animated?: boolean;
	}

	let { score, size = 'md', showLabel = true, animated = true }: Props = $props();

	// Dimensions based on size
	const dimensions = {
		sm: { width: 40, strokeWidth: 3, fontSize: 'text-sm' },
		md: { width: 56, strokeWidth: 4, fontSize: 'text-lg' },
		lg: { width: 72, strokeWidth: 5, fontSize: 'text-xl' }
	};

	const dim = $derived(dimensions[size]);
	const radius = $derived((dim.width - dim.strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);

	// Score percentage (0-100)
	const percentage = $derived(score ? (score / 10) * 100 : 0);

	// Stroke offset for fill animation
	const strokeOffset = $derived(circumference - (percentage / 100) * circumference);

	// Semantic color based on score
	const scoreClass = $derived(() => {
		if (!score) return '';
		if (score >= 7) return 'score-high';
		if (score >= 4) return 'score-mid';
		return 'score-low';
	});
</script>

<div
	class="score-ring {scoreClass()}"
	style="width: {dim.width}px; height: {dim.width}px;"
	role="meter"
	aria-valuenow={score ?? undefined}
	aria-valuemin={1}
	aria-valuemax={10}
	aria-label={score ? `Match score: ${score} out of 10` : 'Score pending'}
>
	{#if score !== null}
		<svg width={dim.width} height={dim.width}>
			<!-- Background circle -->
			<circle
				class="score-ring-bg"
				cx={dim.width / 2}
				cy={dim.width / 2}
				r={radius}
			/>
			<!-- Fill circle -->
			<circle
				class="score-ring-fill"
				cx={dim.width / 2}
				cy={dim.width / 2}
				r={radius}
				stroke-dasharray={circumference}
				stroke-dashoffset={animated ? strokeOffset : 0}
				style="stroke-width: {dim.strokeWidth}px;"
			/>
		</svg>
		{#if showLabel}
			<span class="score-ring-value {dim.fontSize} font-bold">
				{score}
			</span>
		{/if}
	{:else}
		<!-- Pending state -->
		<div class="w-full h-full flex items-center justify-center text-gray-400">
			<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				/>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		</div>
	{/if}
</div>
