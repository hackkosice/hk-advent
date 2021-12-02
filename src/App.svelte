<script>
  import Login from "./components/Login.svelte";
  import AdminPanel from "./components/AdminPanel.svelte";
  import { parseJwt } from "./utils/utils";

  $: isAdmin = Object.keys(window.localStorage).includes('token') ? parseJwt(window.localStorage.getItem('token')).isAdmin : false;
</script>

<main>
  <header>
    <h1>&#x1F384; Hack Kosice &#x1F384;</h1>
  </header>
  <section>
    {#if isAdmin}
      <AdminPanel on:logout={() => isAdmin = false} />
    {:else}
      <Login on:login={admin => isAdmin = admin.detail.admin} on:logout={() => isAdmin = false} />
    {/if}
  </section>
  <img alt="Snow" src="images/SNEH.svg" />
  <button class="feedback" title="Send a feedback"><a href="mailto:dmatis@hackkosice.com?subject=HK%20Advent%20Feedback">?</a></button>
  <button class="hint" title="Hack Kosice FB page"><a href="https://www.facebook.com/hackkosice"><img src="images/facebook.png" alt="facebook icon"></a></button>
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}
header {
  position: sticky;
  text-align: center;
  font-size: .7rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
section {
  margin-bottom: 10vh;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
img {
  position: fixed;
  bottom: 0;
  left: 0;
  transform: rotateY(180deg);
}
.feedback, .hint {
  color: #fff;
  background: var(--orange);
  position: fixed;
  right: 0;
  top: 10rem;
  border: none;
  border-radius: 2rem 0 0 2rem;
  height: 3rem;
  width: 4rem;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
.hint {
  top: 15rem;
}

.hint img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.feedback > * {
  color: inherit;
}
.feedback:hover,
.hint:hover {
    background: #fff;
    color: var(--orange);
    border: 3px solid var(--orange);
    border-right: none;
    transform: translateY(5px);
}
</style>
