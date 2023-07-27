<script>
	import { status } from './stores.js';
	import url from './url.js';

	export let uuid = '';
	function message(status) {
		switch (status) {
			case 'unavailable':
				return `Game ${uuid} doesn't exist`;
				break;
			case 'full':
				return `Game ${uuid} is full`;
				break;
			case 'inactive':
				return `Opponent disconnected`;
				break;
			case 'lobby':
				return `Waiting for opponent`;
				break;
			case 'winopponent':
				return `Opponent wins`;
				break;
			case 'winplayer':
				return `You win`;
				break;
			case 'turn':
				return `Your turn`;
				break;
			case 'wait':
				return `Opponent's turn`;
				break;
		}
	}
</script>

<h1>{message($status)}</h1>
{#if $status === 'inactive' || $status === 'lobby'}
	<p>
		{`Invite ${$status === 'lobby' ? 'a friend' : 'them back'} with this link:`}
	</p>
	<code>https://connectfour.pages.dev/{$url.pathname.substring(1)}</code>
	<br />
{/if}
{#if $status === 'winplayer'}
	<p>Click anywhere for new game</p>
{/if}
