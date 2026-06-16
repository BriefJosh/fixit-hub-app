import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('renders the Fix-It Hub logo image', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('img', { name: 'Fix-It Hub' })).toBeInTheDocument()
  })

  it('routes "AI Diagnostics" to /ai-diagnose', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'AI Diagnostics' })).toHaveAttribute('href', '/ai-diagnose')
  })

  it('routes "Log in" and "Sign up" to /dashboard', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/dashboard')
  })

  it('links "Services", "How it works", and "Trust" to landing-page anchors', () => {
    render(<NavBar />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/#services')
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/#how')
    expect(screen.getByRole('link', { name: 'Trust' })).toHaveAttribute('href', '/#trust')
  })
})
