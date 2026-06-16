import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { technicians } from '../../data/technicians'
import RecommendedTechnicians from './RecommendedTechnicians'

describe('RecommendedTechnicians', () => {
  it('renders a card for the top 3 technicians with a Book action', () => {
    render(<RecommendedTechnicians />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Top-rated technicians near you' })).toBeInTheDocument()

    const featured = technicians.slice(0, 3)
    const bookLinks = screen.getAllByRole('link', { name: `Book` })
    expect(bookLinks).toHaveLength(3)

    for (const tech of featured) {
      expect(screen.getByText(tech.name)).toBeInTheDocument()
    }

    // Verify links point to the correct booking pages
    expect(bookLinks[0]).toHaveAttribute('href', '/book/ac-hvac')
    expect(bookLinks[1]).toHaveAttribute('href', '/book/refrigerator')
    expect(bookLinks[2]).toHaveAttribute('href', '/book/washing-machine')
  })

  it('does not render technicians beyond the top 3', () => {
    render(<RecommendedTechnicians />, { wrapper: MemoryRouter })

    const remaining = technicians.slice(3)
    for (const tech of remaining) {
      expect(screen.queryByText(tech.name)).not.toBeInTheDocument()
    }
  })

  it('has an id of "technicians" for in-page navigation', () => {
    render(<RecommendedTechnicians />, { wrapper: MemoryRouter })

    expect(document.getElementById('technicians')).toBeInTheDocument()
  })
})
