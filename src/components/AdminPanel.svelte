<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { getTask, getUsers, makeAdmin, removeAdmin, submitTask } from "../utils/utils";
  const days = [...Array(24)].map((_, i) => i + 1);
  let selectedDay = 0;
  let title = "";
  let text = "";
  let answer = "";
  let hasInputChanged = false;

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
      if(!hasInputChanged) {
        title = "";
        text = "";
        answer = "";
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

  const handleChange = () => {
    hasInputChanged = true;
  }
</script>

<main>
  <h1>Admin panel</h1>
  <button on:click={handleLogout}>Logout</button>
  <div class="wrapper">
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
        <input type="text" id="title" bind:value={title} on:keyup={handleChange} />
        <label for="text">Text</label>
        <textarea id="text" bind:value={text} on:keyup={handleChange} />
        <label for="answer">Answer</label>
        <input type="text" id="answer" bind:value={answer} on:keyup={handleChange} />
        <input type="submit" value="Submit" />
      </form>
    </section>
  </div>
</main>

<style>
div > section:nth-child(1) {
  display: none;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: start;
  width: 90%;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.wrapper {
  width: 100%;
}
section {
  width: 100%;
  margin: auto;
}
@media (min-width: 700px) {
  .wrapper {
    display: flex;
    justify-content: space-between;
  }
  div > section:nth-child(1) {
    display: block;
  }
  form, button {
    max-width: 400px;
  }
}
</style>