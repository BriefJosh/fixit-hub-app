import { describe, it, expect } from 'vitest'
import { lookupApplianceSpec } from './applianceSpecs'

describe('lookupApplianceSpec', () => {
  it('returns an exact match when category, brand, and model all match', () => {
    const result = lookupApplianceSpec('AC & HVAC', 'Daikin', 'FTV25AXV14')
    expect(result?.specsSource).toBe('exact')
    expect(result?.spec.brand).toBe('Daikin')
    expect(result?.spec.weightKg).toBe(8.5)
  })

  it('falls back to category-typical when the model is unrecognized', () => {
    const result = lookupApplianceSpec('AC & HVAC', 'Daikin', 'UnknownModel123')
    expect(result?.specsSource).toBe('category-typical')
    expect(result?.spec.isTypical).toBe(true)
    expect(result?.spec.category).toBe('AC & HVAC')
  })

  it('falls back to category-typical when brand and model are omitted', () => {
    const result = lookupApplianceSpec('Refrigerator')
    expect(result?.specsSource).toBe('category-typical')
    expect(result?.spec.category).toBe('Refrigerator')
  })

  it('matches categories case-insensitively', () => {
    const result = lookupApplianceSpec('refrigerator')
    expect(result?.spec.category).toBe('Refrigerator')
  })

  it('returns null for a category with no data at all', () => {
    const result = lookupApplianceSpec('Dishwasher')
    expect(result).toBeNull()
  })
})
