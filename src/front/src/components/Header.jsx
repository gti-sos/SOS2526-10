import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <title>SOS2526-10 API</title>
      <h1>SOS2526-10</h1>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/deaths-by-risk-factors">Muertes por Factores de Riesgo</Link>
        <Link to="/protests">Protestas</Link>
        <Link to="/pandemics">Pandemias</Link>
        <Link to="/child-malnutritions">Malnutrición Infantil</Link>
        <a href="https://github.com/gti-sos/SOS2526-10" target="_blank" rel="noopener noreferrer">GitHub del proyecto</a>
      </nav>
    </header>
  )
}

export default Header