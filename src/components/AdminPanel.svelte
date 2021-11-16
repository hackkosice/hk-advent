<script>
    import { onMount, createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    let host = 'https://advent.hackkosice.com';

    $: users = [];
    const getUsers = async () => {
        const resp = await fetch(`${host}/api/users`);
        const data = await resp.json();
        users = data.payload;
    }
    onMount(() => {
        getUsers();
    })

    const handleClick = (e) => {
        const id = e.target.parentNode.children[0].textContent;
        const isAdmin = e.target.parentNode.children[2].textContent;
        fetch(`${host}/api/${isAdmin === 'false' ? 'makeAdmin' : 'removeAdmin'}/${id}`)
        .then(() => getUsers());
    }

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        dispatch('logout');
    }
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
                    <th>E-mail</th>
                    <th>Admin?</th>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr on:click={handleClick}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.admin === 1}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
        <section>
            <h2>Submit task</h2>
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
</style>