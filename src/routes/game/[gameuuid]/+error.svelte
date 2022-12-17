<script>
  import { page } from '$app/stores';
</script>

{#if $page.status == "404"}
<h1>Game Unavailable (404)</h1>
<p><em>{$page.error.message}</em> isn't around anymore, either
  <a href="/host">host a new game</a>
  or
  <a href="/join">join a different game</a>
</p>
{:else}
<h1>{$page.status}</h1>
<p>{$page.error.message}</p>
{/if}
