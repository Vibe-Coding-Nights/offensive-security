<script lang="ts">
  import { cn } from '$lib/utils';
  import Avatar from '../ui/Avatar.svelte';
  import Dropdown from '../ui/Dropdown.svelte';

  export let breadcrumbs: { label: string; href?: string }[] = [];
  export let user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    status: 'online' as const
  };

  let searchOpen = false;
  let userMenuOpen = false;
</script>

<header
  class={cn(
    'h-14 border-b border-border bg-canvas/80 backdrop-blur-md',
    'flex items-center justify-between px-6',
    'sticky top-0 z-40'
  )}
>
  <!-- Breadcrumb navigation -->
  <nav class="flex items-center gap-2 text-sm">
    {#each breadcrumbs as crumb, i}
      {#if i > 0}
        <svg class="w-4 h-4 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      {/if}

      {#if crumb.href}
        <a
          href={crumb.href}
          class="text-ink-muted hover:text-ink transition-colors font-medium"
        >
          {crumb.label}
        </a>
      {:else}
        <span class="text-ink font-semibold">{crumb.label}</span>
      {/if}
    {/each}
  </nav>

  <!-- Actions -->
  <div class="flex items-center gap-3">
    <!-- Search button (opens command palette) -->
    <button
      type="button"
      class={cn(
        'h-8 px-3 rounded-lg border border-border bg-canvas-raised',
        'hover:bg-canvas-overlay hover:border-border-hover',
        'flex items-center gap-2 text-sm text-ink-muted',
        'transition-all duration-200 min-w-[200px]'
      )}
      on:click={() => (searchOpen = true)}
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span class="flex-1 text-left">Search...</span>
      <kbd class="px-1.5 py-0.5 text-xs bg-canvas border border-border rounded">⌘K</kbd>
    </button>

    <!-- Notifications -->
    <button
      type="button"
      class="relative w-8 h-8 rounded-lg hover:bg-canvas-raised transition-colors flex items-center justify-center text-ink-muted hover:text-ink"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <!-- Notification dot -->
      <span class="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border border-canvas" />
    </button>

    <!-- User menu -->
    <Dropdown bind:open={userMenuOpen} align="end">
      <button
        type="button"
        slot="trigger"
        class="flex items-center gap-2 rounded-lg hover:bg-canvas-raised transition-colors p-1"
      >
        <Avatar src={user.avatar} alt={user.name} size="sm" status={user.status} />
      </button>

      <div class="min-w-[200px]">
        <!-- User info -->
        <div class="px-3 py-2 border-b border-border">
          <p class="text-sm font-medium text-ink">{user.name}</p>
          <p class="text-xs text-ink-muted">{user.email}</p>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <button type="button" class="dropdown-item w-full">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </button>

          <button type="button" class="dropdown-item w-full">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <button type="button" class="dropdown-item w-full">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help & Support
          </button>
        </div>

        <div class="border-t border-border py-1">
          <button type="button" class="dropdown-item w-full text-error">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log out
          </button>
        </div>
      </div>
    </Dropdown>
  </div>
</header>
