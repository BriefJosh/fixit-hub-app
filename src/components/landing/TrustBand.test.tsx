import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TrustBand from './TrustBand'

describe('TrustBand', () => {
  it('renders all four guarantees', () => {
    render(<TrustBand />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { name: 'Verified network' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fixed pricing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI diagnostics' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Maintenance log' })).toBeInTheDocument()
  })

  it('routes the "AI diagnostics" card to /ai-diagnose', () => {
    render(<TrustBand />, { wrapper: MemoryRouter })
    const heading = screen.getByRole('heading', { name: 'AI diagnostics' })
    expect(heading.closest('a')).toHaveAttribute('href', '/ai-diagnose')
  })
})
