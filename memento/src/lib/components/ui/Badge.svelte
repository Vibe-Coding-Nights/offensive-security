<script lang="ts">
  import { cn } from '$lib/utils';

  type Variant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'memory';
  type Size = 'sm' | 'md';

  export let variant: Variant = 'default';
  export let size: Size = 'md';
  export let dot = false;

  const variants = {
    default: 'bg-canvas-raised text-ink-muted border-border',
    accent: 'bg-accent-muted text-accent border-accent/20',
    success: 'bg-success-muted text-success border-success/20',
    warning: 'bg-warning-muted text-warning border-warning/20',
    error: 'bg-error-muted text-error border-error/20',
    memory: 'bg-memory-muted text-memory border-memory/20'
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-1 text-sm gap-1.5'
  };

  const dotVariants = {
    default: 'bg-ink-faint',
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    memory: 'bg-memory'
  };
</script>

<span
  class={cn(
    'inline-flex items-center rounded-md border font-medium',
    'transition-colors duration-200',
    variants[variant],
    sizes[size],
    $$props.class
  )}
>
  {#if dot}
    <span class={cn('w-1.5 h-1.5 rounded-full', dotVariants[variant])} />
  {/if}
  <slot />
</span>
