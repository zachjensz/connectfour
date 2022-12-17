<script>
	import { status, isPlayerTurn } from '$lib/stores.js';
</script>

{#if $isPlayerTurn}
	<h1>Your turn</h1>
{:else if $isPlayerTurn === false}
	<h1>Opponent's turn</h1>
{:else}
	<h1>{$status}</h1>
{/if}
