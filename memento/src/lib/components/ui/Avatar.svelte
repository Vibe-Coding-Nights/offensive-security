<script lang="ts">
  import { cn, getInitials, stringToColor } from '$lib/utils';

  export let src: string | null = null;
  export let alt = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let status: 'online' | 'offline' | 'away' | null = null;

  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-ink-faint',
    away: 'bg-warning'
  };

  const statusSizes = {
    sm: 'w-1.5 h-1.5 bottom-0 right-0',
    md: 'w-2 h-2 bottom-0 right-0',
    lg: 'w-2.5 h-2.5 bottom-0.5 right-0.5',
    xl: 'w-3 h-3 bottom-0.5 right-0.5'
  };

  $: initials = alt ? getInitials(alt) : '?';
  $: bgColor = stringToColor(alt);
</script>

<div class={cn('relative inline-block', $$props.class)}>
  <div
    class={cn(
      'rounded-full overflow-hidden flex items-center justify-center font-medium',
      'transition-all duration-200',
      sizes[size]
    )}
    style={!src ? `background-color: ${bgColor}` : ''}
  >
    {#if src}
      <img {src} {alt} class="w-full h-full object-cover" />
    {:else}
      <span class="text-white select-none">{initials}</span>
    {/if}
  </div>

  {#if status}
    <span
      class={cn(
        'absolute rounded-full border-2 border-canvas',
        statusColors[status],
        statusSizes[size]
      )}
      aria-label={`Status: ${status}`}
    />
  {/if}
</div>
