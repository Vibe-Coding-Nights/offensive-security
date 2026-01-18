<script lang="ts">
  import { onMount } from 'svelte';
  import ChatMessage from './ChatMessage.svelte';
  import ContextPill from './ContextPill.svelte';
  import { trpc } from '$lib/trpc/client';

  export let workspaceId: string;
  export let conversationId: string | null = null;

  let error: string | null = null;

  interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    memories?: any[];
    createdAt: Date;
  }

  let messages: Message[] = [];
  let inputValue = '';
  let loading = false;
  let messagesContainer: HTMLElement;
  let textarea: HTMLTextAreaElement;

  async function sendMessage() {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue;
    inputValue = '';
    loading = true;

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      createdAt: new Date()
    };
    messages = [...messages, tempMessage];

    // Auto-resize textarea
    if (textarea) {
      textarea.style.height = 'auto';
    }

    try {
      error = null;

      const result = await trpc.chat.send.mutate({
        workspaceId,
        conversationId: conversationId ?? undefined,
        message: userMessage
      });

      conversationId = result.conversationId;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.message,
        createdAt: new Date()
      };

      messages = [...messages, assistantMessage];
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message:', err);
      error = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      messages = messages.filter(m => m.id !== tempMessage.id);
    } finally {
      loading = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput() {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  onMount(() => {
    scrollToBottom();
  });

  $: if (messages.length) {
    scrollToBottom();
  }
</script>

<div class="chat-panel flex flex-col h-full bg-canvas">
  <!-- Context indicator -->
  <div class="flex-shrink-0 border-b border-border p-4">
    <ContextPill {workspaceId} />
  </div>

  <!-- Messages -->
  <div
    bind:this={messagesContainer}
    class="flex-1 overflow-y-auto p-6 space-y-6"
  >
    {#if messages.length === 0}
      <div class="flex flex-col items-center justify-center h-full text-center">
        <div class="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-ink mb-2">Start a conversation</h3>
        <p class="text-ink-muted max-w-md">
          Ask Memento anything. It has access to your notes and memories to provide contextual answers.
        </p>
      </div>
    {:else}
      {#each messages as message (message.id)}
        <ChatMessage {message} />
      {/each}
    {/if}

    {#if loading}
      <div class="flex gap-3 items-start">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <div class="inline-flex items-center gap-2 px-4 py-3 bg-canvas-raised rounded-2xl rounded-tl-none">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Input -->
  <div class="flex-shrink-0 border-t border-border p-4 bg-canvas-raised">
    {#if error}
      <div class="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2">
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
    <div class="relative">
      <textarea
        bind:this={textarea}
        bind:value={inputValue}
        on:keydown={handleKeyDown}
        on:input={handleInput}
        placeholder="Ask Memento anything..."
        class="w-full bg-canvas border border-border rounded-lg px-4 py-3 pr-12 resize-none text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
        rows="1"
        style="min-height: 44px; max-height: 200px;"
      />
      <button
        on:click={sendMessage}
        disabled={loading || !inputValue.trim()}
        class="absolute right-2 bottom-2 p-2 rounded-lg bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-bright transition-colors"
        title="Send message"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
    <div class="mt-2 text-xs text-ink-faint">
      Press Enter to send, Shift+Enter for new line
    </div>
  </div>
</div>

<style>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }

  .animate-bounce {
    animation: bounce 1s ease-in-out infinite;
  }
</style>
