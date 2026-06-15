import { describe, expect, it } from 'vitest'
import { DEMO_SEEDS, getDemoDiagnosis } from './aiDiagnose'

describe('getDemoDiagnosis', () => {
  it('returns a full result with exact specs for a high-confidence seed', () => {
    const result = getDemoDiagnosis(undefined, 0)

    expect(result.category).toBe('AC & HVAC')
    expect(result.brand).toBe('Daikin')
    expect(result.model).toBe('FTV25AXV14')
    expect(result.confidence).toBeGreaterThanOrEqual(0.5)
    expect(result.specsSource).toBe('exact')
    expect(result.specs?.weightKg).toBe(8.5)
    expect(result.source).toBe('demo')
    expect(result.recommendedTechnicians.length).toBeGreaterThan(0)
    expect(result.recommendedTechnicians.length).toBeLessThanOrEqual(3)
  })

  it('falls back to category-typical specs with no brand/model for the low-confidence seed', () => {
    const lowConfidenceIndex = DEMO_SEEDS.findIndex((seed) => seed.confidence < 0.5)
    const result = getDemoDiagnosis(undefined, lowConfidenceIndex)

    expect(result.confidence).toBeLessThan(0.5)
    expect(result.brand).toBeUndefined()
    expect(result.specsSource).toBe('category-typical')
    expect(result.specs?.isTypical).toBe(true)
  })

  it('incorporates the user-provided description into the technician note', () => {
    const result = getDemoDiagnosis('making a loud rattling noise', 0)
    expect(result.technicianNotes).toContain('making a loud rattling noise')
  })

  it('omits the symptom clause when no description is given', () => {
    const result = getDemoDiagnosis(undefined, 0)
    expect(result.technicianNotes).not.toContain('symptom')
  })

  it('picks a seed within bounds when no index is given', () => {
    const result = getDemoDiagnosis()
    const categoryNames = DEMO_SEEDS.map((seed) => seed.category)
    expect(categoryNames).toContain(result.category)
  })
})
