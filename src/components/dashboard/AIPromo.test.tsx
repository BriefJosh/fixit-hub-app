import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AIPromo from './AIPromo'

describe('AIPromo', () => {
  it('links "Start scan" to /ai-diagnose', () => {
    render(<AIPromo />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Auto-diagnose via camera' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Start scan/ })).toHaveAttribute('href', '/ai-diagnose')
  })
})
