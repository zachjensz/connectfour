<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
</script>

<h1>Zach's Connect Four</h1>
<main>
	<p>Invite a friend with this link:</p>
	<br />
	<code>https://connectfour.url/uuid</code>
</main>

<style>
	main {
		display: grid;
		place-content: center;
	}
</style>
