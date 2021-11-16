<script>
    import Grid from "./Grid.svelte";

    let isSignup = true;
    let isLoggedIn = Object.keys(window.localStorage).includes('token');
    let email = "";
    let password = "";
    let userEmail = "";

    const handleSubmit = (e) => {
        fetch(`http://localhost:9876/api/${isSignup ? 'signup' : 'signin'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            }).then(resp => resp.json())
            .then(data => {
                if(data.status === 'ok') {
                    window.localStorage.setItem('token', data.token);
                    userEmail = "tu bude mail";
                    isLoggedIn = true;
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
        userEmail = "";
    }
</script>

<main>
    {#if isLoggedIn}
        <Grid />
        <div id="logout">
            <p>{userEmail}</p>
            <button on:click={handleLogout}>Logout</button>
        </div>
    {:else}
        <div>
            <h1>Sign {isSignup ? 'up' : 'in'}</h1>
            <form action="" on:submit|preventDefault={handleSubmit}>
                <label for="email">Email</label>
                <input type=text id="email" bind:value={email}>
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
input {
    margin: 1.5rem 0;
    height: 2rem;
    background: transparent;
    border: 2px solid #fff;
    color: #fff;
}
input[type="submit"], button {
    background: #ef611e;
    color: #fff;
    border: none;
    height: 3rem;
    width: 70vw;
}
#logout {
    position: fixed;
    right: 1rem;
    top: 1rem;
    height: 2rem;
    display: flex;
    justify-content: end;
}
#logout > button {
    width: 10rem;
    margin-left: 1rem;
}

@media (min-width: 900px) {
    div, input[type="submit"], button {
        width: 20vw;
    }
}
</style>
