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
      if (confirm === 'unavailable' || confirm === 'full') return
			if (confirm === 'turn') {
				isPlaying.set(true);
				isPlayerTurn.set(true);
			}
			if (confirm === 'wait') {
				isPlaying.set(true);
				isPlayerTurn.set(false);
			}
			socket.on('inactive', () => {
				isPlaying.set(false);
				console.log('INACTIVE');
			});
			socket.on('wait', () => {
				isPlaying.set(true);
				isPlayerTurn.set(false);
				console.log('WAIT');
			});
			socket.on('turn', () => {
				isPlaying.set(true);
				isPlayerTurn.set(true);
				console.log('TURN');
			});
			socket.on('hover', (column) => {
				oppHoverColumn.set(column);
				console.log('HOVER');
			});
			socket.on('drop', (column) => {
				oppDropColumn.set(column);
				isPlayerTurn.set(true);
				console.log('DROP', column);
			});
			hoverColumn.subscribe((value) => {
        if (!active) return
				socket.emit('hover', value);
        console.log('hover')
			});
			dropColumn.subscribe((value) => {
        if (!active) return
				socket.emit('drop', value);
        dropColumn.set(undefined)
        isPlayerTurn.set(false)
        console.log('drop')
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
