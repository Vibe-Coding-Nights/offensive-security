<script lang="ts">
  import { cn } from '$lib/utils';
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  import CommandPalette from '../ui/CommandPalette.svelte';

  export let sidebarCollapsed = false;
  export let breadcrumbs: { label: string; href?: string }[] = [];
  export let workspace = { name: 'My Workspace', avatar: null };
  export let user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    status: 'online' as const
  };

  let commandPaletteOpen = false;

  const commands = [
    {
      id: 'new-note',
      label: 'Create new note',
      icon: '📝',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
      action: () => console.log('New note')
    },
    {
      id: 'search',
      label: 'Search notes',
      icon: '🔍',
      category: 'Actions',
      shortcut: ['⌘', 'F'],
      action: () => console.log('Search')
    },
    {
      id: 'inbox',
      label: 'Go to Inbox',
      icon: '📥',
      category: 'Navigation',
      shortcut: ['G', 'I'],
      action: () => console.log('Go to inbox')
    },
    {
      id: 'notes',
      label: 'Go to Notes',
      icon: '📝',
      category: 'Navigation',
      shortcut: ['G', 'N'],
      action: () => console.log('Go to notes')
    },
    {
      id: 'memories',
      label: 'Go to Memories',
      icon: '✨',
      category: 'Navigation',
      shortcut: ['G', 'M'],
      action: () => console.log('Go to memories')
    },
    {
      id: 'settings',
      label: 'Open settings',
      icon: '⚙️',
      category: 'Actions',
      shortcut: ['⌘', ','],
      action: () => console.log('Settings')
    }
  ];
</script>

<div class="flex h-screen overflow-hidden bg-canvas">
  <!-- Sidebar -->
  <Sidebar bind:collapsed={sidebarCollapsed} {workspace} />

  <!-- Main content area -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <Header {breadcrumbs} {user} />

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>

  <!-- Command palette -->
  <CommandPalette bind:open={commandPaletteOpen} {commands} />
</div>
