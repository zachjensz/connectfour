<script>
	import { isPlayerTurn } from './stores.js';
	export let text = false
</script>

{#if (text)}
	<h1>{text}</h1>
{:else}
	{#if $isPlayerTurn}
		<h1>Your turn</h1>
	{:else}
		<h1>Opponent's turn</h1>
	{/if}
{/if}
