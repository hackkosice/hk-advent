<script>
    import Grid from "./Grid.svelte";
    import { parseJwt } from "../utils/utils";
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

        fetch(`${process.env.API_URL}/api/${isSignup ? 'signup' : 'signin'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            }).then(resp => resp.json())
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
        <Grid />
        <div id="logout">
            <button on:click={handleLogout}>Logout</button>
            <p>{userUsername}</p>
        </div>
    {:else}
        <div>
            <h1>Sign {isSignup ? 'up' : 'in'}</h1>
            <form action="" on:submit|preventDefault={handleSubmit}>
                <label for="username">Username</label>
                <input type=text id="username" bind:value={username}>
                <label for="password">Password</label>
                <input type=password id="password" bind:value={password}>
                <input type=submit>
            </form>
            <button on:click={() => isSignup = !isSignup}>Sign {isSignup ? 'in' : 'up'}</button>
        </div>
    {/if}
</main>

<style>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
div {
    width: 70vw;
}
form {
    display: flex;
    flex-direction: column;    
}
input:not([type="submit"]) {
    margin: 1.5rem 0;
    height: 2rem;
    background: transparent;
    border: 2px solid #fff;
    color: #fff;
}

#logout {
    position: fixed;
    right: 1rem;
    top: 1rem;
    display: flex;
    align-items: end;
    flex-direction: column;
}
#logout > button {
    width: 10rem;
    height: 2rem;
}

@media (min-width: 900px) {
    div, input[type="submit"], button {
        width: 20vw;
    }
}

@media (max-width: 500px) {
    #logout {
        top: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        align-items: center;
    }
}
</style>
