<script lang="ts">
  import { cn } from '$lib/utils';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let open = false;

  interface Command {
    id: string;
    label: string;
    icon?: string;
    shortcut?: string[];
    category?: string;
    action: () => void;
  }

  export let commands: Command[] = [];

  let query = '';
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;

  $: filteredCommands = filterCommands(query);
  $: groupedCommands = groupByCategory(filteredCommands);

  function filterCommands(q: string): Command[] {
    if (!q) return commands;

    const lowerQuery = q.toLowerCase();
    return commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(lowerQuery)
    );
  }

  function groupByCategory(cmds: Command[]): Record<string, Command[]> {
    return cmds.reduce((acc, cmd) => {
      const category = cmd.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(cmd);
      return acc;
    }, {} as Record<string, Command[]>);
  }

  function handleKeydown(e: KeyboardEvent) {
    // Close on Escape
    if (e.key === 'Escape') {
      close();
      return;
    }

    // Navigate with arrow keys
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    }

    // Execute on Enter
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  }

  function executeCommand(cmd: Command) {
    cmd.action();
    close();
  }

  function close() {
    open = false;
    query = '';
    selectedIndex = 0;
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  $: if (open && inputElement) {
    inputElement.focus();
  }

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  function handleGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window on:keydown={handleGlobalKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-[1000] flex items-start justify-center pt-[20vh] px-4"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Command palette"
    transition:fade={{ duration: 150, easing: cubicOut }}
  >
    <!-- Backdrop with blur -->
    <div class="absolute inset-0 bg-canvas/60 backdrop-blur-md" aria-hidden="true" />

    <!-- Command palette -->
    <div
      class="relative w-full max-w-2xl bg-canvas-overlay border border-border rounded-xl shadow-2xl overflow-hidden"
      transition:scale={{ duration: 200, easing: cubicOut, start: 0.96 }}
    >
      <!-- Search input -->
      <div class="relative border-b border-border">
        <svg
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-faint"
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

        <input
          bind:this={inputElement}
          bind:value={query}
          type="text"
          placeholder="Search commands..."
          class={cn(
            'w-full h-14 pl-12 pr-4 bg-transparent',
            'text-ink placeholder:text-ink-faint text-base',
            'focus:outline-none'
          )}
          on:keydown={handleKeydown}
        />

        <kbd
          class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-ink-faint bg-canvas-raised border border-border rounded"
        >
          ESC
        </kbd>
      </div>

      <!-- Results -->
      <div class="max-h-[60vh] overflow-y-auto py-2">
        {#if filteredCommands.length === 0}
          <div class="px-4 py-8 text-center text-ink-muted">
            <p class="text-sm">No commands found</p>
          </div>
        {:else}
          {#each Object.entries(groupedCommands) as [category, cmds]}
            <div class="mb-2">
              <div class="px-4 py-2 text-xs font-medium text-ink-faint uppercase tracking-wider">
                {category}
              </div>

              {#each cmds as cmd, i}
                {@const globalIndex = filteredCommands.indexOf(cmd)}
                <button
                  type="button"
                  class={cn(
                    'w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors',
                    'hover:bg-canvas-raised',
                    globalIndex === selectedIndex && 'bg-canvas-raised'
                  )}
                  on:click={() => executeCommand(cmd)}
                  on:mouseenter={() => (selectedIndex = globalIndex)}
                >
                  {#if cmd.icon}
                    <span class="text-ink-muted">{cmd.icon}</span>
                  {/if}

                  <span class="flex-1 text-sm text-ink">{cmd.label}</span>

                  {#if cmd.shortcut}
                    <div class="flex gap-1">
                      {#each cmd.shortcut as key}
                        <kbd
                          class="px-1.5 py-0.5 text-xs text-ink-faint bg-canvas border border-border rounded"
                        >
                          {key}
                        </kbd>
                      {/each}
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/each}
        {/if}
      </div>

      <!-- Footer hint -->
      <div class="px-4 py-2 border-t border-border bg-canvas-raised/50 flex items-center gap-4 text-xs text-ink-faint">
        <span class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-canvas border border-border rounded">↑</kbd>
          <kbd class="px-1 py-0.5 bg-canvas border border-border rounded">↓</kbd>
          Navigate
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-canvas border border-border rounded">↵</kbd>
          Select
        </span>
        <span class="flex items-center gap-1">
          <kbd class="px-1 py-0.5 bg-canvas border border-border rounded">ESC</kbd>
          Close
        </span>
      </div>
    </div>
  </div>
{/if}
