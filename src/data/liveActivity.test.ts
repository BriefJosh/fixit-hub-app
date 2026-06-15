import { describe, expect, it } from 'vitest'
import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER, LIVE_STATS } from './liveActivity'

describe('liveActivity data', () => {
  it('defines a Surabaya map center', () => {
    expect(LIVE_CENTER).toEqual([-7.2575, 112.7521])
  })

  it('defines 5 service categories with unique colors', () => {
    expect(LIVE_CATEGORIES).toHaveLength(5)
    const colors = new Set(LIVE_CATEGORIES.map((category) => category.color))
    expect(colors.size).toBe(5)
  })

  it('defines 10 neighborhood areas', () => {
    expect(LIVE_AREAS).toHaveLength(10)
  })

  it('defines 4 stat cards', () => {
    expect(LIVE_STATS).toHaveLength(4)
    expect(LIVE_STATS.map((stat) => stat.label)).toEqual([
      'repairs this week',
      'verified pros',
      'avg rating',
      'cities live',
    ])
  })
})
