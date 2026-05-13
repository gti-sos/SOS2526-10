<script>
  import { onMount } from "svelte";
  // @ts-ignore
  let pandemics = $state([]);
  let API = '/api/v2/pandemics';
  let responseStatusCode = $state(0);
  let statusMsg = $state("");
  let page = $state(0);

  let searchEntity = $state("");
  let searchCode = $state("");
  let searchFrom = $state("");
  let searchTo = $state("");
  let searchYaws = $state("");
  let searchPolio = $state("");
  let searchGuinea = $state("");
  let searchRabies = $state("");
  let searchMalaria = $state("");
  let searchHiv = $state("");
  let searchTuberculosis = $state("");
  let searchSmallpox = $state("");
  let searchCholera = $state("");

async function loadPandemics() {
    try {
      let url = `${API}?offset=${page * 10}&limit=10`;
      
      // Construcción de la URL con filtros
      if (searchEntity !== "") url += `&entity=${encodeURIComponent(searchEntity)}`;
      if (searchCode !== "")   url += `&code=${encodeURIComponent(searchCode)}`;
      if (searchFrom !== "")   url += `&from=${searchFrom}`;
      if (searchTo !== "")     url += `&to=${searchTo}`;
      
      // Filtros de enfermedades añadidos a la URL
      if (searchYaws !== "")         url += `&yaws=${searchYaws}`;
      if (searchPolio !== "")        url += `&polio=${searchPolio}`;
      if (searchGuinea !== "")       url += `&guinea_worm=${searchGuinea}`;
      if (searchRabies !== "")       url += `&rabies=${searchRabies}`;
      if (searchMalaria !== "")      url += `&malaria=${searchMalaria}`;
      if (searchHiv !== "")          url += `&hiv_aids=${searchHiv}`;
      if (searchTuberculosis !== "") url += `&tuberculosis=${searchTuberculosis}`;
      if (searchSmallpox !== "")     url += `&smallpox=${searchSmallpox}`;
      if (searchCholera !== "")      url += `&cholera=${searchCholera}`;

      const response = await fetch(url);
      const data = await response.json();
      responseStatusCode = response.status;
      
      if (response.ok) {
        pandemics = Array.isArray(data) ? data : [data];
        
        // --- AQUÍ ESTÁ EL CAMBIO ---
        if (pandemics.length === 0) {
            // Si el usuario ha escrito algo en los filtros y no hay resultados
            if (searchEntity !== "" || searchCode !== "" || searchFrom !== "" || searchTo !== "") {
                statusMsg = `No se ha encontrado ningún recurso con los parámetros de búsqueda introducidos.`;
            } else {
                statusMsg = "No hay datos disponibles en la base de datos.";
            }
        } else {
            statusMsg = ""; // Si hay datos, limpiamos cualquier mensaje previo
        }
        // ---------------------------
        
      } else {
        pandemics = [];
        statusMsg = "Error al obtener los datos.";
      }
    } catch (error) {
      console.error('Error fetching pandemics:', error);
      statusMsg = "Error de conexión con el servidor.";
    }
  }

  function clearFilters() {
    searchEntity = ""; searchCode = ""; searchFrom = ""; searchTo = "";
    searchYaws = ""; searchPolio = ""; searchGuinea = "";
    searchRabies = ""; searchMalaria = ""; searchHiv = "";
    searchTuberculosis = ""; searchSmallpox = ""; searchCholera = "";
    page = 0;
    loadPandemics();
  }

  // @ts-ignore
  async function deleteResource(entity, year) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el dato: ${entity} (${year})?`)) return;
    try {
      const response = await fetch(`${API}/${encodeURIComponent(entity)}/${year}`, { method: 'DELETE' });
      responseStatusCode = response.status;
      if (response.ok) {
        statusMsg = `El dato de ${entity} (${year}) se ha eliminado correctamente.`;
        loadPandemics();
        setTimeout(() => statusMsg = "", 3000);
      } else {
        statusMsg = `Error: No se ha podido eliminar el dato de ${entity} del año ${year}.`;;
      }
    } catch (error) { statusMsg = "Error de conexión al intentar eliminar."; }
  }

  async function loadInitialData() {
    try {
      const response = await fetch(`${API}/loadInitialData`, { method: 'GET' });
      responseStatusCode = response.status;
      if (response.ok) {
        statusMsg = "Datos cargados correctamente.";
        loadPandemics();
        setTimeout(() => statusMsg = "", 3000);
      } else {
        statusMsg = "Error al cargar los datos.";
      }
    } catch (error) { statusMsg = "Error de conexión al cargar datos iniciales."; }
  }

  async function deleteData() {
    if (!confirm(`¿Estás seguro de que deseas eliminar todos los datos?`)) return;
    try {
      const response = await fetch(`${API}`, { method: 'DELETE' });
      responseStatusCode = response.status;
      if (response.ok) {
        statusMsg = "Todos los datos han sido eliminados con éxito.";
        pandemics = [];
        page = 0;
        setTimeout(() => statusMsg = "", 3000);
      } else {
        statusMsg = "Error al intentar vaciar la lista.";
      }
    } catch (error) { statusMsg = "Error de conexión al eliminar todos los datos"; }
  }

  $effect(() => { loadPandemics(); });
  onMount(() => { loadPandemics(); });
</script>

<div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; background-color: #f9f9f9; border-radius: 8px;">
  <h4 style="margin-top: 0;">Buscador</h4>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; align-items: flex-end;">
    
    <label>País: <br>
      <input type="text" bind:value={searchEntity} style="width: 90%"/>
    </label>

    <label>Código del País: <br>
      <input type="text" bind:value={searchCode} style="width: 90%"/>
    </label>
    
    <label>Desde el año: <br>
      <input type="number" min="0" bind:value={searchFrom} style="width: 90%"/>
    </label>
    
    <label>Hasta el año: <br>
      <input type="number" min="0" bind:value={searchTo} style="width: 90%"/>
    </label>

    <label> Frambesia: <br>
      <input type="number" min="0" bind:value={searchYaws} style="width: 90%"/>
    </label>

    <label> Polio: <br>
      <input type="number" min="0" bind:value={searchPolio} style="width: 90%"/>
    </label>

    <label>Gusano de Guinea: <br>
      <input type="number" min="0" bind:value={searchGuinea} style="width: 90%"/>
    </label>

    <label>Rabia: <br>
      <input type="number" min="0" bind:value={searchRabies} style="width: 90%"/>
    </label>

    <label>Malaria: <br>
      <input type="number" min="0" bind:value={searchMalaria} style="width: 90%"/>
    </label>

    <label>VIH/SIDA: <br>
      <input type="number" min="0" bind:value={searchHiv} style="width: 90%"/>
    </label>

    <label>Tuberculosis: <br>
      <input type="number" min="0" bind:value={searchTuberculosis} style="width: 90%"/>
    </label>

    <label>Viruela: <br>
      <input type="number" min="0" bind:value={searchSmallpox} style="width: 90%"/>
    </label>

    <label>Cólera: <br>
      <input type="number" min="0" bind:value={searchCholera} style="width: 90%"/>
    </label>
  </div>

  <div style="margin-top: 15px; display: flex; gap: 10px;">
    <button onclick={loadPandemics}>
      Buscar dato
    </button>
    <button onclick={clearFilters}>
      Limpiar
    </button>
  </div>
</div>

<div>
  <a href="/pandemics/create">
    <button>Añadir nuevo dato</button>
  </a>
</div>

<main>
  {#if statusMsg}
    <p style="color: red; padding: 10px;">
      {statusMsg}
    </p>
  {/if}

  {#if pandemics.length === 0}
    <p>No hay datos disponibles.</p>
    {#if page === 0}
      <button onclick={() => loadInitialData()}>Cargar datos iniciales</button>
    {/if}
  {:else}
    <table>
      <thead>
        <tr>
          <th>País</th><th>Código</th><th>Año</th>
          <th>Frambesia</th><th>Polio</th><th>Gusano de Guinea</th><th>Rabia</th>
          <th>Malaria</th><th>VIH/SIDA</th><th>Tuberculosis</th><th>Viruela</th><th>Cólera</th>
        </tr>
      </thead>
      <tbody>
        {#each pandemics as resource (resource.entity + resource.year)}
          <tr>
            <td>{resource.entity}</td>
            <td>{resource.code}</td>
            <td>{resource.year}</td>
            <td>{resource.yaws}</td>
            <td>{resource.polio}</td>
            <td>{resource.guinea_worm}</td>
            <td>{resource.rabies}</td>
            <td>{resource.malaria}</td>
            <td>{resource.hiv_aids}</td>
            <td>{resource.tuberculosis}</td>
            <td>{resource.smallpox}</td>
            <td>{resource.cholera}</td>
            <td><button onclick={() => deleteResource(resource.entity, resource.year)}>Eliminar</button></td>
            <td><a href={`/pandemics/${encodeURIComponent(resource.entity)}/${resource.year}`}>Editar</a></td>
          </tr>
        {/each}
      </tbody>
    </table>
    
    <div>
      <button onclick={() => page = Math.max(0, page - 1)} disabled={page === 0}>Anterior</button>
      <span>Página: {page + 1}</span>
      <button onclick={() => page = page + 1} disabled={pandemics.length < 10}>Siguiente</button>
    </div>

    <div>
      <button onclick={() => deleteData()}>Eliminar todos los datos</button>
    </div>
  {/if}
</main>