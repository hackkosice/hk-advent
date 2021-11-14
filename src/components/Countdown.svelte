<script>
    import dayjs from 'dayjs';
    import utc from 'dayjs/plugin/utc';
    import timezone from 'dayjs/plugin/timezone';
    import duration from 'dayjs/plugin/duration';
    import TypeIt from 'typeit';
    import { onMount } from 'svelte';

    const renderWelcomeText = () => {
        new TypeIt("#title", {
            cursor: false,
            speed: 100,
            deleteSpeed: 25,
            afterComplete: () => textRendered = true
        })
            .type("Starts")
            .pause(1000)
            .delete()
            .type("Dec 1st")
            .pause(1000)
            .delete()
            .type("Get ready!")
            .pause(1000)
            .delete()
            .pause(1000)
            .go();
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(duration);

    let textRendered = false;
    let currentDate = dayjs();
    let adventStartDate = dayjs('2021-12-01T00:00:00');
    $: remainingTime = dayjs.duration(adventStartDate.diff(currentDate)).format("DD[d] HH[h] mm[m] ss[s]");

    setInterval(() => {
        currentDate = dayjs();
    }, 1000);

    onMount(() => {
        if(window.localStorage.getItem('hasVisited') === null) {
            renderWelcomeText();
            window.localStorage.setItem('hasVisited', "true");
        } else {
            textRendered = true;
        }
    })
</script>

{#if currentDate.isBefore(adventStartDate)}
    {#if !textRendered}
    <main>
        <h1 id="title"> </h1>
    </main>
    {:else}
        <main>
            <p>Starts in</p>
            <h2>{remainingTime}</h2>
        </main>
    {/if}
{/if}

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
	@media (max-width: 500px) {
        h2 {
            font-size: 1.25rem;
        }
    }
</style>