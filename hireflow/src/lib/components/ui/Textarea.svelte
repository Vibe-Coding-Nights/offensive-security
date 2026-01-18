<script lang="ts">
	/**
	 * Textarea Component
	 *
	 * Multi-line text input with label and error states.
	 */

	interface Props {
		label?: string;
		name: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		helper?: string;
		rows?: number;
		maxlength?: number;
		oninput?: (e: Event) => void;
	}

	let {
		label,
		name,
		value = $bindable(''),
		placeholder,
		required = false,
		disabled = false,
		error,
		helper,
		rows = 4,
		maxlength,
		oninput
	}: Props = $props();

	const inputId = $derived(`textarea-${name}`);
	const hasError = $derived(Boolean(error));
	const charCount = $derived(value?.length ?? 0);
</script>

<div class="space-y-1">
	{#if label}
		<label for={inputId} class="label">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<textarea
		id={inputId}
		{name}
		bind:value
		{placeholder}
		{required}
		{disabled}
		{rows}
		{maxlength}
		class="input resize-none {hasError ? 'input-error' : ''}"
		aria-invalid={hasError}
		aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
		oninput={oninput}
	></textarea>

	<div class="flex justify-between">
		{#if error}
			<p id="{inputId}-error" class="error-text">{error}</p>
		{:else if helper}
			<p id="{inputId}-helper" class="helper-text">{helper}</p>
		{:else}
			<span></span>
		{/if}

		{#if maxlength}
			<span class="text-xs text-gray-400">
				{charCount}/{maxlength}
			</span>
		{/if}
	</div>
</div>
