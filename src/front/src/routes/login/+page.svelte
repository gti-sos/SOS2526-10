<script>
  import { isAuthenticated, username } from '$lib/utils/login/authStore.js';
  import { goto } from '$app/navigation';
  
  let usernameInput = $state("");
  let passwordInput = $state("");
  let errorMsg = $state("");

  async function handleLogin() {
    const res = await fetch('/api/v2/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: usernameInput, 
        password: passwordInput 
      })
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
  <h2>Iniciar Sesión</h2>
  {#if errorMsg}<p style="color:red">{errorMsg}</p>{/if}
  <input type="text" bind:value={usernameInput} placeholder="Usuario" />
  <input type="password" bind:value={passwordInput} placeholder="Contraseña" />
  <button onclick={handleLogin}>Entrar</button>
</main>