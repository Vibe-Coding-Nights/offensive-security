<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error: string | null = null;

  async function handleSignup(e: Event) {
    e.preventDefault();
    error = null;

    // Validation
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters';
      return;
    }

    loading = true;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      goto('/');
    } catch (err: any) {
      error = err.message || 'Failed to create account. Please try again.';
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
          Start building your<br />knowledge base today
        </h1>
        <p class="text-white/80 text-lg">
          Join thousands of users who trust Memento to remember what matters.
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-white/10 backdrop-blur rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            JD
          </div>
          <div>
            <div class="font-semibold">Jane Doe</div>
            <div class="text-white/70 text-sm">Product Manager</div>
          </div>
        </div>
        <p class="text-white/90 text-sm">
          "Memento has transformed how I manage information. I never lose track of important details anymore."
        </p>
      </div>
    </div>
  </div>

  <!-- Right side - Signup form -->
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
        <h2 class="text-3xl font-bold text-ink">Create an account</h2>
        <p class="mt-2 text-ink-muted">Get started with Memento for free</p>
      </div>

      <form on:submit={handleSignup} class="space-y-6">
        {#if error}
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-500">{error}</p>
          </div>
        {/if}

        <div>
          <label for="name" class="block text-sm font-medium text-ink mb-2">
            Full name
          </label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="w-full px-4 py-3 bg-canvas-raised border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="Jane Doe"
          />
        </div>

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
            minlength="8"
            class="w-full px-4 py-3 bg-canvas-raised border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="••••••••"
          />
          <p class="mt-1 text-xs text-ink-faint">Must be at least 8 characters</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-ink mb-2">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            required
            class="w-full px-4 py-3 bg-canvas-raised border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            required
            class="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
          />
          <label for="terms" class="text-sm text-ink-muted">
            I agree to the <a href="/terms" class="text-accent hover:text-accent-bright">Terms of Service</a> and <a href="/privacy" class="text-accent hover:text-accent-bright">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if loading}
            <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Creating account...</span>
          {:else}
            Create account
          {/if}
        </button>

        <div class="text-center text-sm text-ink-muted">
          Already have an account?
          <a href="/login" class="text-accent hover:text-accent-bright font-medium transition-colors">
            Sign in
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
