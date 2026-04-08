import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function DeathsDetail() {
  const { entity, year } = useParams()
  const navigate = useNavigate()
  const API = '/api/v2/deaths-by-risk-factors'
  const [responseStatusCode, setResponseStatusCode] = useState(0)

  const [resource, setResource] = useState(null)
  const [newHighSystolicBloodPressure, setNewHighSystolicBloodPressure] = useState(0)
  const [newAirPollution, setNewAirPollution] = useState(0)
  const [newChildWasting, setNewChildWasting] = useState(0)
  const [newHouseholdAirPollutionFromSolidFuels, setNewHouseholdAirPollutionFromSolidFuels] = useState(0)
  const [newHighFastingPlasmaGlucose, setNewHighFastingPlasmaGlucose] = useState(0)

  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  async function getResource() {
    try {
      const response = await fetch(`${API}/${encodeURIComponent(entity)}/${year}`, {
        method: 'GET'
      })
      setResponseStatusCode(response.status)
      if (response.ok) {
        const data = await response.json()
        setResource(data)
        setNewHighSystolicBloodPressure(data.high_systolic_blood_pressure)
        setNewAirPollution(data.air_pollution)
        setNewChildWasting(data.child_wasting)
        setNewHouseholdAirPollutionFromSolidFuels(data.household_air_pollution_from_solid_fuels)
        setNewHighFastingPlasmaGlucose(data.high_fasting_plasma_glucose)
      } else {
        console.error('Failed to fetch resource:', response.status)
      }
    } catch (error) {
      console.error('Error fetching resource:', error)
    }
  }

  async function deleteResource() {
    if (!confirm(`¿Estás seguro de que deseas eliminar el recurso: ${entity} (${year})?`)) {
      return
    }
    try {
      const response = await fetch(`${API}/${encodeURIComponent(entity)}/${year}`, {
        method: 'DELETE'
      })
      setResponseStatusCode(response.status)
      if (response.ok) {
        console.log(`Deleted resource: ${entity} (${year})`)
        setErrorMessage('')
        setInfoMessage(`Eliminado el recurso: ${entity} (${year})`)
        setTimeout(() => {
          navigate('/deaths-by-risk-factors')
        }, 2000)
      } else {
        console.error('Failed to delete resource:', response.status)
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  async function updateResource() {
    try {
      const response = await fetch(`${API}/${encodeURIComponent(entity)}/${year}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entity: entity,
          year: year,
          high_systolic_blood_pressure: newHighSystolicBloodPressure,
          air_pollution: newAirPollution,
          child_wasting: newChildWasting,
          household_air_pollution_from_solid_fuels: newHouseholdAirPollutionFromSolidFuels,
          high_fasting_plasma_glucose: newHighFastingPlasmaGlucose
        })
      })
      setResponseStatusCode(response.status)
      if (response.ok) {
        console.log(`Updated resource: ${entity} (${year})`)
        setErrorMessage('')
        setInfoMessage(`Actualizado el recurso: ${entity} (${year})`)
        setTimeout(() => {
          navigate('/deaths-by-risk-factors')
        }, 2000)
      } else {
        console.error('Failed to update resource:', response.status)
        const text = await response.text()
        if (text === "Bad request: Factors cannot be negative") {
          setErrorMessage("Todos los campos deben de ser positivos")
        } else {
          setErrorMessage("Debe rellenar todos los parametros")
        }
      }
    } catch (error) {
      console.error('Error updating resource:', error)
    }
  }

  useEffect(() => {
    getResource()
  }, [entity, year])

  return (
    <>
      {infoMessage ? (
        <p>{infoMessage}</p>
      ) : errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : null}

      <h3>Detalles para {entity} ({year})</h3>

      {resource ? (
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{entity}</td>
                <td>{year}</td>
                <td>
                  <input
                    type="number"
                    value={newHighSystolicBloodPressure}
                    onChange={(e) => setNewHighSystolicBloodPressure(parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newAirPollution}
                    onChange={(e) => setNewAirPollution(parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newChildWasting}
                    onChange={(e) => setNewChildWasting(parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newHouseholdAirPollutionFromSolidFuels}
                    onChange={(e) => setNewHouseholdAirPollutionFromSolidFuels(parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newHighFastingPlasmaGlucose}
                    onChange={(e) => setNewHighFastingPlasmaGlucose(parseFloat(e.target.value))}
                    min="0"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button onClick={deleteResource}>Eliminar recurso</button>
          <button onClick={updateResource}>Actualizar recurso</button>
        </>
      ) : responseStatusCode === 404 ? (
        <p>No se encontró el recurso para {entity} ({year}). Código de respuesta: {responseStatusCode}</p>
      ) : (
        <p>Cargando detalles para {entity} ({year})...</p>
      )}
    </>
  )
}

export default DeathsDetail