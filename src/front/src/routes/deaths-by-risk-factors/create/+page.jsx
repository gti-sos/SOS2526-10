import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DeathsCreate() {
  const navigate = useNavigate()
  const API = '/api/v2/deaths-by-risk-factors'

  const [entity, setEntity] = useState('')
  const [year, setYear] = useState('')
  const [highSystolicBloodPressure, setHighSystolicBloodPressure] = useState(0)
  const [airPollution, setAirPollution] = useState(0)
  const [childWasting, setChildWasting] = useState(0)
  const [householdAirPollution, setHouseholdAirPollution] = useState(0)
  const [highFastingPlasmaGlucose, setHighFastingPlasmaGlucose] = useState(0)

  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  async function handleAddResource(e) {
    e.preventDefault()
    const newResource = {
      entity,
      year: parseInt(year),
      high_systolic_blood_pressure: highSystolicBloodPressure,
      air_pollution: airPollution,
      child_wasting: childWasting,
      household_air_pollution_from_solid_fuels: householdAirPollution,
      high_fasting_plasma_glucose: highFastingPlasmaGlucose
    }

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      })

      if (res.status === 201) {
        setInfoMessage(`Recurso para ${entity} (${year}) creado con éxito.`)
        setTimeout(() => {
          navigate('/deaths-by-risk-factors')
        }, 2000)
      } else if (res.status === 409) {
        setErrorMessage("Error: El recurso ya existe (Conflicto).")
      } else if (res.status === 400) {
        setErrorMessage("Error: Faltan campos o el formato es incorrecto.")
      } else {
        setErrorMessage("Error inesperado: " + res.status)
      }
    } catch (error) {
      console.error('Error al añadir:', error)
      setErrorMessage("No se pudo conectar con el servidor.")
    }
  }

  return (
    <main>
      {infoMessage ? (
        <p>{infoMessage}</p>
      ) : errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : null}

      <h2>Añadir Nuevo Recurso</h2>

      <form onSubmit={handleAddResource}>
        <label>
          País: <input type="text" value={entity} onChange={(e) => setEntity(e.target.value)} required />
        </label><br />
        <label>
          Año: <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </label><br />
        <label>
          Alta presión arterial: <input type="number" step="any" value={highSystolicBloodPressure} onChange={(e) => setHighSystolicBloodPressure(parseFloat(e.target.value))} min="0" />
        </label><br />
        <label>
          Contaminación del aire: <input type="number" step="any" value={airPollution} onChange={(e) => setAirPollution(parseFloat(e.target.value))} min="0" />
        </label><br />
        <label>
          Desnutrición infantil: <input type="number" step="any" value={childWasting} onChange={(e) => setChildWasting(parseFloat(e.target.value))} min="0" />
        </label><br />
        <label>
          Contaminación combustibles sólidos: <input type="number" step="any" value={householdAirPollution} onChange={(e) => setHouseholdAirPollution(parseFloat(e.target.value))} min="0" />
        </label><br />
        <label>
          Glucosa en sangre: <input type="number" step="any" value={highFastingPlasmaGlucose} onChange={(e) => setHighFastingPlasmaGlucose(parseFloat(e.target.value))} min="0" />
        </label><br />

        <button type="submit">Añadir Recurso</button>
        <button type="button" onClick={() => navigate('/deaths-by-risk-factors')}>Cancelar</button>
      </form>
    </main>
  )
}

export default DeathsCreate