<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  export let editor: Editor;

  let toolbar: HTMLElement;
  let visible = false;

  interface ToolbarButton {
    icon: string;
    title: string;
    action: () => void;
    isActive?: () => boolean;
  }

  $: buttons = [
    {
      icon: 'B',
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold')
    },
    {
      icon: 'I',
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic')
    },
    {
      icon: 'S',
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike')
    },
    {
      icon: '</>',
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code')
    },
    {
      icon: '🔗',
      title: 'Link',
      action: () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: () => editor.isActive('link')
    }
  ] as ToolbarButton[];

  function updatePosition() {
    if (!editor || !toolbar) return;

    const { state } = editor;
    const { from, to } = state.selection;

    // Hide if no selection
    if (from === to) {
      visible = false;
      return;
    }

    visible = true;

    // Get selection coordinates
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);

    // Position toolbar above selection, centered
    const left = (start.left + end.left) / 2;
    const top = start.top;

    toolbar.style.left = `${left}px`;
    toolbar.style.top = `${top - toolbar.offsetHeight - 8}px`;
    toolbar.style.transform = 'translateX(-50%)';
  }

  onMount(() => {
    if (editor) {
      editor.on('selectionUpdate', updatePosition);
      editor.on('update', updatePosition);
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.off('selectionUpdate', updatePosition);
      editor.off('update', updatePosition);
    }
  });
</script>

{#if visible}
  <div
    bind:this={toolbar}
    class="floating-toolbar fixed z-50 bg-canvas-raised border border-border rounded-lg shadow-xl px-1 py-1 flex gap-0.5"
  >
    {#each buttons as button}
      <button
        type="button"
        on:click={button.action}
        title={button.title}
        class="toolbar-button px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-canvas-sunken"
        class:active={button.isActive?.()}
      >
        {button.icon}
      </button>
    {/each}
  </div>
{/if}

<style>
  .floating-toolbar {
    backdrop-filter: blur(8px);
  }

  .toolbar-button {
    color: var(--ink-muted);
    user-select: none;
  }

  .toolbar-button:hover {
    color: var(--ink);
  }

  .toolbar-button.active {
    color: var(--accent);
    background: var(--canvas-sunken);
  }
</style>
