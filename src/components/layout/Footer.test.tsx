import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the Fix-It Hub logo image', () => {
    render(<Footer />)
    expect(screen.getByRole('img', { name: 'Fix-It Hub' })).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Footer />)
    expect(screen.getByText(/trusted, AI-powered appliance repair platform/)).toBeInTheDocument()
  })

  it('renders the services and company link columns', () => {
    render(<Footer />)
    expect(screen.getByText('AC & HVAC')).toBeInTheDocument()
    expect(screen.getByText('For Technicians')).toBeInTheDocument()
  })

  it('renders the copyright line', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Fix-It Hub/)).toBeInTheDocument()
  })
})
