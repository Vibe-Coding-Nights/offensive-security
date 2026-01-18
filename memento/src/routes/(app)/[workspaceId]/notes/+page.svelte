<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import NotesList from '$lib/components/notes/NotesList.svelte';
  import { trpc } from '$lib/trpc/client';

  $: workspaceId = $page.params.workspaceId;

  interface Note {
    id: string;
    title: string;
    icon?: string | null;
    content?: any;
    contentText?: string | null;
    parentId?: string | null;
    createdBy?: string;
    createdAt?: Date | string;
    updatedAt: Date;
    workspaceId: string;
  }

  let notes: Note[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(() => {
    loadNotes();
  });

  $: if (workspaceId) {
    loadNotes();
  }

  async function loadNotes() {
    loading = true;
    error = null;
    try {
      const result = await trpc.notes.list.query({ workspaceId });
      notes = result.map(note => ({
        ...note,
        updatedAt: new Date(note.updatedAt)
      }));
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load notes';
      console.error('Failed to load notes:', err);
    } finally {
      loading = false;
    }
  }

  async function createNote() {
    try {
      const newNote = await trpc.notes.create.mutate({
        workspaceId,
        title: 'Untitled'
      });
      goto(`/${workspaceId}/notes/${newNote.id}`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create note';
      console.error('Failed to create note:', err);
    }
  }

  async function deleteNote(event: CustomEvent<string>) {
    const noteId = event.detail;
    try {
      await trpc.notes.delete.mutate({ noteId });
      notes = notes.filter(n => n.id !== noteId);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete note';
      console.error('Failed to delete note:', err);
    }
  }

  async function duplicateNote(event: CustomEvent<string>) {
    const noteId = event.detail;
    try {
      const originalNote = notes.find(n => n.id === noteId);
      if (!originalNote) return;

      const duplicatedNote = await trpc.notes.create.mutate({
        workspaceId,
        title: `${originalNote.title} (Copy)`,
        content: originalNote.content
      });
      notes = [...notes, {
        ...duplicatedNote,
        updatedAt: new Date(duplicatedNote.updatedAt)
      }];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to duplicate note';
      console.error('Failed to duplicate note:', err);
    }
  }
</script>

{#if loading}
  <div class="flex items-center justify-center h-full">
    <div class="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
  </div>
{:else if error}
  <div class="flex flex-col items-center justify-center h-full gap-4">
    <p class="text-red-500">{error}</p>
    <button
      type="button"
      on:click={loadNotes}
      class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
    >
      Retry
    </button>
  </div>
{:else}
  <NotesList
    {notes}
    {workspaceId}
    on:create={createNote}
    on:delete={deleteNote}
    on:duplicate={duplicateNote}
  />
{/if}

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
