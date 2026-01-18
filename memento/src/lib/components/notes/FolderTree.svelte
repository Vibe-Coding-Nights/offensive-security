<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';

  export let workspaceId: string;
  export let notes: any[] = [];

  const dispatch = createEventDispatcher();

  interface Folder {
    id: string;
    name: string;
    icon: string;
    notes: any[];
    expanded: boolean;
  }

  let folders: Folder[] = [
    {
      id: 'all',
      name: 'All Notes',
      icon: '📁',
      notes: notes,
      expanded: true
    }
  ];

  $: activeNoteId = $page.params.noteId;

  function toggleFolder(folderId: string) {
    folders = folders.map(f =>
      f.id === folderId ? { ...f, expanded: !f.expanded } : f
    );
  }

  function handleNoteClick(noteId: string) {
    dispatch('selectNote', noteId);
  }

  function handleCreateNote() {
    dispatch('createNote');
  }
</script>

<div class="folder-tree h-full flex flex-col bg-canvas border-r border-border">
  <!-- Header -->
  <div class="flex-shrink-0 p-4 border-b border-border">
    <button
      on:click={handleCreateNote}
      class="w-full px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M12 4v16m8-8H4" />
      </svg>
      New Note
    </button>
  </div>

  <!-- Folders and notes -->
  <div class="flex-1 overflow-y-auto p-2">
    {#each folders as folder (folder.id)}
      <div class="folder mb-2">
        <button
          type="button"
          on:click={() => toggleFolder(folder.id)}
          class="folder-header w-full px-3 py-2 flex items-center gap-2 text-left rounded-lg hover:bg-canvas-raised transition-colors group"
        >
          <svg
            class="w-4 h-4 text-ink-muted transition-transform"
            class:rotate-90={folder.expanded}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-lg">{folder.icon}</span>
          <span class="flex-1 font-medium text-ink text-sm">{folder.name}</span>
          <span class="text-xs text-ink-faint">{folder.notes.length}</span>
        </button>

        {#if folder.expanded}
          <div class="notes-list ml-2 mt-1 space-y-0.5">
            {#each folder.notes as note (note.id)}
              <button
                type="button"
                on:click={() => handleNoteClick(note.id)}
                class="note-item w-full px-3 py-2 flex items-center gap-2 text-left rounded-lg hover:bg-canvas-raised transition-colors group"
                class:active={activeNoteId === note.id}
              >
                <span class="text-base">{note.icon}</span>
                <span class="flex-1 text-sm text-ink truncate">
                  {note.title || 'Untitled'}
                </span>
              </button>
            {/each}

            {#if folder.notes.length === 0}
              <div class="px-3 py-4 text-center text-xs text-ink-faint">
                No notes yet
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Footer -->
  <div class="flex-shrink-0 p-4 border-t border-border">
    <div class="flex items-center gap-2 text-xs text-ink-faint">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
    </div>
  </div>
</div>

<style>
  .note-item.active {
    background: var(--canvas-raised);
    border-left: 3px solid var(--accent);
  }

  .note-item:not(.active) {
    border-left: 3px solid transparent;
  }
</style>
