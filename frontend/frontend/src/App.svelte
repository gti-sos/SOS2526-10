<script>
  let data = [];

  let country = "";
  let year = "";
  let region = "";
  let stunting_rate = "";

  const API = "http://localhost:3000/api/v2/child-malnutritions";

  async function loadData() {
    const res = await fetch(API);
    data = await res.json();
  }

  async function addData() {
    const newItem = {
      country,
      year: parseInt(year),
      region,
      stunting_rate: parseFloat(stunting_rate)
    };

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (res.status === 201) {
      alert("Dato añadido correctamente");
      loadData();
    } else if (res.status === 409) {
      alert("El dato ya existe");
    } else {
      alert("Error al añadir");
    }
  }

  async function deleteAll() {
    await fetch(API, { method: "DELETE" });
    loadData();
  }

  async function deleteOne(country, year) {
    await fetch(`${API}/${country}/${year}`, {
      method: "DELETE"
    });
    loadData();
  }

  loadData();
</script>

<style>
  body {
    font-family: Arial;
  }

  h1 {
    color: #333;
  }

  input {
    margin: 5px;
    padding: 6px;
  }

  button {
    margin: 5px;
    padding: 6px 12px;
    cursor: pointer;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .delete {
    background-color: red;
  }

  .delete:hover {
    background-color: darkred;
  }

  .container {
    max-width: 700px;
    margin: auto;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
    margin: 8px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>

<div class="container">
  <h1>Malnutrición Infantil</h1>

  <button on:click={loadData}>Cargar datos</button>
  <button class="delete" on:click={deleteAll}>Borrar todos</button>

  <h2>Añadir dato</h2>

  <input placeholder="País" bind:value={country} />
  <input placeholder="Año" bind:value={year} />
  <input placeholder="Región" bind:value={region} />
  <input placeholder="Stunting rate" bind:value={stunting_rate} />

  <button on:click={addData}>Añadir</button>

  <h2>Lista</h2>

  <ul>
    {#each data as item}
      <li>
        <b>{item.country}</b> ({item.year}) - {item.region} - {item.stunting_rate}
        <button class="delete" on:click={() => deleteOne(item.country, item.year)}>❌</button>
      </li>
    {/each}
  </ul>
</div>