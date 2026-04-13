<script>
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMsg = $state('');
	let successMsg = $state('');

	async function handleRegister() {
		if (!username || !password) {
			errorMsg = 'Todos los campos son obligatorios';
			return;
		}
		if (password !== confirmPassword) {
			errorMsg = 'Las contraseñas no coinciden';
			return;
		}

		const res = await fetch('/api/v2/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			successMsg = 'Registro completado. Redirigiendo...';
			errorMsg = '';
			setTimeout(() => goto('/login'), 2000);
		} else {
			if (res.status === 400)
                errorMsg = `El nombre de usuario ${username} ya está en uso`;
			else if (res.status === 500)
                errorMsg = 'Error interno del servidor';
			else {
				const data = await res.json();
				errorMsg = data.error || 'Error en el registro';
			}
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h2>Crear Cuenta</h2>

		{#if errorMsg}<div style="color: red;">{errorMsg}</div>{/if}
		{#if successMsg}<div>{successMsg}</div>{/if}

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
			<input
				id="confirm"
				type="password"
				bind:value={confirmPassword}
				placeholder="Confirma tu contraseña"
			/>
		</div>

		<button class="btn-primary" onclick={handleRegister}>Registrarse</button>
		<p class="footer-text">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
	</div>
</div>
