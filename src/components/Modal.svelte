<script>
import { onMount, createEventDispatcher } from "svelte";
import { getLeaderboard } from "../utils/utils";

const dispatch = createEventDispatcher();
let users = [];

onMount(() => {
    getLeaderboard().then(data => users = data.payload.filter(x => x.username !== 'aaa').sort((a, b) => {
        if(a.count !== b.count) return b.count - a.count;
        return a.username.localeCompare(b.username)
    }));
});

const closeModal = () => {
    dispatch('close');
}

</script>

<main>
    <div class="close" on:click={closeModal}>&times;</div>
    <div class="wrapper">
        <h1>leaderboard</h1>
        <div class="list">
            {#each users as user}
                <div>
                    <p>{user.username.replace(/@.*$/, '')}</p>
                    <p>{user.count}</p>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
main {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, .8);
    z-index: 1000;
    display: grid;
    place-items: center;
    color: white;
}

.close {
    position: absolute;
    z-index: 1001;
    top: 0.5rem;
    right: 1rem;
    font-size: 2rem;
    cursor: pointer;
}

.wrapper {
    background: var(--orange);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1 {
    font-size: 1rem;
}

.list {
    display: flex;
    flex-direction: column;
    width: 90%;
}

.list > div {
    display: flex;
    justify-content: space-evenly;
}

.list > div > p {
    width: 50%;
    overflow: hidden;
}

p:nth-of-type(2) {
    text-align: center;
}

@media (min-width: 600px) {
    main {
        top: 10vh;
        left: 20vw;
        width: 60vw;
        height: 60vh;
    }
    .list {
        max-height: 60vh;
        overflow: scroll;

    }
}

</style>