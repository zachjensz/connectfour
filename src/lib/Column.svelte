<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher();

	import { isPlayerTurn } from '$lib/stores.js'
	import Slot from '$lib/Slot.svelte'

	export let columnIndex = -1
	export let rows = []
	let active = false
	const activeUnsubscribe = isPlayerTurn.subscribe(value => {
		active = value;
	});

	$: hovered = -1

	function handleHover() {
		if (!active) return
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
		<Slot {slot} hover={hovered >= 0} drophint={hovered == slotIndex} />
	{/each}
</div>

<style>
	.column {
		display: flex;
		flex-flow: column nowrap;
	}
</style>
