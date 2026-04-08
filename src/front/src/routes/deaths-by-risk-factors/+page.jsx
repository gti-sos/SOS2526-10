import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function DeathsList() {
  const [deathsByRiskFactors, setDeathsByRiskFactors] = useState([])
  const API = '/api/v2/deaths-by-risk-factors'
  const [responseStatusCode, setResponseStatusCode] = useState(0)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [filterMode, setFilterMode] = useState('exact')

  const [searchFilters, setSearchFilters] = useState({
    country: '',
    year: '',
    from: '',
    to: '',
    high_systolic_blood_pressure: '',
    air_pollution: '',
    child_wasting: '',
    household_air_pollution_from_solid_fuels: '',
    high_fasting_plasma_glucose: ''
  })

  async function loadDeathsByRiskFactors() {
    try {
      const params = new URLSearchParams({
        offset: (page * 10).toString(),
        limit: '10',
        ...Object.fromEntries(
          Object.entries(searchFilters).filter(([_, v]) => v !== '' && v !== null)
        )
      })
      const response = await fetch(`${API}?${params.toString()}`, {
        method: 'GET'
      })
      if (response.ok) {
        const data = await response.json()
        setDeathsByRiskFactors(Array.isArray(data) ? data : [data])
      } else if (response.status === 404) {
        setDeathsByRiskFactors([])
        setResponseStatusCode(response.status)
        setMsg('No se han encontrado datos')
      }
    } catch (error) {
      console.error('Error fetching deaths by risk factors:', error)
    }
  }

  async function deleteResource(entity, year) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el recurso: ${entity} (${year})?`)) {
      return
    }
    try {
      const response = await fetch(`${API}/${encodeURIComponent(entity)}/${year}`, {
        method: 'DELETE'
      })
      setResponseStatusCode(response.status)
      setMsg(`Recurso para (${entity}, ${year}) eliminado`)
      if (response.ok) {
        console.log(`Deleted resource: ${entity} (${year})`)
        loadDeathsByRiskFactors()
      } else {
        console.error('Failed to delete resource:', response.status)
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  async function loadInitialData() {
    try {
      setIsLoading(true)
      const response = await fetch(`${API}/loadInitialData`, {
        method: 'GET'
      })
      setResponseStatusCode(response.status)
      setMsg('Conjunto de datos iniciales cargado')
      if (response.ok) {
        console.log('Initial data loaded successfully')
        loadDeathsByRiskFactors()
      } else {
        console.error('Failed to load initial data:', response.status)
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteData() {
    if (!confirm(`¿Estás seguro de que deseas eliminar toda la colección?`)) {
      return
    }
    try {
      const response = await fetch(`${API}`, {
        method: 'DELETE'
      })
      setResponseStatusCode(response.status)
      setMsg('Se han eliminado todos los recursos')
      if (response.ok) {
        console.log('Collection deleted successfully')
        setDeathsByRiskFactors([])
        setPage(0)
      } else {
        console.error('Failed to delete collection:', response.status)
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  function clearSearch() {
    setSearchFilters({
      country: '',
      year: '',
      from: '',
      to: '',
      high_systolic_blood_pressure: '',
      air_pollution: '',
      child_wasting: '',
      household_air_pollution_from_solid_fuels: '',
      high_fasting_plasma_glucose: ''
    })
    setPage(0)
    setFilterMode('exact')
    loadDeathsByRiskFactors()
  }

  useEffect(() => {
    loadDeathsByRiskFactors()
  }, [searchFilters, page])

  useEffect(() => {
    if (responseStatusCode !== 0) {
      const timer = setTimeout(() => {
        setResponseStatusCode(0)
        setMsg('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [responseStatusCode])

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <>
      {responseStatusCode !== 0 && (
        <div>
          {msg}
          <button onClick={() => setResponseStatusCode(0)}>x</button>
        </div>
      )}

      <section>
        <h2>Muertes por Factores de Riesgo</h2>
      </section>

      <section data-testid="filters">
        <h3>Filtros</h3>
        <div className="grid-filters">
          <div className="mode-selector">
            <label>
              <input
                type="radio"
                name="mode"
                value="exact"
                checked={filterMode === 'exact'}
                onChange={() => {
                  setFilterMode('exact')
                  handleFilterChange('from', '')
                  handleFilterChange('to', '')
                }}
              />
              Año exacto
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="range"
                checked={filterMode === 'range'}
                onChange={() => {
                  setFilterMode('range')
                  handleFilterChange('year', '')
                }}
              />
              Rango de años
            </label>
          </div>

          <input
            type="text"
            placeholder="País"
            value={searchFilters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          />

          {filterMode === 'exact' ? (
            <input
              type="number"
              placeholder="Año"
              value={searchFilters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
          ) : (
            <>
              <input
                type="number"
                placeholder="Año Inicio"
                value={searchFilters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
              />
              <input
                type="number"
                placeholder="Año Fin"
                value={searchFilters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
              />
            </>
          )}

          <input
            type="number"
            placeholder="Min. Presión Arterial"
            value={searchFilters.high_systolic_blood_pressure}
            onChange={(e) => handleFilterChange('high_systolic_blood_pressure', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min. Contaminación Aire"
            value={searchFilters.air_pollution}
            onChange={(e) => handleFilterChange('air_pollution', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min. Desnutrición"
            value={searchFilters.child_wasting}
            onChange={(e) => handleFilterChange('child_wasting', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min. Combustibles"
            value={searchFilters.household_air_pollution_from_solid_fuels}
            onChange={(e) => handleFilterChange('household_air_pollution_from_solid_fuels', e.target.value)}
          />
          <input
            type="number"
            placeholder="Min. Glucosa"
            value={searchFilters.high_fasting_plasma_glucose}
            onChange={(e) => handleFilterChange('high_fasting_plasma_glucose', e.target.value)}
          />
        </div>

        <div className="actions">
          <button
            onClick={() => {
              setPage(0)
              loadDeathsByRiskFactors()
            }}
          >
            Buscar
          </button>
          <button className="secondary" onClick={clearSearch}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <div>
        <Link to="/deaths-by-risk-factors/create">
          <button>Añadir nuevo dato</button>
        </Link>
      </div>

      <main>
        {deathsByRiskFactors.length === 0 ? (
          isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <p>No hay datos disponibles.</p>
              {page === 0 && (
                <button onClick={loadInitialData}>Cargar datos iniciales</button>
              )}
            </>
          )
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>País</th>
                  <th>Año</th>
                  <th>Alta presión arterial</th>
                  <th>Contaminación del aire</th>
                  <th>Desnutrición infantil</th>
                  <th>Contaminación de combustibles fósiles</th>
                  <th>Glucosa en sangre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deathsByRiskFactors.map((resource) => (
                  <tr key={resource.entity + resource.year}>
                    <td>{resource.entity}</td>
                    <td>{resource.year}</td>
                    <td>{resource.high_systolic_blood_pressure}</td>
                    <td>{resource.air_pollution}</td>
                    <td>{resource.child_wasting}</td>
                    <td>{resource.household_air_pollution_from_solid_fuels}</td>
                    <td>{resource.high_fasting_plasma_glucose}</td>
                    <td>
                      <button onClick={() => deleteResource(resource.entity, resource.year)}>
                        Eliminar
                      </button>
                    </td>
                    <td>
                      <Link to={`/deaths-by-risk-factors/${encodeURIComponent(resource.entity)}/${resource.year}`}>
                        Detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button onClick={() => setPage(Math.max(0, page - 1))}>-</button>
              <p>Página: {page}</p>
              <button
                onClick={() => setPage(page + 1)}
                disabled={deathsByRiskFactors.length < 10}
              >
                +
              </button>
            </div>
            <div>
              <button onClick={deleteData}>Eliminar la colección</button>
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default DeathsList