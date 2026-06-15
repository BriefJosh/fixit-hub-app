import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { technicians } from '../../data/technicians'
import RecommendedTechnicians from './RecommendedTechnicians'

describe('RecommendedTechnicians', () => {
  it('renders a card for the top 3 technicians with a Book action', () => {
    render(<RecommendedTechnicians />)

    expect(screen.getByRole('heading', { name: 'Top-rated technicians near you' })).toBeInTheDocument()

    const featured = technicians.slice(0, 3)
    for (const tech of featured) {
      expect(screen.getByText(tech.name)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `Book ${tech.name}` })).toBeInTheDocument()
    }
  })

  it('does not render technicians beyond the top 3', () => {
    render(<RecommendedTechnicians />)

    const remaining = technicians.slice(3)
    for (const tech of remaining) {
      expect(screen.queryByText(tech.name)).not.toBeInTheDocument()
    }
  })

  it('has an id of "technicians" for in-page navigation', () => {
    render(<RecommendedTechnicians />)

    expect(document.getElementById('technicians')).toBeInTheDocument()
  })
})
