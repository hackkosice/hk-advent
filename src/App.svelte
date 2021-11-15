<script>
	import Countdown from "./components/Countdown.svelte";
	import Grid from "./components/Grid.svelte";

	let adventHasStarted = false;
</script>

<main>
	<header>
		<h1>&#x1F384; Hack Kosice &#x1F384;</h1>
	</header>
	{#if adventHasStarted}
		<Grid />
	{:else}
		<Countdown on:start|once={() => adventHasStarted = true} />
	{/if}
	<img alt="Snow" src="SNEH.svg">
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;
		text-align: center;
		height: 100%;
	}
	@media (max-width: 500px) {
		h1 {
			font-size: 1.4rem;
		}
	}
	img {
		position: fixed;
		bottom: 0;
		left: 0;
		transform: rotateY(180deg);
	}
</style>