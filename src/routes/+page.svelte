<script>

	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	onMount(() => {
		// const socket = io(dev ? "" : "wss://prodsite");
		// socket.emit('join', gameuuid, (confirm, previousDrops) => {
		// 	drops.set(previousDrops);
		// 	switch (confirm) {
		// 		case 'unavailable':
		// 			status.set('Game unavailable');
		// 			return;
		// 		case 'full':
		// 			status.set('Game full');
		// 			return;
		// 		case 'turn':
		// 			isPlayerTurn.set(true);
		// 			break;
		// 		case 'wait':
		// 			isPlayerTurn.set(false);
		// 			break;
		// 		default:
		// 			throw 'unknown confirmation on joining';
		// 	}
		// 	socket.on('inactive', () => {
		// 		status.set('Opponent disconnected. Waiting...');
		// 		isPlayerTurn.set(true);
		// 		console.log('receive: inactive');
		// 	});
		// 	socket.on('wait', () => {
		// 		isPlayerTurn.set(false);
		// 		console.log('receive: wait');
		// 	});
		// 	socket.on('turn', () => {
		// 		isPlayerTurn.set(true);
		// 		console.log('receive: turn');
		// 	});
		// 	socket.on('hover', (column) => {
		// 		oppHoverColumn.set(column);
		// 		console.log('receive: hover');
		// 	});
		// 	socket.on('drop', (column) => {
		// 		oppDropColumn.set(column);
		// 		isPlayerTurn.set(true);
		// 		console.log('receive: drop', column);
		// 	});
		// 	socket.on('win', () => {
		// 		status.set($isPlayerTurn ? 'Opponent wins' : 'You win');
		// 		isPlayerTurn.set(undefined);
		// 	});
		// 	hoverColumn.subscribe((column) => {
		// 		if (!active) return;
		// 		socket.emit('hover', column);
		// 		console.log('send: hover');
		// 	});
		// 	dropColumn.subscribe((column) => {
		// 		if (!active) return;
		// 		if (typeof column !== 'number') return;
		// 		socket.emit('drop', column);
		// 		dropColumn.set(undefined);
		// 		isPlayerTurn.set(false);
		// 		console.log('send: drop', column);
		// 	});
		// });
	});
</script>

<h1>Zach's Connect Four</h1>
<main>
	<p>Invite a friend with this link:</p>
	<br />
	<code>https://connectfour.url/ao4t</code>
</main>

<style>
	main {
		display: grid;
		place-content: center;
	}
</style>
