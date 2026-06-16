import { describe, it, expect } from 'vitest'
import { matchTechnicians } from './technicianMatch'
import type { Technician } from '../data/technicians'

const baseTech = (overrides: Partial<Technician>): Technician => ({
  id: 'id',
  name: 'name',
  avatarSeed: 'XX',
  avatarColor: 'bg-brand',
  rating: 4.5,
  reviewCount: 10,
  specialties: [],
  area: 'Surabaya',
  verified: true,
  completedJobs: 10,
  yearsExperience: 1,
  badges: [],
  priceFrom: 'Rp 100.000',
  serviceId: 'ac-hvac',
  ...overrides,
})

const techs: Technician[] = [
  baseTech({ id: 't1', specialties: ['AC & HVAC', 'Daikin'], rating: 4.9 }),
  baseTech({ id: 't2', specialties: ['Refrigerator', 'Samsung'], rating: 4.8 }),
  baseTech({ id: 't3', specialties: ['Washing Machine', 'LG'], rating: 4.9 }),
]

describe('matchTechnicians', () => {
  it('ranks a technician matching both category and brand first', () => {
    const result = matchTechnicians('AC & HVAC', 'Daikin', techs, 3)
    expect(result[0].id).toBe('t1')
  })

  it('ranks a category-only match above unrelated technicians', () => {
    const result = matchTechnicians('Refrigerator', 'LG', techs, 3)
    expect(result[0].id).toBe('t2')
  })

  it('respects the limit', () => {
    const result = matchTechnicians('AC & HVAC', 'Daikin', techs, 2)
    expect(result).toHaveLength(2)
  })

  it('fills remaining slots with top-rated technicians when fewer than limit match', () => {
    const result = matchTechnicians('Television', 'Sony', techs, 3)
    expect(result.map((t) => t.id)).toEqual(['t1', 't3', 't2'])
  })
})
