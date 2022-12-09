<script>
	import Column from '$lib/Column.svelte'

	export let columns = Array(7)

	function handleDrop(event) {
		const column = event.detail.columnIndex
	}
</script>
<div class="grid">
	{#each columns as column, columnIndex}
		<Column on:drop={handleDrop} {columnIndex} rows={Array(6).fill(0)} />
	{/each}
</div>
<style>
	.grid {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
