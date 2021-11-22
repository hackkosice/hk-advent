<script>
  import Countdown from "./components/Countdown.svelte";
  import Login from "./components/Login.svelte";
  import AdminPanel from "./components/AdminPanel.svelte";
  import { parseJwt } from "./utils/utils";

  let adventHasStarted = true;
  $: isAdmin = Object.keys(window.localStorage).includes('token') ? parseJwt(window.localStorage.getItem('token')).isAdmin : false;
</script>

<main>
  <header>
    <h1>&#x1F384; Hack Kosice &#x1F384;</h1>
  </header>
  {#if isAdmin}
    <AdminPanel on:logout={() => isAdmin = false} />
  {:else}
    {#if adventHasStarted}
      <Login on:login={admin => isAdmin = admin.detail.admin} on:logout={() => isAdmin = false} />
    {:else}
      <Countdown on:start|once={() => (adventHasStarted = true)} />
    {/if}
  {/if}
  
  <img alt="Snow" src="SNEH.svg" />
  <button class="feedback" title="Send a feedback"><a href="mailto:dmatis@hackkosice.com?subject=HK%20Advent%20Feedback">?</a></button>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    text-align: center;
    height: 100%;
    width: 100vw;
  }

  .feedback {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 10;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .feedback a {
    color: inherit;
  }
  @media (max-width: 500px) {
    h1 {
      font-size: 1.4rem;
    }

    .feedback {
      right: 0;
      top: 10rem;
      border-radius: 2rem 0 0 2rem;
      height: 3rem;
      width: 4rem;
      font-size: 1rem;
    }
  }
  img {
    position: fixed;
    bottom: 0;
    left: 0;
    transform: rotateY(180deg);
  }
</style>
