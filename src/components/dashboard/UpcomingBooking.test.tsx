import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { bookings } from '../../data/bookings'
import UpcomingBooking from './UpcomingBooking'

describe('UpcomingBooking', () => {
  it('renders the technician, date, and price for the first booking', () => {
    render(<UpcomingBooking />)

    const booking = bookings[0]
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument()
    expect(screen.getByText(booking.technician)).toBeInTheDocument()
    expect(screen.getByText(booking.date)).toBeInTheDocument()
    expect(screen.getByText(booking.price)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Track' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Message' })).toBeInTheDocument()
  })
})
