import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders all major sections', () => {
    render(<Dashboard />, { wrapper: MemoryRouter })

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Good morning, Budi/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our services' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My appliances' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Upcoming' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Auto-diagnose via camera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Top-rated technicians near you' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
