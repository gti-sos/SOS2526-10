<script>
/* eslint-disable svelte/no-navigation-without-resolve */
  import { goto } from '$app/navigation';
  
  let API = '/api/v2/deaths-by-risk-factors';

  // Estados para los campos del formulario
  let entity = $state('');
  let year = $state('');
  let high_systolic_blood_pressure = $state(0);
  let air_pollution = $state(0);
  let child_wasting = $state(0);
  let household_air_pollution_from_solid_fuels = $state(0);
  let high_fasting_plasma_glucose = $state(0);

  let errorMessage = $state('');
  let infoMessage = $state('');

  async function handleAddResource() {
    const token = localStorage.getItem("token");

    // Construimos el objeto respetando los nombres de tu API
    const newResource = {
      entity,
      year: parseInt(year),
      high_systolic_blood_pressure: high_systolic_blood_pressure,
      air_pollution: air_pollution,
      child_wasting: child_wasting,
      household_air_pollution_from_solid_fuels: household_air_pollution_from_solid_fuels,
      high_fasting_plasma_glucose: high_fasting_plasma_glucose
    };

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newResource)
      });

      if (res.status === 201) {
        infoMessage= `Recurso para ${entity} (${year}) creado con éxito.`
        await new Promise(resolve => setTimeout(resolve, 2000));
        goto('/deaths-by-risk-factors');
      } else if (res.status === 409) {
        errorMessage = "Error: El recurso ya existe (Conflicto).";
      } else if (res.status === 400) {
        errorMessage = "Error: Faltan campos o el formato es incorrecto.";
      } else {
        errorMessage = "Error inesperado: " + res.status;
      }
    } catch (error) {
      console.error('Error al añadir:', error);
      errorMessage = "No se pudo conectar con el servidor.";
    }
  }
</script>

<main>

  {#if infoMessage}
    <p>{infoMessage}</p>
  {:else if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}

  <h2>Añadir Nuevo Recurso</h2>

  <form onsubmit={(e) => { e.preventDefault(); handleAddResource(); }}>
    <label>País: <input type="text" bind:value={entity} required /></label><br />
    <label>Año: <input type="number" bind:value={year} required /></label><br />
    <label>Alta presión arterial: <input type="number" step="any" bind:value={high_systolic_blood_pressure} 
      min=0 /></label><br />
    <label>Contaminación del aire: <input type="number" step="any" bind:value={air_pollution} 
      min=0 /></label><br />
    <label>Desnutrición infantil: <input type="number" step="any" bind:value={child_wasting}
      min=0 /></label><br />
    <label>Contaminación combustibles sólidos: <input type="number" step="any" bind:value={household_air_pollution_from_solid_fuels}
      min=0 /></label><br />
    <label>Glucosa en sangre: <input type="number" step="any" bind:value={high_fasting_plasma_glucose}
      min=0 /></label><br />

    <button type="submit">Añadir Recurso</button>
    <button type="button" onclick={() => goto('/deaths-by-risk-factors')}>Cancelar</button>
  </form>
</main>
