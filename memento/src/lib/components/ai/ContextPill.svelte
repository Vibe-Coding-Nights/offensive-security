<script lang="ts">
  import { onMount } from 'svelte';
  import { trpc } from '$lib/trpc/client';

  export let workspaceId: string;
  export let activeNoteId: string | null = null;

  let workspaceName = 'Loading...';
  let memoryCount = 0;
  let noteName: string | null = null;
  let loading = true;
  let error: string | null = null;

  async function loadWorkspaceData() {
    loading = true;
    error = null;

    try {
      const workspace = await trpc.workspaces.get.query({ workspaceId });
      workspaceName = workspace.name;

      const memories = await trpc.memory.list.query({ workspaceId, limit: 200 });
      memoryCount = memories.length;
    } catch (err) {
      console.error('Failed to load workspace data:', err);
      error = err instanceof Error ? err.message : 'Failed to load workspace data';
      workspaceName = 'Unknown Workspace';
    } finally {
      loading = false;
    }
  }

  let previousWorkspaceId: string | null = null;

  onMount(() => {
    loadWorkspaceData();
    previousWorkspaceId = workspaceId;
  });

  $: if (workspaceId && workspaceId !== previousWorkspaceId) {
    previousWorkspaceId = workspaceId;
    loadWorkspaceData();
  }
</script>

<div class="context-pill flex items-center gap-3 text-sm">
  <!-- Workspace -->
  <div class="flex items-center gap-2 px-3 py-1.5 bg-canvas-raised rounded-full border border-border">
    {#if loading}
      <div class="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
    {:else}
      <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    {/if}
    <span class="font-medium text-ink">{workspaceName}</span>
  </div>

  <!-- Memories count -->
  <div class="flex items-center gap-2 px-3 py-1.5 bg-memory/10 rounded-full border border-memory/20">
    <svg class="w-4 h-4 text-memory" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
    <span class="font-medium text-memory">
      {#if loading}
        ...
      {:else}
        {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
      {/if}
    </span>
  </div>

  <!-- Error indicator -->
  {#if error}
    <div class="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
      <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span class="text-red-500 text-xs">Connection issue</span>
    </div>
  {/if}

  <!-- Active note context -->
  {#if noteName}
    <div class="flex items-center gap-2 px-3 py-1.5 bg-canvas-raised rounded-full border border-border">
      <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span class="text-ink-muted">In: {noteName}</span>
    </div>
  {/if}
</div>

<style>
  .context-pill {
    flex-wrap: wrap;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
