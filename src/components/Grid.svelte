<script>
  let boxes = Array(24).fill({});
</script>

<main>
  <div id="wrapper">
    {#each boxes as box,i}
      <div class="box disabled">
          <p>{i+1}</p>
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .box {
    width: 100px;
    height: 100px;
    border: 2px solid #fff;
  }
  .box > p {
      font-size: 2rem;
  }
  .disabled {
      border: 2px solid grey;
      color: grey;
  }

  #wrapper {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 2rem;
    height: 40vh;
  }
  
  @media (max-width: 500px) {
    main {
      align-items: start;
    }
    #wrapper {
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 100px;
    }
  }
</style>
