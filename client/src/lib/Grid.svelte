<script>
	import Column from './Column.svelte';
	import { columnCount } from './stores.js';
</script>

<div class="grid">
	{#each Array($columnCount) as column, columnIndex}
		<Column {columnIndex} />
	{/each}
</div>

<style>
	.grid {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
