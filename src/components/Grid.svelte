<script>
import { onMount } from "svelte";

import { getTasks, makeSubmission } from "../utils/utils";


  let boxes = [];
  let selected = "";
  let testTitleString = "Carol of the bells";
  let testTextString =
    "<p>Again, this text should be longer, but <b>hello</b>On the next line will be image</p><img style='max-width:100%' src='https://unsplash.it/600/600'>";
  let value = "";

  const refreshBoxes = async () => {
    const data = await getTasks();
    boxes = data.payload;
  }

  onMount(() => refreshBoxes());

  const handleSubmit = () => {
    console.log(value);
    if(value.length === 0) {
      window.alert('Answer cannot be empty');
      return;
    }
    makeSubmission({day: selected, answer: value})
    .then(data => {
      if(data.payload === 'correct') {
        selected = "";
        refreshBoxes();
        return;
      }
      window.alert(`Answer is ${data.payload}`);
      value = "";
    })
  };
</script>

<main>
  {#if selected}
    <div class="task">
      <h3>{boxes[selected - 1].title}</h3>
      {@html boxes[selected - 1].text}
      <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value placeholder="Answer" />
        <input type="submit" value="Submit" />
      </form>
      <button on:click={() => selected = ""}>Back</button>
    </div>
  {:else}
    <div id="wrapper">
      {#each boxes as box, i}
        <div class={box.done ? "box done" : "box"} data-day={box.day}>
          <p on:click={() => selected = box.day}>{box.day}</p>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  h1 {
    max-width: 100%;
    word-break: break-all;
  }
  .box {
    width: 100px;
    height: 100px;
    border: 2px solid #fff;
  }
  .box > p {
    font-size: 2rem;
  }

  .done {
    background-color: #ef611e;
  }
  .disabled {
    border: 2px solid grey;
    color: grey;
  }

  input:not([type="submit"]) {
    margin: 1.5rem 0;
    height: 2rem;
    width: 100%;
    background: transparent;
    border: 2px solid #fff;
    color: #fff;
  }

  button,
  input[type="submit"] {
    width: 100%;
  }

  #wrapper {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 2rem;
    height: 40vh;
  }

  .task {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 80vw;
    min-height: 100vh;
    padding-top: 30vh;
    padding-bottom: 10vh;
  }

  @media (max-width: 500px) {
    main {
      align-items: flex-start;
    }
    #wrapper {
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 100px;
    }

    .task {
      padding-top: 0;
    }
  }
</style>
