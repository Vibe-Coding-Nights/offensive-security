<script lang="ts">
  import { page } from '$app/stores';
  import ChatPanel from '$lib/components/ai/ChatPanel.svelte';

  $: workspaceId = $page.params.workspaceId;
</script>

<ChatPanel {workspaceId} />
