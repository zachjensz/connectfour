<script>
	import Slot from './Slot.svelte'

	export let rows = []

	$: hovered = -1

	function hover() {
		hovered = Math.min(rows.length - 1, rows.length - [...rows].reverse().findIndex(slot => slot == 0) - 1)
	}
	function unhover() {
		hovered = -1
	}
</script>
<div class="column" on:mouseenter={hover} on:mouseleave={unhover} on:click>
	{#each rows as slot, slotIndex}
		<Slot primary={slot == 1} secondary={slot == 2} hover={hovered == slotIndex} />
	{/each}
</div>
<style>
	.column {
		display: flex;
		flex-flow: column nowrap;
	}
</style>
