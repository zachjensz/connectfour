<script>
	/** @type {import('./$types').PageData} */
	export let data;
	const gameuuid = data.gameuuid;
	import { dev } from '$app/environment';

	import { onMount } from 'svelte';
	import {
		status,
		drops,
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
		const socket = io(dev ? '' : 'wss://prodsite');
		socket.emit('join', gameuuid, (confirm, previousDrops) => {
			drops.set(previousDrops);
			switch (confirm) {
				case 'unavailable':
					status.set(`Game ${gameuuid} is unavilable`);
					return;
				case 'full':
					status.set(`Game ${gameuuid} is full`);
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
				oppHoverColumn.set(undefined);
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
			socket.on('win', () => {
				status.set($isPlayerTurn ? 'Opponent wins' : 'You win');
				isPlayerTurn.set(undefined);
			});
			hoverColumn.subscribe((column) => {
				if (!active) return;
				socket.emit('hover', column);
				console.log('send: hover');
			});
			dropColumn.subscribe((column) => {
				if (!active) return;
				if (typeof column !== 'number') return;
				socket.emit('drop', column);
				dropColumn.set(undefined);
				isPlayerTurn.set(false);
				console.log('send: drop', column);
			});
		});
	});
</script>

<Banner />
<Grid />
