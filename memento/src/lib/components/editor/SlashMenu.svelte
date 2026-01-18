<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  export let editor: Editor;

  let menu: HTMLElement;
  let visible = false;
  let selectedIndex = 0;
  let query = '';

  interface MenuItem {
    title: string;
    description: string;
    icon: string;
    action: () => void;
    searchTerms: string[];
  }

  const items: MenuItem[] = [
    {
      title: 'Heading 1',
      description: 'Large section heading',
      icon: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      searchTerms: ['h1', 'heading', 'title']
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      searchTerms: ['h2', 'heading', 'subtitle']
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      searchTerms: ['h3', 'heading']
    },
    {
      title: 'Bullet List',
      description: 'Create a bulleted list',
      icon: '•',
      action: () => editor.chain().focus().toggleBulletList().run(),
      searchTerms: ['ul', 'bullet', 'list', 'unordered']
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: '1.',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      searchTerms: ['ol', 'numbered', 'list', 'ordered']
    },
    {
      title: 'Quote',
      description: 'Insert a blockquote',
      icon: '"',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      searchTerms: ['quote', 'blockquote', 'citation']
    },
    {
      title: 'Code Block',
      description: 'Insert a code block',
      icon: '</>',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      searchTerms: ['code', 'codeblock', 'pre']
    },
    {
      title: 'Divider',
      description: 'Insert a horizontal rule',
      icon: '—',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      searchTerms: ['hr', 'divider', 'separator', 'line']
    }
  ];

  $: filteredItems = items.filter(item => {
    if (!query) return true;
    const searchString = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchString) ||
      item.description.toLowerCase().includes(searchString) ||
      item.searchTerms.some(term => term.includes(searchString))
    );
  });

  $: {
    // Reset selection when filtered items change
    if (selectedIndex >= filteredItems.length) {
      selectedIndex = 0;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!visible) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(selectedIndex);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      hide();
    }
  }

  function selectItem(index: number) {
    const item = filteredItems[index];
    if (item) {
      // Delete the slash and query
      const { from, to } = editor.state.selection;
      editor.chain()
        .deleteRange({ from: from - query.length - 1, to })
        .run();

      // Execute action
      item.action();
      hide();
    }
  }

  function show(position: { top: number; left: number }, searchQuery = '') {
    visible = true;
    query = searchQuery;
    selectedIndex = 0;

    if (menu) {
      menu.style.top = `${position.top}px`;
      menu.style.left = `${position.left}px`;
    }
  }

  function hide() {
    visible = false;
    query = '';
  }

  function updatePosition() {
    if (!visible || !editor || !menu) return;

    const { from } = editor.state.selection;
    const coords = editor.view.coordsAtPos(from);

    menu.style.top = `${coords.bottom + 8}px`;
    menu.style.left = `${coords.left}px`;
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);

    if (editor) {
      editor.on('update', ({ editor }) => {
        const { state } = editor;
        const { from, to } = state.selection;

        // Check if we just typed a slash
        const textBefore = state.doc.textBetween(Math.max(0, from - 20), from, '\n');
        const slashMatch = textBefore.match(/\/(\w*)$/);

        if (slashMatch && from === to) {
          const coords = editor.view.coordsAtPos(from);
          show({ top: coords.bottom + 8, left: coords.left }, slashMatch[1]);
        } else if (visible) {
          hide();
        }
      });
    }
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  export { show, hide };
</script>

{#if visible}
  <div
    bind:this={menu}
    class="slash-menu fixed z-50 bg-canvas-raised border border-border rounded-lg shadow-xl overflow-hidden"
    style="min-width: 280px; max-height: 320px;"
  >
    <div class="overflow-y-auto max-h-[320px]">
      {#each filteredItems as item, index}
        <button
          type="button"
          class="menu-item w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors hover:bg-canvas-sunken"
          class:selected={index === selectedIndex}
          on:click={() => selectItem(index)}
          on:mouseenter={() => selectedIndex = index}
        >
          <div class="icon-box flex-shrink-0 w-8 h-8 rounded bg-canvas flex items-center justify-center text-xs font-bold text-ink-muted">
            {item.icon}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-ink">{item.title}</div>
            <div class="text-xs text-ink-muted">{item.description}</div>
          </div>
        </button>
      {:else}
        <div class="px-4 py-8 text-center text-ink-muted">
          No results for "{query}"
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .slash-menu {
    backdrop-filter: blur(8px);
  }

  .menu-item.selected {
    background: var(--canvas-sunken);
  }

  .menu-item.selected .icon-box {
    background: var(--accent);
    color: white;
  }
</style>
