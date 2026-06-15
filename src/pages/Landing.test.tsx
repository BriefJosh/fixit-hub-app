import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Landing from './Landing'

describe('Landing', () => {
  it('renders all major sections', () => {
    render(<Landing />, { wrapper: MemoryRouter })
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Trusted repair/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Pick your trouble/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Who's really fixing it?" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Book a fix in three steps/ })).toBeInTheDocument()
    expect(screen.getByText('My Appliances')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Stop guessing/ })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
