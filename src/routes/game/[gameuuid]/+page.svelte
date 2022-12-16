<script>
	/** @type {import('./$types').PageData} */
	export let data;
	const gameuuid = data.gameuuid;

	import { onMount } from 'svelte';
	import {
		isPlaying,
		isPlayerTurn,
		hoverColumn,
		dropColumn,
		oppHoverColumn,
		oppDropColumn
	} from '$lib/stores.js';
	import Grid from '$lib/Grid.svelte';
	import Banner from '$lib/Banner.svelte';
	import { io } from 'socket.io-client';

	let active
	isPlayerTurn.subscribe(value => {
		active = value;
	});

	onMount(() => {
		const socket = io();
		socket.emit('join', gameuuid, (confirm) => {
      if (confirm == 'null' || confirm == 'full') return
			console.log(confirm);
			socket.on('start', () => {
				isPlaying.set(true);
				console.log('START');
			});
			socket.on('wait', () => {
				isPlaying.set(false);
				console.log('WAIT');
			});
			socket.on('turn', () => {
				console.log('TURN');
				isPlayerTurn.set(true);
			});
			socket.on('hover', (column) => {
				oppHoverColumn.set(column);
				console.log('HOVER');
			});
			socket.on('drop', (column) => {
				console.log('DROP', column);
				isPlayerTurn.set(true);
			});
			hoverColumn.subscribe((value) => {
        if (!active) return
				socket.emit('hover', value);
        console.log('emit hover')
			});
			dropColumn.subscribe((value) => {
        console.log('emit: drop', value);
        if (!active) return
        console.log('emit: drop, is active', value);
				socket.emit('drop', value);
        dropColumn.set(undefined)
        isPlayerTurn.set(false)
        console.log('emit: drop end')
			});
		});
	});
</script>

<Banner />
<main>
	<Grid />
</main>

<style>
	main {
		display: flex;
	}
</style>
