import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { appliances } from '../../data/appliances'
import MyAppliances from './MyAppliances'

describe('MyAppliances', () => {
  it('renders a row for every appliance with its health percentage', () => {
    render(<MyAppliances />)

    expect(screen.getByRole('heading', { name: 'My appliances' })).toBeInTheDocument()
    for (const appliance of appliances) {
      expect(screen.getByText(appliance.name)).toBeInTheDocument()
    }
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  it('shows a "Book now" link to the technicians section for appliances needing attention', () => {
    render(<MyAppliances />)

    expect(screen.getByRole('link', { name: 'Book now' })).toHaveAttribute('href', '#technicians')
  })
})
