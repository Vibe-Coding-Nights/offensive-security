<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Editor from '$lib/components/editor/Editor.svelte';
  import FloatingToolbar from '$lib/components/editor/FloatingToolbar.svelte';
  import SlashMenu from '$lib/components/editor/SlashMenu.svelte';
  import { trpc } from '$lib/trpc/client';
  import { debounce } from '$lib/utils';

  $: workspaceId = $page.params.workspaceId;
  $: noteId = $page.params.noteId;

  let editor: any;
  let saving = false;
  let loading = true;
  let error: string | null = null;
  let lastSaved: Date | null = null;

  let note = {
    id: '',
    title: 'Untitled',
    icon: '📝',
    content: {
      type: 'doc',
      content: []
    } as any,
    workspaceId: ''
  };

  let titleInput: HTMLInputElement;
  let iconPickerOpen = false;

  const commonIcons = ['📝', '📋', '💡', '🎯', '📊', '🔍', '⚡', '🎨', '🚀', '💼', '📚', '🎵'];

  onMount(() => {
    loadNote();
  });

  async function loadNote() {
    loading = true;
    error = null;
    try {
      const result = await trpc.notes.get.query({ noteId });
      note = {
        id: result.id,
        title: result.title || 'Untitled',
        icon: result.icon || '📝',
        content: result.content ? (typeof result.content === 'string' ? JSON.parse(result.content) : result.content) : { type: 'doc', content: [] },
        workspaceId: result.workspaceId
      };
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load note';
      console.error('Failed to load note:', err);
    } finally {
      loading = false;
    }
  }

  async function saveContent(content: any) {
    saving = true;
    try {
      await trpc.notes.update.mutate({
        noteId,
        content: typeof content === 'string' ? content : JSON.stringify(content)
      });
      lastSaved = new Date();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save content';
      console.error('Failed to save content:', err);
    } finally {
      saving = false;
    }
  }

  const debouncedSaveContent = debounce(saveContent, 300);

  async function handleEditorUpdate(event: CustomEvent) {
    note.content = event.detail.content;
    debouncedSaveContent(event.detail.content);
  }

  async function updateTitle() {
    saving = true;
    try {
      await trpc.notes.update.mutate({
        noteId,
        title: note.title
      });
      lastSaved = new Date();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save title';
      console.error('Failed to save title:', err);
    } finally {
      saving = false;
    }
  }

  async function selectIcon(icon: string) {
    note.icon = icon;
    iconPickerOpen = false;
    saving = true;
    try {
      await trpc.notes.update.mutate({
        noteId,
        icon
      });
      lastSaved = new Date();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save icon';
      console.error('Failed to save icon:', err);
    } finally {
      saving = false;
    }
  }

  function formatLastSaved(date: Date | null): string {
    if (!date) return 'Not saved';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  }
</script>

{#if loading}
  <div class="flex items-center justify-center h-full bg-canvas">
    <div class="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
  </div>
{:else if error && !note.id}
  <div class="flex flex-col items-center justify-center h-full gap-4 bg-canvas">
    <p class="text-red-500">{error}</p>
    <button
      type="button"
      on:click={loadNote}
      class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
    >
      Retry
    </button>
    <button
      type="button"
      on:click={() => goto(`/${workspaceId}/notes`)}
      class="px-4 py-2 bg-canvas border border-border rounded-lg hover:bg-canvas-sunken transition-colors text-ink"
    >
      Back to Notes
    </button>
  </div>
{:else}
  <div class="note-editor h-full flex flex-col bg-canvas">
    <!-- Header -->
    <div class="flex-shrink-0 border-b border-border bg-canvas-raised">
      <div class="px-8 py-4 flex items-center gap-4">
        <!-- Icon picker -->
        <div class="relative">
          <button
            type="button"
            on:click={() => iconPickerOpen = !iconPickerOpen}
            class="w-12 h-12 rounded-lg bg-canvas hover:bg-canvas-sunken transition-colors flex items-center justify-center text-2xl"
          >
            {note.icon}
          </button>

          {#if iconPickerOpen}
            <div class="absolute top-full left-0 mt-2 p-3 bg-canvas-raised border border-border rounded-lg shadow-xl z-10 grid grid-cols-6 gap-2">
              {#each commonIcons as icon}
                <button
                  type="button"
                  on:click={() => selectIcon(icon)}
                  class="w-10 h-10 rounded hover:bg-canvas transition-colors flex items-center justify-center text-xl"
                >
                  {icon}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Title -->
        <input
          bind:this={titleInput}
          bind:value={note.title}
          on:blur={updateTitle}
          placeholder="Untitled"
          class="flex-1 text-2xl font-semibold bg-transparent border-none outline-none text-ink placeholder:text-ink-faint"
        />

        <!-- Save status -->
        <div class="flex items-center gap-4 text-sm text-ink-muted">
          {#if error}
            <span class="text-red-500">{error}</span>
          {:else if saving}
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          {:else}
            <span>{formatLastSaved(lastSaved)}</span>
          {/if}
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-canvas transition-colors text-ink-muted hover:text-ink"
            title="Share"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          <button
            type="button"
            on:click={() => goto(`/${workspaceId}/notes`)}
            class="px-4 py-2 bg-canvas border border-border rounded-lg hover:bg-canvas-sunken transition-colors text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto py-8">
        <Editor
          bind:this={editor}
          content={note.content}
          on:update={handleEditorUpdate}
        />

        {#if editor}
          <FloatingToolbar editor={editor.getEditor()} />
          <SlashMenu editor={editor.getEditor()} />
        {/if}
      </div>
    </div>
  </div>
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
