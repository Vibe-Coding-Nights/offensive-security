<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  $: workspaceId = $page.params.workspaceId;

  let recentNotes = [
    { id: '1', title: 'Project Planning', icon: '📋', updatedAt: new Date() },
    { id: '2', title: 'Meeting Notes', icon: '📝', updatedAt: new Date() },
    { id: '3', title: 'Ideas', icon: '💡', updatedAt: new Date() }
  ];

  let stats = {
    totalNotes: 24,
    totalMemories: 156,
    conversationsToday: 8
  };
</script>

<div class="dashboard h-full overflow-y-auto bg-canvas">
  <div class="max-w-7xl mx-auto p-8 space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-ink">Welcome back</h1>
      <p class="text-ink-muted">Here's what's happening in your workspace today</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat-card bg-canvas-raised border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-ink mb-1">{stats.totalNotes}</div>
        <div class="text-sm text-ink-muted">Total Notes</div>
      </div>

      <div class="stat-card bg-canvas-raised border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-memory/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-memory" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-ink mb-1">{stats.totalMemories}</div>
        <div class="text-sm text-ink-muted">AI Memories</div>
      </div>

      <div class="stat-card bg-canvas-raised border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-ink mb-1">{stats.conversationsToday}</div>
        <div class="text-sm text-ink-muted">Conversations Today</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-ink">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          on:click={() => goto(`/${workspaceId}/notes`)}
          class="action-card bg-canvas-raised border border-border rounded-xl p-6 text-left hover:border-accent transition-colors group"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-accent group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-ink mb-1">Create New Note</h3>
              <p class="text-sm text-ink-muted">Start writing and let Memento remember</p>
            </div>
          </div>
        </button>

        <button
          on:click={() => goto(`/${workspaceId}/chat`)}
          class="action-card bg-canvas-raised border border-border rounded-xl p-6 text-left hover:border-accent transition-colors group"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-accent group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-ink mb-1">Chat with AI</h3>
              <p class="text-sm text-ink-muted">Ask questions about your notes and documents</p>
            </div>
          </div>
        </button>

        <button
          on:click={() => goto(`/${workspaceId}/import`)}
          class="action-card bg-canvas-raised border border-border rounded-xl p-6 text-left hover:border-accent transition-colors group"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-accent group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-ink mb-1">Import Document</h3>
              <p class="text-sm text-ink-muted">Upload files to extract knowledge</p>
            </div>
          </div>
        </button>

        <button
          on:click={() => goto(`/${workspaceId}/memories`)}
          class="action-card bg-canvas-raised border border-border rounded-xl p-6 text-left hover:border-memory transition-colors group"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-memory/10 flex items-center justify-center group-hover:bg-memory group-hover:text-white transition-colors">
              <svg class="w-6 h-6 text-memory group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-ink mb-1">Browse Memories</h3>
              <p class="text-sm text-ink-muted">See what Memento has learned</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Notes -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-ink">Recent Notes</h2>
        <a
          href={`/${workspaceId}/notes`}
          class="text-sm text-accent hover:text-accent-bright font-medium transition-colors"
        >
          View all →
        </a>
      </div>
      <div class="grid gap-3">
        {#each recentNotes as note}
          <a
            href={`/${workspaceId}/notes/${note.id}`}
            class="note-item bg-canvas-raised border border-border rounded-lg p-4 hover:border-accent transition-colors flex items-center gap-3"
          >
            <div class="w-10 h-10 rounded-lg bg-canvas flex items-center justify-center text-xl">
              {note.icon}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-ink">{note.title}</h3>
              <p class="text-sm text-ink-muted">Updated just now</p>
            </div>
            <svg class="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>
