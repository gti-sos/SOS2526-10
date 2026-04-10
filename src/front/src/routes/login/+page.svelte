<script>
  import { isAuthenticated, username } from '$lib/utils/login/authStore.js';
  import { goto } from '$app/navigation';
  
  let usernameInput = "";
  let passwordInput = "";
  let errorMsg = "";

  async function handleLogin() {
    const res = await fetch('/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameInput, passwordInput })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput);
      isAuthenticated.set(true);
      username.set(usernameInput);
      goto('/'); 
    } else {
      errorMsg = "Usuario o contraseña incorrectos";
    }
  };
</script>

<main class="container">
  <h1>Iniciar Sesión</h1>
  <input type="text" bind:value={usernameInput} placeholder="Usuario" />
  <input type="password" bind:value={passwordInput} placeholder="Contraseña" />
  <button on:click={handleLogin}>Entrar</button>
  {#if errorMsg}<p style="color:red">{errorMsg}</p>{/if}
</main>