import { describe, expect, it } from 'vitest'
import { getService, services } from './services'

describe('services', () => {
  it('lists a definition for every category', () => {
    const ids = services.map((s) => s.id)
    expect(ids).toContain('ac-hvac')
    expect(ids).toContain('refrigerator')
    expect(ids).toContain('washing-machine')
    expect(ids).toContain('television')
    expect(ids).toContain('oven')
    expect(ids).toContain('water-heater')
  })

  it('gives every service a name, positive basePrice, and at least 3 problems', () => {
    for (const service of services) {
      expect(service.name.length).toBeGreaterThan(0)
      expect(service.basePrice).toBeGreaterThan(0)
      expect(service.problems.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('getService returns the correct definition for a known id', () => {
    const result = getService('ac-hvac')
    expect(result).toBeDefined()
    expect(result?.name).toBe('AC & HVAC')
    expect(result?.basePrice).toBe(150000)
  })

  it('getService returns undefined for an unknown id', () => {
    expect(getService('unknown-id')).toBeUndefined()
  })
})
