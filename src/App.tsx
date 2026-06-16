import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AIDiagnose from './pages/AIDiagnose'
import Booking from './pages/Booking'
import BookingConfirmed from './pages/BookingConfirmed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-diagnose" element={<AIDiagnose />} />
        <Route path="/book/:serviceId" element={<Booking />} />
        <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
