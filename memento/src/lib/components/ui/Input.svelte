<script lang="ts">
  import { cn } from '$lib/utils';

  type Variant = 'default' | 'search';

  export let value = '';
  export let placeholder = '';
  export let type: 'text' | 'email' | 'password' | 'search' = 'text';
  export let variant: Variant = 'default';
  export let disabled = false;
  export let error = '';

  const variants = {
    default: 'pl-3',
    search: 'pl-9'
  };
</script>

<div class="relative w-full">
  {#if variant === 'search'}
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  {/if}

  <input
    {type}
    {placeholder}
    {disabled}
    bind:value
    class={cn(
      'w-full h-9 pr-3 rounded-lg border border-border bg-canvas-raised',
      'text-ink text-sm placeholder:text-ink-faint',
      'transition-all duration-200',
      'hover:border-border-hover hover:bg-canvas-overlay',
      'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-error focus:ring-error/20 focus:border-error',
      variants[variant],
      $$props.class
    )}
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
  />

  {#if error}
    <p class="mt-1.5 text-xs text-error">{error}</p>
  {/if}
</div>
