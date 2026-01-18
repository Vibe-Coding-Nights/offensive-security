<script lang="ts">
  import { cn } from '$lib/utils';

  type Variant = 'default' | 'elevated' | 'bordered';

  export let variant: Variant = 'default';
  export let hoverable = false;
  export let clickable = false;

  const variants = {
    default: 'bg-canvas-raised border border-border',
    elevated: 'bg-canvas-raised shadow-lg',
    bordered: 'bg-canvas border border-border-strong'
  };
</script>

<div
  class={cn(
    'rounded-lg transition-all duration-200',
    variants[variant],
    hoverable && 'hover:border-border-hover hover:shadow-md',
    clickable && 'cursor-pointer active:scale-[0.99]',
    $$props.class
  )}
  on:click
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
  on:keydown={(e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.currentTarget.click();
    }
  }}
>
  <slot />
</div>
