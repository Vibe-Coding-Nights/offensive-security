<script lang="ts">
  import { page } from '$app/stores';
  import MemoryBrowser from '$lib/components/ai/MemoryBrowser.svelte';

  $: workspaceId = $page.params.workspaceId;
</script>

<MemoryBrowser {workspaceId} />
