import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookingConfirmed from './BookingConfirmed'

function renderConfirmed() {
  return render(
    <MemoryRouter initialEntries={['/booking-confirmed/001']}>
      <Routes>
        <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('BookingConfirmed', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a Leaflet map container', () => {
    const { container } = renderConfirmed()
    expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
  })

  it('shows the technician name and status', () => {
    renderConfirmed()
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
    expect(screen.getByText(/on the way/i)).toBeInTheDocument()
  })

  it('shows the opening message from the technician', () => {
    renderConfirmed()
    expect(screen.getByText(/I'm on my way/i)).toBeInTheDocument()
  })

  it('allows sending a message and shows an auto-reply', async () => {
    vi.useFakeTimers()
    renderConfirmed()

    const input = screen.getByPlaceholderText(/message budi/i)
    fireEvent.change(input, { target: { value: 'Almost there?' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByText('Almost there?')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/got it|sure, no problem|thanks for letting me know/i)).toBeInTheDocument()
  })

  it('disables the send button when input is empty', () => {
    renderConfirmed()
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })
})
