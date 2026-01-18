<script lang="ts">
  import { goto } from '$app/navigation';

  export let memory: {
    id: string;
    content: string;
    source: 'conversation' | 'document' | 'note';
    sourceId?: string;
    createdAt: Date;
    metadata?: any;
  };
  export let onDelete: () => void;
  export let isDeleting: boolean = false;

  let expanded = false;
  let hovered = false;

  const sourceIcons = {
    conversation: '💬',
    document: '📄',
    note: '📝'
  };

  const sourceLabels = {
    conversation: 'Conversation',
    document: 'Document',
    note: 'Note'
  };

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(date).toLocaleDateString();
  }

  function viewSource() {
    // Navigate to source based on type
    // This would need the actual workspaceId
    if (memory.source === 'conversation') {
      goto(`/workspace/chat/${memory.sourceId}`);
    } else if (memory.source === 'note') {
      goto(`/workspace/notes/${memory.sourceId}`);
    } else if (memory.source === 'document') {
      goto(`/workspace/documents/${memory.sourceId}`);
    }
  }

  $: truncated = memory.content.length > 200;
  $: displayContent = expanded || !truncated ? memory.content : memory.content.slice(0, 200) + '...';
</script>

<div
  class="memory-card bg-canvas-raised border border-border rounded-lg p-4 hover:border-memory transition-colors"
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  <div class="flex items-start justify-between gap-3 mb-3">
    <!-- Source badge -->
    <div class="flex items-center gap-2 px-2.5 py-1 bg-memory/10 border border-memory/20 rounded-full text-xs font-medium text-memory">
      <span>{sourceIcons[memory.source]}</span>
      <span>{sourceLabels[memory.source]}</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      {#if hovered}
        <button
          type="button"
          on:click={viewSource}
          class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-ink"
          title="View source"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <button
          type="button"
          on:click={onDelete}
          disabled={isDeleting}
          class="p-1.5 rounded hover:bg-canvas transition-colors text-ink-muted hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete"
        >
          {#if isDeleting}
            <div class="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          {:else}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          {/if}
        </button>
      {/if}
    </div>
  </div>

  <!-- Content -->
  <div class="space-y-2">
    <p class="text-ink leading-relaxed whitespace-pre-wrap">
      {displayContent}
    </p>

    {#if truncated}
      <button
        type="button"
        on:click={() => expanded = !expanded}
        class="text-sm text-memory hover:text-memory-bright font-medium transition-colors"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    {/if}
  </div>

  <!-- Footer -->
  <div class="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-ink-faint">
    <span>{formatDate(memory.createdAt)}</span>
    {#if memory.metadata?.confidence}
      <span class="flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {Math.round(memory.metadata.confidence * 100)}% confidence
      </span>
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
