<script lang="ts">
  import { cn } from '$lib/utils';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let open = false;
  export let align: 'start' | 'center' | 'end' = 'start';

  let triggerElement: HTMLDivElement;
  let dropdownElement: HTMLDivElement;

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      open &&
      triggerElement &&
      dropdownElement &&
      !triggerElement.contains(e.target as Node) &&
      !dropdownElement.contains(e.target as Node)
    ) {
      close();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      close();
    }
  }

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class={cn('relative inline-block', $$props.class)}>
  <!-- Trigger -->
  <div bind:this={triggerElement} on:click={toggle} role="button" tabindex="0">
    <slot name="trigger" />
  </div>

  <!-- Dropdown menu -->
  {#if open}
    <div
      bind:this={dropdownElement}
      class={cn(
        'absolute z-50 mt-2 min-w-[12rem] rounded-lg',
        'bg-canvas-overlay border border-border shadow-xl',
        'py-1',
        alignClasses[align]
      )}
      transition:scale={{ duration: 150, easing: cubicOut, start: 0.95, opacity: 0 }}
    >
      <slot {close} />
    </div>
  {/if}
</div>

<style>
  /* Dropdown item styles - use with slot content */
  :global(.dropdown-item) {
    @apply px-3 py-2 text-sm text-ink-muted hover:text-ink hover:bg-canvas-raised;
    @apply cursor-pointer transition-colors duration-150;
    @apply flex items-center gap-2;
  }

  :global(.dropdown-item:first-child) {
    @apply rounded-t-lg;
  }

  :global(.dropdown-item:last-child) {
    @apply rounded-b-lg;
  }

  :global(.dropdown-divider) {
    @apply my-1 border-t border-border;
  }
</style>
