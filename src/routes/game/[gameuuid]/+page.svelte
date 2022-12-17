<script>
	/** @type {import('./$types').PageData} */
	export let data;
	const gameuuid = data.gameuuid;

	import { onMount } from 'svelte';
	import {
		status,
		isPlayerTurn,
		hoverColumn,
		dropColumn,
		oppHoverColumn,
		oppDropColumn
	} from '$lib/stores.js';
	import Grid from '$lib/Grid.svelte';
	import Banner from '$lib/Banner.svelte';
	import { io } from 'socket.io-client';

	let active;
	isPlayerTurn.subscribe((value) => {
		active = value;
	});

	onMount(() => {
		const socket = io();
		socket.emit('join', gameuuid, (confirm) => {
			switch (confirm) {
				case 'unavailable':
					status.set('Game unavailable');
					return;
				case 'full':
					status.set('Game full');
					return;
				case 'turn':
					isPlayerTurn.set(true);
					break;
				case 'wait':
					isPlayerTurn.set(false);
					break;
				default:
					throw 'unknown confirmation on joining';
			}
			socket.on('inactive', () => {
				status.set('Opponent disconnected. Waiting...');
				isPlayerTurn.set(true);
				console.log('receive: inactive');
			});
			socket.on('wait', () => {
				isPlayerTurn.set(false);
				console.log('receive: wait');
			});
			socket.on('turn', () => {
				isPlayerTurn.set(true);
				console.log('receive: turn');
			});
			socket.on('hover', (column) => {
				oppHoverColumn.set(column);
				console.log('receive: hover');
			});
			socket.on('drop', (column) => {
				oppDropColumn.set(column);
				isPlayerTurn.set(true);
				console.log('receive: drop', column);
			});
			hoverColumn.subscribe((column) => {
				if (!active) return;
				socket.emit('hover', column);
				console.log('send: hover');
			});
			dropColumn.subscribe((column) => {
				if (!active) return;
				socket.emit('drop', column);
				dropColumn.set(undefined);
				isPlayerTurn.set(false);
				console.log('send: drop', column);
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
