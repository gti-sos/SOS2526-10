<script>
    import { goto } from '$app/navigation';
    
    let username = "";
    let password = "";
    let confirmPassword = "";
    let errorMsg = "";
    let successMsg = "";

    async function handleRegister() {
        if (!username || !password) {
            errorMsg = "Todos los campos son obligatorios";
            return;
        }
        if (password !== confirmPassword) {
            errorMsg = "Las contraseñas no coinciden";
            return;
        }

        const res = await fetch('/api/v1/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            successMsg = "Registro completado. Redirigiendo...";
            errorMsg = "";
            setTimeout(() => goto('/login'), 2000);
        } else {
            const data = await res.json();
            errorMsg = data.error || "Error en el registro";
        }
    }
</script>

<div class="auth-container">
    <div class="auth-card">
        <h1>Crear Cuenta</h1>
        
        {#if errorMsg}<div class="alert error">{errorMsg}</div>{/if}
        {#if successMsg}<div class="alert success">{successMsg}</div>{/if}

        <div class="form-group">
            <label for="user">Usuario</label>
            <input id="user" type="text" bind:value={username} placeholder="Tu nombre de usuario" />
        </div>

        <div class="form-group">
            <label for="pass">Contraseña</label>
            <input id="pass" type="password" bind:value={password} placeholder="Mínimo 6 caracteres" />
        </div>

        <div class="form-group">
            <label for="confirm">Repetir Contraseña</label>
            <input id="confirm" type="password" bind:value={confirmPassword} placeholder="Confirma tu contraseña" />
        </div>

        <button class="btn-primary" on:click={handleRegister}>Registrarse</button>
        <p class="footer-text">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
    </div>
</div>