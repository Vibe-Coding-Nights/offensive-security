<script lang="ts">
  import { cn } from '$lib/utils';

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  export let variant: Variant = 'primary';
  export let size: Size = 'md';
  export let disabled = false;
  export let loading = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';

  const variants = {
    primary:
      'bg-accent hover:bg-accent-hover text-white shadow-sm active:scale-[0.98]',
    secondary:
      'bg-canvas-raised hover:bg-canvas-overlay border border-border hover:border-border-hover text-ink',
    ghost:
      'hover:bg-canvas-raised text-ink-muted hover:text-ink active:bg-canvas-overlay',
    danger:
      'bg-error-muted hover:bg-[rgba(248,113,113,0.2)] text-error border border-error/20 hover:border-error/30'
  };

  const sizes = {
    sm: 'h-7 px-2.5 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2.5'
  };
</script>

<button
  {type}
  class={cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-all',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
    variants[variant],
    sizes[size],
    $$props.class
  )}
  disabled={disabled || loading}
  on:click
>
  {#if loading}
    <svg
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
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
  {/if}
  <slot />
</button>
