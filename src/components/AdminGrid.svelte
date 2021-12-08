<script>
import { onMount } from "svelte";

import { getAdminTasks } from "../utils/utils";


  let boxes = [];
  let selected = -1;

  const refreshBoxes = async () => {
    const data = await getAdminTasks();
    boxes = data.payload;
  }

  onMount(() => refreshBoxes());

  const goBack = () => {
    selected = -1;
  }
</script>

<main>
  {#if selected > -1}
    <div class="task">
      <h3>{boxes[selected].title}</h3>
      {@html boxes[selected].text}
      <button on:click={goBack}>Back</button>
    </div>
  {:else}
    <div id="wrapper">
      {#each boxes as box, i}
        <div class={box.done ? "box done" : "box"} data-day={box.day} on:click={() => selected = i}>
          <p>{box.day}</p>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
main {
  width: 100%;
}
#wrapper, .task {
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
  justify-content: center;
}
.box {
  border: 1px solid #fff;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  cursor: pointer;
}
.done {
    background-color: var(--orange);
    border: none;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.task {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: auto;
  line-height: 1.8rem;
}

.task :global(img) {
  max-width: 100%;
}
@media (min-width: 400px) {
    form, button {
        max-width: 400px;
    }
}
</style>