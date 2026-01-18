<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let error: string | null = null;

  async function handleLogin(e: Event) {
    e.preventDefault();
    error = null;
    loading = true;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      goto('/');
    } catch (err: any) {
      error = err.message || 'Failed to login. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-page min-h-screen bg-canvas flex">
  <!-- Left side - Branding -->
  <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent to-accent-bright p-12 flex-col justify-between text-white">
    <div>
      <div class="flex items-center gap-3 mb-12">
        <div class="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-2xl font-bold">Memento</span>
      </div>

      <div class="space-y-6">
        <h1 class="text-4xl font-bold leading-tight">
          Your AI-powered<br />second brain
        </h1>
        <p class="text-white/80 text-lg">
          Never forget important information. Memento remembers everything from your notes and conversations.
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold mb-1">AI Memory</h3>
          <p class="text-white/70 text-sm">Automatically extracts and remembers key information</p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold mb-1">Contextual Chat</h3>
          <p class="text-white/70 text-sm">Ask questions and get answers based on your knowledge base</p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold mb-1">Rich Notes</h3>
          <p class="text-white/70 text-sm">Beautiful editor with Markdown support</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Right side - Login form -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo for mobile -->
      <div class="lg:hidden flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-2xl font-bold text-ink">Memento</span>
      </div>

      <div>
        <h2 class="text-3xl font-bold text-ink">Welcome back</h2>
        <p class="mt-2 text-ink-muted">Sign in to your account to continue</p>
      </div>

      <form on:submit={handleLogin} class="space-y-6">
        {#if error}
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-500">{error}</p>
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-ink mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full px-4 py-3 bg-canvas-raised border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-ink mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="w-full px-4 py-3 bg-canvas-raised border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            <span class="text-sm text-ink-muted">Remember me</span>
          </label>
          <a href="/forgot-password" class="text-sm text-accent hover:text-accent-bright transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if loading}
            <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Signing in...</span>
          {:else}
            Sign in
          {/if}
        </button>

        <div class="text-center text-sm text-ink-muted">
          Don't have an account?
          <a href="/signup" class="text-accent hover:text-accent-bright font-medium transition-colors">
            Sign up
          </a>
        </div>
      </form>
    </div>
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
