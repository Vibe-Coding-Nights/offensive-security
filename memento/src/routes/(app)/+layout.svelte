<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let sidebarOpen = true;
  let aiPanelOpen = false;

  $: workspaceId = $page.params.workspaceId;
  $: currentPath = $page.url.pathname;

  interface NavItem {
    label: string;
    icon: string;
    href: string;
    match?: (path: string) => boolean;
  }

  $: navItems = [
    {
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      href: `/${workspaceId}`,
      match: (path) => path === `/${workspaceId}`
    },
    {
      label: 'Notes',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      href: `/${workspaceId}/notes`,
      match: (path) => path.includes('/notes')
    },
    {
      label: 'Chat',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      href: `/${workspaceId}/chat`,
      match: (path) => path.includes('/chat')
    },
    {
      label: 'Memories',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      href: `/${workspaceId}/memories`,
      match: (path) => path.includes('/memories')
    },
    {
      label: 'Import',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      href: `/${workspaceId}/import`,
      match: (path) => path.includes('/import')
    }
  ] as NavItem[];

  function isActive(item: NavItem): boolean {
    if (item.match) {
      return item.match(currentPath);
    }
    return currentPath === item.href;
  }
</script>

<div class="app-layout h-screen flex bg-canvas text-ink">
  <!-- Sidebar -->
  {#if sidebarOpen}
    <aside class="w-64 flex-shrink-0 bg-canvas-raised border-r border-border flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xl font-bold">Memento</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
            class:active={isActive(item)}
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d={item.icon} />
            </svg>
            <span class="font-medium">{item.label}</span>
          </a>
        {/each}
      </nav>

      <!-- User section -->
      <div class="p-3 border-t border-border">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-canvas transition-colors"
        >
          <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div class="flex-1 text-left">
            <div class="text-sm font-medium">User</div>
            <div class="text-xs text-ink-muted">Settings</div>
          </div>
          <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>
  {/if}

  <!-- Main content -->
  <main class="flex-1 flex flex-col min-w-0">
    <slot />
  </main>

  <!-- AI Panel (conditional) -->
  {#if aiPanelOpen}
    <aside class="w-96 flex-shrink-0 border-l border-border">
      <!-- AI panel content would go here -->
    </aside>
  {/if}
</div>

<style>
  .nav-item {
    color: var(--ink-muted);
  }

  .nav-item:hover {
    background: var(--canvas);
    color: var(--ink);
  }

  .nav-item.active {
    background: var(--accent);
    color: white;
  }
</style>
