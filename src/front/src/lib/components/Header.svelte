<script>
    /* eslint-disable svelte/no-navigation-without-resolve */
    import { isAuthenticated, logout, username } from "$lib/utils/login/authStore";
</script>

<header>
    <title>SOS2526-10 API</title>
    <h1>SOS2526-10</h1>

    <nav>
        <a href="/">Inicio</a>
        <a href="/deaths-by-risk-factors">Muertes por Factores de Riesgo</a>
        <a href="/protests">Protestas</a>
        <a href="/pandemics">Pandemias</a>
        <a href="/child-malnutritions">Malnutrición Infantil</a>
        <a href="https://github.com/gti-sos/SOS2526-10" target="_blank">GitHub del proyecto</a>
    </nav>
    <nav>
        {#if !$isAuthenticated}
            <a href="/login">Iniciar sesión</a>
            <a href="/register">Registrarse</a>
        {:else}
            <span>Bienvenido, {$username}</span>
            <button on:click={ logout }>Cerrar sesión</button>
        {/if}
    </nav>
</header>