<script>
import { onMount } from "svelte";

import { getTasks, makeSubmission } from "../utils/utils";


  let boxes = [];
  let selected = -1;
  let value = "";

  const refreshBoxes = async () => {
    const data = await getTasks();
    boxes = data.payload;
  }

  onMount(() => refreshBoxes());

  const handleSubmit = () => {
    if(value.length === 0) {
      window.alert('Answer cannot be empty');
      return;
    }
    makeSubmission({day: boxes[selected].day, answer: value})
    .then(data => {
      if(data.payload === 'correct') {
        selected = -1;
        refreshBoxes();
        return;
      }
      window.alert(`Answer is ${data.payload}`);
      value = "";
    })
  };
</script>

<main>
  {#if selected > -1}
    <div class="task">
      <h3>{boxes[selected].title}</h3>
      {@html boxes[selected].text}
      <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value placeholder="Answer" />
        <input type="submit" value="Submit" />
      </form>
      <button on:click={() => selected = -1}>Back</button>
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
  gap: 2rem;
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
    background-color: #ef611e;
    border: none;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.task {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 400px) {
    form, button {
        max-width: 400px;
    }
}
</style>