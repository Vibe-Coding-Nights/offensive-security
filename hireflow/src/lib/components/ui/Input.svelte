<script lang="ts">
	/**
	 * Input Component
	 *
	 * Text input with label and error states.
	 */

	interface Props {
		label?: string;
		type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
		name: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		helper?: string;
		oninput?: (e: Event) => void;
	}

	let {
		label,
		type = 'text',
		name,
		value = $bindable(''),
		placeholder,
		required = false,
		disabled = false,
		error,
		helper,
		oninput
	}: Props = $props();

	const inputId = $derived(`input-${name}`);
	const hasError = $derived(Boolean(error));
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

	<input
		id={inputId}
		{type}
		{name}
		bind:value
		{placeholder}
		{required}
		{disabled}
		class="input {hasError ? 'input-error' : ''}"
		aria-invalid={hasError}
		aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
		oninput={oninput}
	/>

	{#if error}
		<p id="{inputId}-error" class="error-text">{error}</p>
	{:else if helper}
		<p id="{inputId}-helper" class="helper-text">{helper}</p>
	{/if}
</div>
