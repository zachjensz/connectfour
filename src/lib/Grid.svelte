<script>
	import Column from '$lib/Column.svelte'

	export let columns = Array(7)
</script>
<div class="grid">
	{#each columns as column, columnIndex}
		<Column {columnIndex} rows={Array(6).fill(0)} />
	{/each}
</div>
<style>
	.grid {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
