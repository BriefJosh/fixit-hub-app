import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import CTA from './CTA'

describe('CTA', () => {
  it('renders the poster headline', () => {
    render(<CTA />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { name: /Stop guessing/ })).toBeInTheDocument()
  })

  it('routes both buttons to /dashboard', () => {
    render(<CTA />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Book a repair' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Become a technician' })).toHaveAttribute('href', '/dashboard')
  })
})
