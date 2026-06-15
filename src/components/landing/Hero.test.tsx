import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the poster headline', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trusted repair/)
  })

  it('routes "Find a technician" to /dashboard', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Find a technician' })).toHaveAttribute('href', '/dashboard')
  })

  it('routes the AI Diagnostic Engine CTAs to /ai-diagnose', () => {
    render(<Hero />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: /Upload Photo/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Upload Video/ })).toHaveAttribute('href', '/ai-diagnose')
    expect(screen.getByRole('link', { name: /Match me a technician/ })).toHaveAttribute('href', '/ai-diagnose')
  })
})
