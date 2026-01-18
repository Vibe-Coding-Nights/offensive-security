<script lang="ts">
  import { onMount } from 'svelte';
  import MemoryCard from './MemoryCard.svelte';
  import { trpc } from '$lib/trpc/client';

  export let workspaceId: string;

  interface Memory {
    id: string;
    content: string;
    source: 'conversation' | 'document' | 'note';
    sourceId?: string;
    createdAt: Date;
    metadata?: any;
  }

  let memories: Memory[] = [];
  let filter: 'all' | 'conversation' | 'document' | 'note' = 'all';
  let searchQuery = '';
  let loading = true;
  let error: string | null = null;
  let searching = false;
  let deleting: string | null = null;
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  async function loadMemories() {
    loading = true;
    error = null;
    try {
      const result = await trpc.memory.list.query({ workspaceId, limit: 50 });
      memories = result.map((m: any) => ({
        id: m.id,
        content: m.content,
        source: m.source as Memory['source'],
        sourceId: m.sourceId,
        createdAt: new Date(m.createdAt)
      }));
    } catch (err) {
      console.error('Failed to load memories:', err);
      error = err instanceof Error ? err.message : 'Failed to load memories. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function deleteMemory(id: string) {
    if (!confirm('Are you sure you want to delete this memory?')) return;

    deleting = id;
    try {
      await trpc.memory.delete.mutate({ memoryId: id });
      memories = memories.filter(m => m.id !== id);
    } catch (err) {
      console.error('Failed to delete memory:', err);
      error = err instanceof Error ? err.message : 'Failed to delete memory. Please try again.';
    } finally {
      deleting = null;
    }
  }

  async function performSearch(query: string) {
    if (!query.trim()) {
      await loadMemories();
      return;
    }

    searching = true;
    error = null;
    try {
      const result = await trpc.memory.search.query({ workspaceId, query });
      memories = result.map((m: any) => ({
        id: m.id,
        content: m.content,
        source: m.source as Memory['source'],
        sourceId: m.sourceId,
        createdAt: new Date(m.createdAt)
      }));
    } catch (err) {
      console.error('Failed to search memories:', err);
      error = err instanceof Error ? err.message : 'Failed to search memories. Please try again.';
    } finally {
      searching = false;
    }
  }

  function handleSearchInput() {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }

  $: filteredMemories = memories.filter(m => {
    if (filter !== 'all' && m.source !== filter) return false;
    return true;
  });

  $: filterCounts = {
    all: memories.length,
    conversation: memories.filter(m => m.source === 'conversation').length,
    document: memories.filter(m => m.source === 'document').length,
    note: memories.filter(m => m.source === 'note').length
  };

  onMount(() => {
    loadMemories();
  });
</script>

<div class="memory-browser h-full flex flex-col bg-canvas">
  <div class="flex-shrink-0 p-6 space-y-6 border-b border-border">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-memory/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-memory" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-ink">Memories</h1>
          <p class="text-sm text-ink-muted">AI-extracted knowledge from your workspace</p>
        </div>
      </div>

      <button
        on:click={loadMemories}
        class="px-4 py-2 bg-canvas-raised border border-border rounded-lg font-medium text-ink hover:bg-canvas-sunken transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 flex-wrap">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:bg-memory={filter === 'all'}
        class:text-white={filter === 'all'}
        class:bg-canvas-raised={filter !== 'all'}
        class:text-ink-muted={filter !== 'all'}
        class:hover:bg-canvas-sunken={filter !== 'all'}
        on:click={() => filter = 'all'}
      >
        All ({filterCounts.all})
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:bg-memory={filter === 'conversation'}
        class:text-white={filter === 'conversation'}
        class:bg-canvas-raised={filter !== 'conversation'}
        class:text-ink-muted={filter !== 'conversation'}
        class:hover:bg-canvas-sunken={filter !== 'conversation'}
        on:click={() => filter = 'conversation'}
      >
        💬 Conversation ({filterCounts.conversation})
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:bg-memory={filter === 'document'}
        class:text-white={filter === 'document'}
        class:bg-canvas-raised={filter !== 'document'}
        class:text-ink-muted={filter !== 'document'}
        class:hover:bg-canvas-sunken={filter !== 'document'}
        on:click={() => filter = 'document'}
      >
        📄 Document ({filterCounts.document})
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        class:bg-memory={filter === 'note'}
        class:text-white={filter === 'note'}
        class:bg-canvas-raised={filter !== 'note'}
        class:text-ink-muted={filter !== 'note'}
        class:hover:bg-canvas-sunken={filter !== 'note'}
        on:click={() => filter = 'note'}
      >
        📝 Note ({filterCounts.note})
      </button>
    </div>

    <!-- Search -->
    <div class="relative">
      <input
        type="search"
        bind:value={searchQuery}
        on:input={handleSearchInput}
        placeholder="Search memories..."
        class="w-full bg-canvas-raised border border-border rounded-lg pl-10 pr-10 py-2.5 text-ink placeholder:text-ink-faint focus:outline-none focus:border-memory transition-colors"
      />
      <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {#if searching}
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border-2 border-memory/20 border-t-memory rounded-full animate-spin"></div>
        </div>
      {/if}
    </div>

    <!-- Error message -->
    {#if error}
      <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{error}</span>
        <button
          on:click={() => error = null}
          class="ml-auto text-red-500 hover:text-red-400"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  <!-- Memory list -->
  <div class="flex-1 overflow-y-auto p-6">
    {#if loading}
      <div class="flex flex-col items-center justify-center h-full">
        <div class="w-12 h-12 border-4 border-memory/20 border-t-memory rounded-full animate-spin"></div>
        <p class="mt-4 text-ink-muted">Loading memories...</p>
      </div>
    {:else if filteredMemories.length > 0}
      <div class="grid gap-3">
        {#each filteredMemories as memory (memory.id)}
          <MemoryCard
            {memory}
            onDelete={() => deleteMemory(memory.id)}
            isDeleting={deleting === memory.id}
          />
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center h-full text-center py-12">
        <div class="w-16 h-16 rounded-full bg-memory/10 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-memory" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-ink mb-1">
          {searchQuery ? 'No memories found' : 'No memories yet'}
        </h3>
        <p class="text-ink-muted max-w-md">
          {searchQuery
            ? 'Try adjusting your search or filter'
            : 'Memories are automatically created when you chat with AI or import documents'}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
