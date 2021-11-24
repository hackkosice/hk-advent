<script>
    import Grid from "./Grid.svelte";
    import { parseJwt, post } from "../utils/utils";
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

    let isSignup = false;
    let isLoggedIn = Object.keys(window.localStorage).includes('token');
    let username = "";
    let password = "";
    let userUsername = Object.keys(window.localStorage).includes('token') ? parseJwt(window.localStorage.getItem('token')).username : '';

    const handleSubmit = (e) => {
        if(username.length === 0 || password.length === 0) {
            window.alert("Fields should not be empty");
            return;
        }

        post(`${process.env.API_URL}/api/${isSignup ? 'signup' : 'signin'}`, {username, password})
            .then(data => {
                if(data.status === 'ok') {
                    window.localStorage.setItem('token', data.token);
                    userUsername = parseJwt(data.token).username;
                    isLoggedIn = true;
                    dispatch('login', {
                        admin: parseJwt(data.token).isAdmin
                    })
                    return;
                } 
                throw new Error(data.payload);
            }).catch(e => {
                window.alert(e.message);
            })
    }

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        isLoggedIn = false;
        userUsername = "";
        dispatch('logout');
    }
</script>

<main>
    {#if isLoggedIn}
        <div class="logout">
            <button on:click={handleLogout}>Logout</button>
            <p>{userUsername}</p>
        </div>
        <Grid />
    {:else}
        <h1>Sign {isSignup ? 'up' : 'in'}</h1>
        <form action="" on:submit|preventDefault={handleSubmit}>
            <label for="username">Username</label>
            <input type=text id="username" bind:value={username}>
            <label for="password">Password</label>
            <input type=password id="password" bind:value={password}>
            <input type=submit value="Submit">
        </form>
        <button on:click={() => isSignup = !isSignup}>Sign {isSignup ? 'in' : 'up'}</button>
    {/if}
</main>

<style>
main {
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    align-self: flex-start;
}
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}
.logout {
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
