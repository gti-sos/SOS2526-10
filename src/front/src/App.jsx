import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './routes/+layout'
import Home from './routes/+page'
import DeathsList from './routes/deaths-by-risk-factors/+page'
import DeathsCreate from './routes/deaths-by-risk-factors/create/+page'
import DeathsDetail from './routes/deaths-by-risk-factors/[entity]/[year]/+page'
import ProtestsList from './routes/protests/+page'
import ProtestsCreate from './routes/protests/create/+page'
import ProtestsDetail from './routes/protests/[id]/+page'
import PandemicsList from './routes/pandemics/+page'
import PandemicsCreate from './routes/pandemics/create/+page'
import PandemicsDetail from './routes/pandemics/[entity]/[year]/+page'
import MalnutritionsList from './routes/child-malnutritions/+page'
import MalnutritionsCreate from './routes/child-malnutritions/create/+page'
import MalnutritionsDetail from './routes/child-malnutritions/[country]/[year]/+page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="deaths-by-risk-factors" element={<DeathsList />} />
          <Route path="deaths-by-risk-factors/create" element={<DeathsCreate />} />
          <Route path="deaths-by-risk-factors/:entity/:year" element={<DeathsDetail />} />
          <Route path="protests" element={<ProtestsList />} />
          <Route path="protests/create" element={<ProtestsCreate />} />
          <Route path="protests/:id" element={<ProtestsDetail />} />
          <Route path="pandemics" element={<PandemicsList />} />
          <Route path="pandemics/create" element={<PandemicsCreate />} />
          <Route path="pandemics/:entity/:year" element={<PandemicsDetail />} />
          <Route path="child-malnutritions" element={<MalnutritionsList />} />
          <Route path="child-malnutritions/create" element={<MalnutritionsCreate />} />
          <Route path="child-malnutritions/:country/:year" element={<MalnutritionsDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App