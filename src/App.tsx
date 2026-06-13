import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AIDiagnose from './pages/AIDiagnose'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-diagnose" element={<AIDiagnose />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
