<script>
    import dayjs from 'dayjs';
    import utc from 'dayjs/plugin/utc';
    import timezone from 'dayjs/plugin/timezone';
    import duration from 'dayjs/plugin/duration';
    import TypeIt from 'typeit';
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(duration);

    let textRendered = false;
    let currentDate = dayjs();
    let adventStartDate = dayjs('2021-12-01T00:00:00');
    $: remainingTime = dayjs.duration(adventStartDate.diff(currentDate)).format("DD[d] HH[h] mm[m] ss[s]");

    setInterval(() => {
        currentDate = dayjs();
        if(currentDate.isAfter(adventStartDate)) {
            dispatch('start');
        }
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-self: center;
    }
    h2 {
        font-size: 1.5rem;
    }
</style>