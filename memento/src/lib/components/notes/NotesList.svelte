<script lang="ts">
  import NoteCard from './NoteCard.svelte';
  import { createEventDispatcher } from 'svelte';

  export let notes: any[] = [];
  export let workspaceId: string;

  const dispatch = createEventDispatcher();

  let view: 'grid' | 'list' = 'grid';
  let sortBy: 'date' | 'title' = 'date';
  let searchQuery = '';

  $: filteredNotes = notes
    .filter(note => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
      }
    });

  function handleDelete(event: CustomEvent<string>) {
    dispatch('delete', event.detail);
  }

  function handleDuplicate(event: CustomEvent<string>) {
    dispatch('duplicate', event.detail);
  }
</script>

<div class="notes-list h-full flex flex-col">
  <!-- Header -->
  <div class="flex-shrink-0 border-b border-border bg-canvas">
    <div class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-ink">Notes</h1>
        <button
          on:click={() => dispatch('create')}
          class="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      <!-- Search and controls -->
      <div class="flex items-center gap-3">
        <div class="flex-1 relative">
          <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search notes..."
            class="w-full bg-canvas-raised border border-border rounded-lg pl-10 pr-4 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
          />
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Sort -->
        <select
          bind:value={sortBy}
          class="bg-canvas-raised border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-accent transition-colors"
        >
          <option value="date">Last updated</option>
          <option value="title">Title</option>
        </select>

        <!-- View toggle -->
        <div class="flex bg-canvas-raised border border-border rounded-lg p-1">
          <button
            type="button"
            on:click={() => view = 'grid'}
            class="p-2 rounded transition-colors"
            class:bg-canvas={view === 'grid'}
            class:text-ink={view === 'grid'}
            class:text-ink-muted={view !== 'grid'}
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
          <button
            type="button"
            on:click={() => view = 'list'}
            class="p-2 rounded transition-colors"
            class:bg-canvas={view === 'list'}
            class:text-ink={view === 'list'}
            class:text-ink-muted={view !== 'list'}
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Notes grid/list -->
  <div class="flex-1 overflow-y-auto p-6">
    {#if filteredNotes.length > 0}
      <div
        class:grid={view === 'grid'}
        class:grid-cols-1={view === 'grid'}
        class:md:grid-cols-2={view === 'grid'}
        class:lg:grid-cols-3={view === 'grid'}
        class:gap-4={view === 'grid'}
        class:space-y-2={view === 'list'}
      >
        {#each filteredNotes as note (note.id)}
          <NoteCard
            {note}
            {view}
            on:delete={handleDelete}
            on:duplicate={handleDuplicate}
          />
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center h-full text-center py-12">
        <div class="w-16 h-16 rounded-full bg-canvas-raised flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-ink mb-1">
          {searchQuery ? 'No notes found' : 'No notes yet'}
        </h3>
        <p class="text-ink-muted mb-6">
          {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
        </p>
        {#if !searchQuery}
          <button
            on:click={() => dispatch('create')}
            class="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Create Note
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>
