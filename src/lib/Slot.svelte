<script>
	export let slot = 0
	export let hover = false;
	export let dance = false;
</script>

<div
	class="slot"
	class:hover={hover}
	class:dance={dance}
	class:primary={slot === 1}
	class:secondary={slot === 2}
	on:click
	on:mouseover
	on:mouseleave
/>

<style>
	.slot {
		--slotImage: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v50A50 50 0 0 1 50 0H0zm50 0a50 50 0 0 1 50 50V0H50zm50 50a50 50 0 0 1-50 50h50V50zm-50 50A50 50 0 0 1 0 50v50h50z' style='fill:%2300a;fill-rule:evenodd;'/%3E%3Ccircle cx='50' cy='50' r='48' style='fill:none;stroke:%2300a;stroke-width:5;'/%3E%3C/svg%3E");
		--discImage: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23eef' stroke='%23ddf' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");
		--discImagePrimary: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e00' stroke='%23b00' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");
		--discImageSecondary: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle fill='%23ffe819' stroke='%23ffc010' stroke-width='5' cx='50' cy='50' r='45' /%3E%3C/svg%3E%0A");
		--discSize: 4rem;
		display: grid;
		place-content: center;
		width: var(--discSize);
		height: var(--discSize);
		position: relative;
		cursor: pointer;
	}
	.slot::after,
	.slot::before {
		content: '';
		position: absolute;
		inset: 0px;
		background-repeat: no-repeat;
		background-position: center;
		background-image: var(--discImage);
	}
	.slot::after {
		content: '';
		z-index: 1;
		outline: 2px solid #00a;
		outline-offset: -1px;
		background-image: var(--slotImage);
	}
	.slot.hover::after {
		z-index: 1;
		filter: brightness(1.5);
	}
	.slot.dance::before {
		isolation: isolate;
		z-index: 2;
		transform: scale(1.1);
		animation: 250ms ease-out infinite alternate disc-dance;
	}

	.slot.primary::before {
		background-image: var(--discImagePrimary);
	}
	.slot.secondary::before {
		background-image: var(--discImageSecondary);
	}

	.slot:is(.primary, .secondary)::before {
		filter: initial;
		animation-name: disc-drop;
		animation-duration: 1200ms;
	}

	@keyframes disc-dance {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.1);
		}
	}

	@keyframes disc-drop {
		0% {
			transform: translateY(-590px);
			animation-timing-function: ease-in;
		}
		50% {
			transform: translateY(0px);
			animation-timing-function: ease-out;
		}
		60% {
			transform: translateY(-250px);
			animation-timing-function: ease-in;
		}
		75% {
			transform: translateY(0px);
			animation-timing-function: ease-out;
		}
		80% {
			transform: translateY(-80px);
			animation-timing-function: ease-in;
		}
		90% {
			transform: translateY(0px);
		}
	}
</style>
