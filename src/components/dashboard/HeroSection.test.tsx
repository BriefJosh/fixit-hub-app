import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HeroSection from './HeroSection'

describe('HeroSection', () => {
  it('renders the greeting and home health summary', () => {
    render(<HeroSection />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: /Good morning, Budi/ })).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('1 appliance needs attention')).toBeInTheDocument()
  })

  it('links "Diagnose with AI" to /ai-diagnose and "Book a technician" to the technicians section', () => {
    render(<HeroSection />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link', { name: /Diagnose with AI/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Book a technician/ })).toHaveAttribute('href', '#technicians')
  })
})
