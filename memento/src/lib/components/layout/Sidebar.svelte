<script lang="ts">
  import { cn } from '$lib/utils';
  import { slide } from 'svelte/transition';
  import Avatar from '../ui/Avatar.svelte';
  import Tooltip from '../ui/Tooltip.svelte';

  export let collapsed = false;
  export let workspace = { name: 'My Workspace', avatar: null };

  interface NavItem {
    id: string;
    label: string;
    icon: string;
    href: string;
    badge?: number;
  }

  export let navItems: NavItem[] = [
    { id: 'inbox', label: 'Inbox', icon: '📥', href: '/inbox', badge: 3 },
    { id: 'notes', label: 'Notes', icon: '📝', href: '/notes' },
    { id: 'memories', label: 'Memories', icon: '✨', href: '/memories' },
    { id: 'archive', label: 'Archive', icon: '📦', href: '/archive' }
  ];

  let activeId = 'notes';

  function toggleCollapse() {
    collapsed = !collapsed;
  }
</script>

<aside
  class={cn(
    'h-screen bg-canvas-raised border-r border-border flex flex-col',
    'transition-all duration-300 ease-out',
    collapsed ? 'w-14' : 'w-60'
  )}
>
  <!-- Workspace switcher -->
  <div class="p-3 border-b border-border">
    {#if collapsed}
      <Tooltip text={workspace.name} position="right">
        <button
          type="button"
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-canvas-overlay transition-colors"
          on:click={toggleCollapse}
        >
          <Avatar src={workspace.avatar} alt={workspace.name} size="sm" />
        </button>
      </Tooltip>
    {:else}
      <button
        type="button"
        class="w-full px-2 py-1.5 rounded-lg hover:bg-canvas-overlay transition-colors flex items-center gap-2"
        on:click={toggleCollapse}
      >
        <Avatar src={workspace.avatar} alt={workspace.name} size="sm" />
        <span class="flex-1 text-sm font-medium text-ink text-left truncate">
          {workspace.name}
        </span>
        <svg class="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 p-2 space-y-1 overflow-y-auto">
    {#each navItems as item}
      {#if collapsed}
        <Tooltip text={item.label} position="right">
          <a
            href={item.href}
            class={cn(
              'h-10 px-2 rounded-lg flex items-center justify-center relative',
              'transition-colors duration-200',
              'hover:bg-canvas-overlay',
              activeId === item.id && 'bg-canvas-overlay text-accent'
            )}
          >
            <span class="text-xl">{item.icon}</span>
            {#if item.badge}
              <span
                class="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border border-canvas-raised"
              />
            {/if}
          </a>
        </Tooltip>
      {:else}
        <a
          href={item.href}
          class={cn(
            'h-10 px-3 rounded-lg flex items-center gap-3',
            'transition-colors duration-200',
            'hover:bg-canvas-overlay group',
            activeId === item.id && 'bg-canvas-overlay'
          )}
        >
          <span class="text-lg">{item.icon}</span>
          <span
            class={cn(
              'flex-1 text-sm font-medium transition-colors',
              activeId === item.id ? 'text-accent' : 'text-ink-muted group-hover:text-ink'
            )}
          >
            {item.label}
          </span>
          {#if item.badge}
            <span
              class="px-1.5 py-0.5 text-xs font-medium bg-accent-muted text-accent rounded"
            >
              {item.badge}
            </span>
          {/if}
        </a>
      {/if}
    {/each}
  </nav>

  <!-- Quick actions -->
  <div class="p-2 border-t border-border space-y-1">
    {#if collapsed}
      <Tooltip text="New note" position="right">
        <button
          type="button"
          class="w-full h-10 rounded-lg hover:bg-canvas-overlay transition-colors flex items-center justify-center text-ink-muted hover:text-accent"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </Tooltip>

      <Tooltip text="Settings" position="right">
        <button
          type="button"
          class="w-full h-10 rounded-lg hover:bg-canvas-overlay transition-colors flex items-center justify-center text-ink-muted hover:text-ink"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </Tooltip>
    {:else}
      <button
        type="button"
        class="w-full h-10 px-3 rounded-lg hover:bg-canvas-overlay transition-colors flex items-center gap-3 text-ink-muted hover:text-accent group"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-sm font-medium">New note</span>
      </button>

      <button
        type="button"
        class="w-full h-10 px-3 rounded-lg hover:bg-canvas-overlay transition-colors flex items-center gap-3 text-ink-muted hover:text-ink group"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-sm font-medium">Settings</span>
      </button>
    {/if}
  </div>

  <!-- Collapse toggle -->
  <div class="p-2 border-t border-border">
    <button
      type="button"
      class={cn(
        'w-full h-8 rounded-lg hover:bg-canvas-overlay transition-colors',
        'flex items-center text-ink-muted hover:text-ink',
        collapsed ? 'justify-center' : 'justify-between px-3'
      )}
      on:click={toggleCollapse}
    >
      {#if !collapsed}
        <span class="text-xs font-medium">Collapse</span>
      {/if}
      <svg
        class={cn('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </div>
</aside>
