<script lang="ts">
	/**
	 * StagePill Component
	 *
	 * Color-coded pipeline stage indicator.
	 * Designed for rapid visual scanning of candidate status.
	 *
	 * Perceptual Engineering:
	 * - Distinct colors for each stage (no cognitive lookup needed)
	 * - Dot indicator visible in peripheral vision
	 * - Compact footprint respects spatial layout
	 */

	import type { PipelineStage } from '@prisma/client';

	interface Props {
		stage: PipelineStage;
	}

	let { stage }: Props = $props();

	const stageConfig: Record<
		PipelineStage,
		{ label: string; class: string }
	> = {
		NEW: { label: 'New', class: 'stage-new' },
		SCREENING: { label: 'Screening', class: 'stage-screening' },
		PHONE_SCREEN: { label: 'Phone Screen', class: 'stage-screening' },
		INTERVIEW: { label: 'Interview', class: 'stage-interview' },
		TECHNICAL: { label: 'Technical', class: 'stage-interview' },
		ONSITE: { label: 'Onsite', class: 'stage-interview' },
		OFFER: { label: 'Offer', class: 'stage-offer' },
		HIRED: { label: 'Hired', class: 'stage-offer' },
		REJECTED: { label: 'Rejected', class: 'stage-rejected' },
		WITHDRAWN: { label: 'Withdrawn', class: 'stage-rejected' }
	};

	const config = $derived(stageConfig[stage]);
</script>

<span class="stage-pill {config.class}">
	{config.label}
</span>
