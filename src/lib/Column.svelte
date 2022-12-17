<script>
	import {
		isPlayerTurn,
		hoverColumn,
		dropColumn,
		oppHoverColumn,
		oppDropColumn
	} from '$lib/stores.js';
	import Slot from '$lib/Slot.svelte';

	export let columnIndex = -1;
	export let rows = [];
	$: hovered = -1;

	oppHoverColumn.subscribe((col) => {
		hovered = -1;
		if (col != columnIndex) return;
		hovered = lowestFreeSlot();
	});
	oppDropColumn.subscribe((col) => {
		if (col !== columnIndex) return;
		drop(false);
		oppDropColumn.set(undefined);
	});

	function handleHover() {
		if (!$isPlayerTurn) return;
		hoverColumn.set(columnIndex);
		hovered = lowestFreeSlot();
	}
	function handleClick() {
		if (!$isPlayerTurn) return;
		if (drop(true)) dropColumn.set(columnIndex);
	}
	function drop(isPlayer) {
		const dropPosition = lowestFreeSlot();
		if (dropPosition === null) return false;
		hovered = -1;
		rows[dropPosition] = isPlayer ? 1 : 2;
		hovered = lowestFreeSlot();
		return true
	}
	function lowestFreeSlot() {
		if (rows[0] > 0) return null;
		return rows.length - [...rows].reverse().findIndex((slot) => slot < 1) - 1;
	}
</script>

<div
	class="column"
	on:mouseenter={handleHover}
	on:mouseleave={() => hovered = -1}
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
