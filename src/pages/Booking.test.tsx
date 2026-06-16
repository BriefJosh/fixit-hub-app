import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Booking from './Booking'

function renderBooking(serviceId = 'ac-hvac') {
  return render(
    <MemoryRouter initialEntries={[`/book/${serviceId}`]}>
      <Routes>
        <Route path="/book/:serviceId" element={<Booking />} />
        <Route path="/booking-confirmed/001" element={<div>Confirmed</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Booking — Step 1', () => {
  it('renders the service name as the headline', () => {
    renderBooking('ac-hvac')
    expect(screen.getByRole('heading', { name: /AC & HVAC/i })).toBeInTheDocument()
  })

  it('shows "Service not found" for an unknown service id', () => {
    renderBooking('does-not-exist')
    expect(screen.getByText(/service not found/i)).toBeInTheDocument()
  })

  it('renders the problem checklist for the service', () => {
    renderBooking('ac-hvac')
    expect(screen.getByRole('checkbox', { name: 'Not cooling' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Routine service' })).toBeInTheDocument()
  })

  it('shows a price estimate that updates when a problem is checked', () => {
    renderBooking('ac-hvac')
    expect(screen.getByText(/Rp 150\.000/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Not cooling' }))
    expect(screen.getByText(/Rp 175\.000/)).toBeInTheDocument()
  })

  it('advances to step 2 when Next is clicked', () => {
    renderBooking('ac-hvac')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument()
  })
})

describe('Booking — Step 2', () => {
  it('shows the schedule heading after clicking Next', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument()
  })

  it('disables Next until a date and time slot are both selected', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('enables Next after selecting a date and time slot', () => {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Select a non-disabled day button (any day that's not disabled)
    const dayButtons = screen.getAllByRole('button').filter(
      (b) => !b.hasAttribute('disabled') && /^\d+$/.test(b.textContent ?? '')
    )
    fireEvent.click(dayButtons[0])
    fireEvent.click(screen.getByRole('button', { name: /morning/i }))
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })
})

describe('Booking — Step 3', () => {
  function advanceToStep3() {
    renderBooking()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    const dayButtons = screen.getAllByRole('button').filter(
      (b) => !b.hasAttribute('disabled') && /^\d+$/.test(b.textContent ?? '')
    )
    fireEvent.click(dayButtons[0])
    fireEvent.click(screen.getByRole('button', { name: /morning/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
  }

  it('shows the confirm heading and Tower 1 ITS address', () => {
    advanceToStep3()
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument()
    expect(screen.getByText(/Tower 1 ITS/)).toBeInTheDocument()
  })

  it('shows the platform fee in the order summary', () => {
    advanceToStep3()
    expect(screen.getByText('Platform fee')).toBeInTheDocument()
  })

  it('navigates to /booking-confirmed/001 when Confirm Booking is clicked', () => {
    advanceToStep3()
    fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }))
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })
})
