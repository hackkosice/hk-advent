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
