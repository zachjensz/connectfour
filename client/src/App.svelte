<script>
	const DEV_SERVER_URL = 'http://localhost:6464';
	const PROD_SERVER_URL = 'https://connectfour-server.onrender.com'
	const DEV = import.meta.env.dev
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import {
		status,
		drops,
		isPlayerTurn,
		hoverColumn,
		dropColumn,
		oppHoverColumn,
		oppDropColumn
	} from './lib/stores.js';
	import url from './lib/url.js';
	import Grid from './lib/Grid.svelte';
	import Banner from './lib/Banner.svelte';

	$: active = false;
	isPlayerTurn.subscribe((value) => {
		active = value;
	});

		const socket = io(DEV ? DEV_SERVER_URL : PROD_SERVER_URL);
		(!$url.pathname.substring(1)) ? socket.emit('create') : socket.emit('join', $url.pathname.substring(1))
			socket.on('unavailable', () => {
				status.set('unavailable');
				console.log('receive: unavailable');
			})
			socket.on('full', () => {
				status.set('full');
				console.log('receive: full');
			})
			socket.on('created', (new_uuid) => {
				history.pushState(new_uuid, '', new_uuid)
				status.set('lobby');
				console.log('receive: created');
			})
			socket.on('joined', (previousDrops) => {
			  drops.set(previousDrops)
				console.log('receive: created');
			})
			socket.on('inactive', () => {
				status.set('lobby');
				console.log('receive: inactive');
			});
			socket.on('wait', () => {
				status.set('wait');
				isPlayerTurn.set(false);
				console.log('receive: wait');
			});
			socket.on('turn', () => {
				status.set('turn');
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
				status.set($isPlayerTurn ? 'winopponent' : 'winplayer');
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
</script>

<main>
	<h1>Zach's Connect Four</h1>
	{#if $url.pathname.substring(1) === ''}
		<p>Creating Game. Please wait.</p>
	{:else if $status === "unavailable"}
		<Banner text={`Game ${$url.pathname.substring(1)} doesn't exist`} />
	{:else if $status === "full"}
		<Banner text={`Game ${$url.pathname.substring(1)} is full`} />
	{:else if $status === "winopponent"}
		<Banner text={`Opponent wins`} />
	{:else if $status === "winplayer"}
		<Banner text={`You win`} />
	{:else if $status === "lobby"}
		<p>Invite a friend with this link:</p>
		<br />
		<code>https://connectfour.url/{$url.pathname.substring(1)}</code>
	{:else}
		<Banner />
		<Grid />
	{/if}
</main>

<style>
	main {
		display: grid;
		place-content: center;
	}
</style>
