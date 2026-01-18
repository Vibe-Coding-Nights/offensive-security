<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';

  export let note: {
    id: string;
    title: string;
    icon: string;
    content: string;
    updatedAt: Date;
    workspaceId: string;
  };
  export let view: 'grid' | 'list' = 'grid';

  const dispatch = createEventDispatcher();

  let hovered = false;
  let showActions = false;

  function getPreview(content: string): string {
    // Extract plain text from content (assuming it might be HTML or JSON)
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      if (parsed.content) {
        return extractText(parsed.content).slice(0, 150);
      }
    } catch {
      // If not JSON, treat as plain text
      return content.slice(0, 150);
    }
    return '';
  }

  function extractText(nodes: any[]): string {
    if (!Array.isArray(nodes)) return '';
    return nodes.map(node => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return extractText(node.content);
      return '';
    }).join(' ');
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return new Date(date).toLocaleDateString();
  }

  function handleClick() {
    goto(`/${note.workspaceId}/notes/${note.id}`);
  }

  function handleDelete(e: Event) {
    e.stopPropagation();
    dispatch('delete', note.id);
  }

  function handleDuplicate(e: Event) {
    e.stopPropagation();
    dispatch('duplicate', note.id);
  }
</script>

<button
  class="note-card group w-full text-left bg-canvas-raised border border-border rounded-lg transition-all hover:border-accent hover:shadow-lg"
  class:grid-view={view === 'grid'}
  class:list-view={view === 'list'}
  on:click={handleClick}
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  {#if view === 'grid'}
    <div class="p-5 space-y-3">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="icon-box w-10 h-10 rounded-lg bg-canvas flex items-center justify-center text-xl flex-shrink-0">
            {note.icon}
          </div>
          <h3 class="font-semibold text-ink line-clamp-1">{note.title || 'Untitled'}</h3>
        </div>
        {#if hovered}
          <div class="flex gap-1">
            <button
              type="button"
              on:click={handleDuplicate}
              class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-ink"
              title="Duplicate"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              type="button"
              on:click={handleDelete}
              class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-red-500"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        {/if}
      </div>

      {#if getPreview(note.content)}
        <p class="text-sm text-ink-muted line-clamp-3 leading-relaxed">
          {getPreview(note.content)}
        </p>
      {/if}

      <div class="text-xs text-ink-faint pt-1">
        {formatDate(note.updatedAt)}
      </div>
    </div>
  {:else}
    <div class="p-4 flex items-center gap-4">
      <div class="icon-box w-10 h-10 rounded-lg bg-canvas flex items-center justify-center text-xl flex-shrink-0">
        {note.icon}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-ink truncate">{note.title || 'Untitled'}</h3>
        <p class="text-sm text-ink-muted truncate">{getPreview(note.content)}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-xs text-ink-faint">{formatDate(note.updatedAt)}</span>
        {#if hovered}
          <div class="flex gap-1">
            <button
              type="button"
              on:click={handleDuplicate}
              class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-ink"
              title="Duplicate"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              type="button"
              on:click={handleDelete}
              class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-red-500"
              title="Delete"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</button>

<style>
  .note-card {
    cursor: pointer;
  }

  .grid-view {
    min-height: 160px;
  }
</style>
