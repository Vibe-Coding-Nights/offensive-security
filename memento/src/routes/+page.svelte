<script lang="ts">
</script>

<div class="min-h-screen bg-canvas flex items-center justify-center">
  <div class="text-center">
    <div class="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto"></div>
    <p class="mt-4 text-ink-muted">Loading...</p>
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
