<script>
	import Column from './Column.svelte'

	export let columns = Array(7)
</script>
<div class="grid">
	{#each columns as column, columnIndex}
		<Column rows={Array(6)} />
	{/each}
</div>
<style>
	.grid {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
