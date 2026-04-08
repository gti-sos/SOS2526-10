import { Link } from 'react-router-dom'
import apis from '../lib/data/apis.js'

function Home() {
  return (
    <main>
      <section>
        {apis.map((api, index) => (
          <article key={index}>
            <h3>{api.nombre}</h3>
            <p>Miembro: {api.miembro}</p>
            <p>Recurso: {api.recurso}</p>
            <p>Frontend: <Link to={api.frontend}>{api.frontend}</Link></p>
            <p>API: <a href={api.api} target="_blank" rel="noopener noreferrer">{api.api}</a></p>
            <p>Docs: <a href={api.docs} target="_blank" rel="noopener noreferrer">{api.docs}</a></p>
            <p>GitHub: <a href={api.github} target="_blank" rel="noopener noreferrer">{api.github}</a></p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Home