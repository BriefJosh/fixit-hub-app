import { describe, expect, it } from 'vitest'
import { categories } from './categories'

describe('categories', () => {
  it('lists the 6 Phase 1 categories in the canonical order', () => {
    expect(categories.map((category) => category.name)).toEqual([
      'AC & HVAC',
      'Refrigerator',
      'Washing Machine',
      'Television',
      'Oven',
      'Water Heater',
    ])
  })

  it('gives every category an icon, color, description, and starting price', () => {
    for (const category of categories) {
      expect(category.icon).toBeTruthy()
      expect(category.iconColor).toMatch(/^text-/)
      expect(category.description.length).toBeGreaterThan(0)
      expect(category.priceFrom).toMatch(/^Rp \d+k$/)
    }
  })

  it('gives every category a non-empty id in kebab-case', () => {
    for (const category of categories) {
      expect(category.id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })
})
