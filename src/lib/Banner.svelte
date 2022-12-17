<script>
	import { isPlaying, isPlayerTurn } from '$lib/stores.js';
</script>

{#if $isPlaying}
	{#if $isPlayerTurn}
		<h1>Your turn</h1>
	{:else}
		<h1>Opponent's turn</h1>
	{/if}
{:else}
	<h1>Waiting for other players...</h1>
{/if}

