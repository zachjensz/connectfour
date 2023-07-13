<script>
	const SERVER_URL =
		process.env.NODE_ENV == 'production'
			? 'https://connectfour-server.onrender.com'
			: 'http://localhost:6464';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import {
		status,
		drops,
		hoverColumn,
		dropColumn,
		oppHoverColumn,
		oppDropColumn,
	} from './lib/stores.js';
	import url from './lib/url.js';
	import Grid from './lib/Grid.svelte';
	import Banner from './lib/Banner.svelte';
	import Confetti from './lib/Confetti.svelte';

	const socket = io(SERVER_URL);
	!$url.pathname.substring(1)
		? socket.emit('create')
		: socket.emit('join', $url.pathname.substring(1));
	socket.on('unavailable', () => {
		status.set('unavailable');
		console.log('receive: unavailable');
	});
	socket.on('full', () => {
		status.set('full');
		console.log('receive: full');
	});
	socket.on('created', (new_uuid) => {
		history.pushState(new_uuid, '', new_uuid);
		status.set('lobby');
		console.log('receive: created');
	});
	socket.on('joined', (previousDrops) => {
		drops.set(previousDrops);
		console.log('receive: created');
	});
	socket.on('inactive', () => {
		status.set('inactive');
		console.log('receive: inactive');
	});
	socket.on('wait', () => {
		status.set('wait');
		console.log('receive: wait');
	});
	socket.on('turn', () => {
		status.set('turn');
		oppHoverColumn.set(undefined);
		console.log('receive: turn');
	});
	socket.on('hover', (column) => {
		oppHoverColumn.set(column);
		console.log('receive: hover');
	});
	socket.on('drop', (column) => {
		status.set('turn');
		oppDropColumn.set(column);
		console.log('receive: drop', column);
	});
	socket.on('win', () => {
		if ($status === 'turn') status.set('winopponent');
		if ($status === 'wait') {
			status.set('winplayer');
			winConfetti();
		}
		console.log('receive: win', $status);
	});
	hoverColumn.subscribe((column) => {
		if ($status !== 'turn') return;
		socket.emit('hover', column);
		console.log('send: hover');
	});
	dropColumn.subscribe((column) => {
		if ($status !== 'turn') return;
		if (typeof column !== 'number') return;
		socket.emit('drop', column);
		status.set('wait');
		dropColumn.set(undefined);
		console.log('send: drop', column);
	});
</script>

<main>
	<h1>Zach's Connect Four</h1>
	<Banner url={$url.pathname.substring(1)} />
	{#if $url.pathname.substring(1) === ''}
		<p>Connecting to server...</p>
	{:else}
		{#if $status === 'inactive' || $status === 'lobby'}
			<p>
				{`Invite ${
					$status === 'lobby' ? 'a friend' : 'them back'
				} with this link:`}
			</p>
			<code>https://connectfour.pages.dev/{$url.pathname.substring(1)}</code>
			<br />
		{/if}
		<Grid />
	{/if}
	{#if $status == 'winplayer'}
		<Confetti />
	{/if}
</main>

<style>
	main {
		display: grid;
		place-content: center;
	}
</style>
