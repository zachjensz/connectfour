<script>
	import { createEventDispatcher } from 'svelte'

	import { isPlayerTurn, hoverColumn, dropColumn, oppHoverColumn, oppDropColumn } from '$lib/stores.js';
	import Slot from '$lib/Slot.svelte'

	export let columnIndex = -1
	export let rows = []

	let active
	isPlayerTurn.subscribe(value => {
		active = value;
	});
	oppHoverColumn.subscribe(col => {
		hovered = -1
		if (col != columnIndex) return
		hovered = lowestFreeSlot()
	});
	oppDropColumn.subscribe(col => {
		if (col !== columnIndex) return
		const dropPosition = lowestFreeSlot()
		if (dropPosition == null) return
		rows[dropPosition] = 2;
		oppDropColumn.set(undefined)
	});

	$: hovered = -1

	function handleHover() {
		if (!active) return
		hoverColumn.set(columnIndex)
		hovered = lowestFreeSlot()
	}
	function handleUnhover() {
		if (!active) return
		hovered = -1
	}
	function handleClick() {
		if (!active) return
		const dropPosition = lowestFreeSlot()
		if (dropPosition == null) return
		handleUnhover()
		rows[dropPosition] = 1;
		handleHover()
		dropColumn.set(columnIndex)
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
		<Slot {slot} hover={hovered >= 0} drophint={hovered == slotIndex} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-flow: column nowrap;
	}
</style>
