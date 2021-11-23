<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getTask, getUsers, makeAdmin, removeAdmin, submitTask } from "../utils/utils";
  const days = [...Array(24)].map((_, i) => i + 1);
  let selectedDay = 0;
  let title = "";
  let text = "";
  let answer = "";

  let dispatch = createEventDispatcher();

  $: users = [];

  $: {
    getTask(selectedDay).then(data => {
      if(data.payload.length) {
        title = data.payload[0].title;
        text = data.payload[0].text;
        answer = data.payload[0].answer;
        return;
      }
    });
  }

  onMount(() => updateUsersList());

  const updateUsersList = async () => {
    users = await getUsers();
  }

  const handleClick = (e) => {
    const id = e.target.parentNode.children[0].textContent;
    const isAdmin = e.target.parentNode.children[2].textContent;
    if(isAdmin === "false") {
      makeAdmin(id).then(() => updateUsersList());
    } else {
      removeAdmin(id).then(() => updateUsersList());
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    dispatch("logout");
  };

  const handleSubmit = () => {
    if (selectedDay === "" || title === "" || text === "" || answer === "") {
      window.alert("Please fill all the information");
      return;
    }
    submitTask({ day: selectedDay, title, text, answer })
      .then((data) => {
        if (data.status === "ok") {
          window.alert("Task submitted successfully");
          return;
        }
        throw new Error(data.payload);
      });
  };
</script>

<main>
  <h1>Admin panel</h1>
  <button on:click={handleLogout}>Logout</button>
  <div>
    <section>
      <h2>Make admin</h2>
      <table>
        <thead>
          <th>ID</th>
          <th>Username</th>
          <th>Admin?</th>
        </thead>
        <tbody>
          {#each users as user}
            <tr on:click={handleClick}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.admin === 1}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
    <section>
      <h2>Submit task</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <label for="day">Day</label>
        <select id="day" bind:value={selectedDay}>
          {#each days as day}
            <option value={day}>
              {day}
            </option>
          {/each}
        </select>
        <label for="title">Title</label>
        <input type="text" id="title" bind:value={title} />
        <label for="text">Text</label>
        <textarea id="text" bind:value={text} />
        <label for="answer">Answer</label>
        <input type="text" id="answer" bind:value={answer} />
        <input type="submit" value="Submit" />
      </form>
    </section>
  </div>
</main>

<style>
  div {
    display: flex;
    justify-content: space-evenly;
  }
  section {
    width: 40vw;
    display: flex;
    flex-direction: column;
  }
  tr {
    padding: 2rem 0;
  }
  button {
    width: 10vw;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  input[type="submit"] {
    width: 20vw;
    align-self: center;
  }
  label {
    margin: 1rem;
  }
  select,
  input:not([type="submit"]) {
    height: 2rem;
  }
  textarea {
    height: 5rem;
  }

  @media (max-width: 500px) {
    button, input[type="submit"] {
      width: 80vw !important;
    }

    div {
        flex-direction: column;
        align-items: center;
    }

    div > section:nth-child(1) {
        display: none;
    }

    section {
        width: 80vw;
    }
  }
</style>
