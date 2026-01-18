<script lang="ts">
  import { marked } from 'marked';

  export let message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    memories?: any[];
    createdAt: Date;
  };

  let copied = false;
  let hovered = false;

  $: isUser = message.role === 'user';
  $: hasMemories = message.memories && message.memories.length > 0;

  // Configure marked for better rendering
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  $: htmlContent = marked.parse(message.content);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
</script>

<div
  class="message-wrapper flex gap-3"
  class:justify-end={isUser}
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  {#if !isUser}
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  {/if}

  <div class="flex-1 max-w-[75%] group">
    <div
      class="message-bubble inline-block rounded-2xl px-4 py-3 transition-colors relative"
      class:bg-accent={isUser}
      class:text-white={isUser}
      class:rounded-tr-none={isUser}
      class:bg-canvas-raised={!isUser}
      class:text-ink={!isUser}
      class:rounded-tl-none={!isUser}
    >
      {#if isUser}
        <div class="whitespace-pre-wrap break-words">{message.content}</div>
      {:else}
        <div class="prose prose-invert max-w-none prose-sm">
          {@html htmlContent}
        </div>
      {/if}

      <!-- Copy button -->
      {#if hovered && !isUser}
        <button
          on:click={copyMessage}
          class="absolute -right-10 top-2 p-2 rounded-lg hover:bg-canvas-raised transition-colors text-ink-muted hover:text-ink"
          title={copied ? 'Copied!' : 'Copy'}
        >
          {#if copied}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          {/if}
        </button>
      {/if}
    </div>

    <!-- Memory indicator -->
    {#if hasMemories}
      <div class="mt-2 flex items-center gap-2 text-xs text-memory">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>Used {message.memories?.length ?? 0} {(message.memories?.length ?? 0) === 1 ? 'memory' : 'memories'}</span>
      </div>
    {/if}

    <!-- Timestamp -->
    <div class="mt-1 text-xs text-ink-faint" class:text-right={isUser}>
      {formatTime(message.createdAt)}
    </div>
  </div>

  {#if isUser}
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent-bright flex items-center justify-center text-white font-semibold text-sm">
      U
    </div>
  {/if}
</div>

<style>
  :global(.message-bubble .prose) {
    color: inherit;
  }

  :global(.message-bubble .prose p) {
    margin-bottom: 0.75em;
  }

  :global(.message-bubble .prose p:last-child) {
    margin-bottom: 0;
  }

  :global(.message-bubble .prose strong) {
    font-weight: 600;
  }

  :global(.message-bubble .prose code) {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  :global(.message-bubble .prose pre) {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0.5rem 0;
  }

  :global(.message-bubble .prose pre code) {
    background: none;
    padding: 0;
  }

  :global(.message-bubble .prose ul),
  :global(.message-bubble .prose ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  :global(.message-bubble .prose li) {
    margin-bottom: 0.25rem;
  }
</style>
