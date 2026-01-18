<script lang="ts">
  import { cn } from '$lib/utils';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let open = false;
  export let title = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function close() {
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
    transition:fade={{ duration: 200, easing: cubicOut }}
  >
    <!-- Backdrop with blur -->
    <div
      class="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
      aria-hidden="true"
    />

    <!-- Modal content -->
    <div
      class={cn(
        'relative w-full bg-canvas-overlay border border-border rounded-xl shadow-xl',
        'max-h-[90vh] overflow-hidden flex flex-col',
        sizes[size]
      )}
      transition:scale={{ duration: 200, easing: cubicOut, start: 0.95 }}
    >
      <!-- Header -->
      {#if title || $$slots.header}
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          {#if $$slots.header}
            <slot name="header" />
          {:else if title}
            <h2 id="modal-title" class="text-lg font-semibold text-ink">{title}</h2>
          {/if}

          <button
            type="button"
            class="ml-auto -mr-2 p-2 rounded-lg hover:bg-canvas-raised text-ink-muted hover:text-ink transition-colors"
            on:click={close}
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      {/if}

      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto">
        <slot />
      </div>

      <!-- Footer -->
      {#if $$slots.footer}
        <div class="px-6 py-4 border-t border-border bg-canvas-raised/50">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}
