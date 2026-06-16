import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { categories } from '../../data/categories'
import QuickCategories from './QuickCategories'

describe('QuickCategories', () => {
  it('renders a card for every service category', () => {
    render(<QuickCategories />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Our services' })).toBeInTheDocument()
    for (const category of categories) {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    }
  })
})
