<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher();

	import Slot from './Slot.svelte'

	export let columnIndex = -1
	export let rows = []

	$: hovered = -1

	function handleHover() {
		hovered = lowestFreeSlot()
	}
	function handleUnhover() {
		hovered = -1
	}
	function handleClick() {
		const dropPosition = lowestFreeSlot()
		if (dropPosition == null) return
		handleUnhover()
		rows[dropPosition] = 1;
		handleHover()
		dispatch("drop", {
			columnIndex: columnIndex
		});
	}
	function lowestFreeSlot() {
		if (rows[0] > 0) return null
		if (rows[rows.length-1] == 0) return rows.length - 1
		return rows.length - [...rows].reverse().findIndex(slot => slot < 1) - 1
	}
</script>

<div
	class="column"
	on:mouseenter={handleHover}
	on:mouseleave={handleUnhover}
	on:click={handleClick}
>
	{#each rows as slot, slotIndex}
		<Slot {slot} hover={hovered == slotIndex} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-flow: column nowrap;
	}
</style>
