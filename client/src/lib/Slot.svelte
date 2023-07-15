<script>
	import { status } from './stores.js';
	export let disc = 0;
	export let hover = false;
	export let drophint = false;
	export let dance = false;

	function getColour(isFill, discType) {
		return isFill
			? `var(--c-disc${discType})`
			: `var(--c-disc${discType}Outline)`;
	}
	function getStyle(isFill) {
		if (!disc && !drophint) return 'none';
		return getColour(
			isFill,
			drophint ? ($status === 'turn' ? '1' : '2') : disc,
		);
	}
	const SLOT_SIZE = 40; // 0-50
	const SLOT_OUTLINE = 4;
	const DISC_SIZE = 38; // 0-50
	const DISC_OUTLINE = 4;
</script>

<div class="slot" class:hover on:click on:mouseover on:mouseleave>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
		<mask id="circle-clip">
			<rect width="100" height="100" fill="white" />
			<circle cx="50" cy="50" r={SLOT_SIZE} fill="black" />
		</mask>
		<rect
			width="100"
			height="100"
			mask="url(#circle-clip)"
			fill="var(--c-board)"
		/>
		<circle
			cx="50"
			cy="50"
			r={SLOT_SIZE - SLOT_OUTLINE / 2}
			fill="none"
			stroke="var(--c-board-outline)"
			stroke-width={SLOT_OUTLINE}
		/>
	</svg>
	{#if disc || drophint}
		<svg
			class="disc"
			class:drophint
			class:dance
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
		>
			<circle
				cx="50"
				cy="50"
				r={DISC_SIZE - DISC_OUTLINE}
				fill={getStyle(true)}
				stroke={getStyle(false)}
				stroke-width={DISC_OUTLINE}
			/>
		</svg>
	{/if}
</div>

<style>
	.slot {
		--c-board: #00e;
		--c-board-outline: #00c;
		--c-board-outline: #008;
		--c-discHighlight: none;
		--c-discHighlightOutline: none;
		--c-disc2: #ffe819;
		--c-disc2Outline: #ffc010;
		--c-disc1: #e00;
		--c-disc1Outline: #b00;
		--slotSize: 5rem;
		position: relative;
		width: var(--slotSize);
		height: var(--slotSize);
	}
	.slot svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
	.disc {
		isolation: isolate;
		z-index: 1;
		filter: initial;
		animation-name: disc-drop;
		animation-duration: 1200ms;
	}
	.disc.drophint {
		animation: none;
		filter: saturate(35%);
	}
	.disc.dance {
		isolation: isolate;
		z-index: 2;
		transform: scale(1.2);
		animation: 500ms ease-out infinite alternate disc-dance;
	}

	@keyframes disc-dance {
		0% {
			transform: scale(0.99);
		}
		100% {
			transform: scale(1.25);
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
