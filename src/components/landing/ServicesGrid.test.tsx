import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { categories } from '../../data/categories'
import ServicesGrid from './ServicesGrid'

describe('ServicesGrid', () => {
  it('renders a heading for every category', () => {
    render(<ServicesGrid />)
    for (const category of categories) {
      expect(screen.getByRole('heading', { name: category.name })).toBeInTheDocument()
    }
  })

  it('renders the featured "more categories" badge on the last card', () => {
    render(<ServicesGrid />)
    expect(screen.getByText('+ 8 more categories →')).toBeInTheDocument()
  })
})
