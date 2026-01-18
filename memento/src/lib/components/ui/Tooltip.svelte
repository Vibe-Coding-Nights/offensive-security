<script lang="ts">
  import { cn } from '$lib/utils';
  import { fade } from 'svelte/transition';

  export let text = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  export let delay = 500;

  let showTooltip = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  function handleMouseEnter() {
    timeoutId = setTimeout(() => {
      showTooltip = true;
    }, delay);
  }

  function handleMouseLeave() {
    clearTimeout(timeoutId);
    showTooltip = false;
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-canvas-overlay',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-canvas-overlay',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-canvas-overlay',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-canvas-overlay'
  };
</script>

<div
  class={cn('relative inline-block', $$props.class)}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  role="tooltip"
>
  <slot />

  {#if showTooltip && text}
    <div
      class={cn(
        'absolute z-50 px-2 py-1 text-xs font-medium text-ink',
        'bg-canvas-overlay border border-border rounded-md shadow-lg',
        'whitespace-nowrap pointer-events-none',
        positions[position]
      )}
      transition:fade={{ duration: 150 }}
    >
      {text}
      <!-- Arrow -->
      <div
        class={cn(
          'absolute w-0 h-0 border-4',
          arrows[position]
        )}
      />
    </div>
  {/if}
</div>
