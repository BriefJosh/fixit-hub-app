import { afterEach, describe, expect, it, vi } from 'vitest'
import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER } from '../data/liveActivity'
import {
  createFeedItem,
  createJobMarker,
  isJobCompleted,
  jitterCount,
  pickRandomItem,
  randomOffset,
  randomRating,
} from './liveSimulation'

describe('liveSimulation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('pickRandomItem', () => {
    it('returns the first item when Math.random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(pickRandomItem(['a', 'b', 'c'])).toBe('a')
    })

    it('returns the last item when Math.random returns just under 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999)
      expect(pickRandomItem(['a', 'b', 'c'])).toBe('c')
    })
  })

  describe('jitterCount', () => {
    it('decreases by 1 when random is below 0.5', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      expect(jitterCount(45, 38, 59)).toBe(44)
    })

    it('increases by 1 when random is 0.5 or above', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      expect(jitterCount(45, 38, 59)).toBe(46)
    })

    it('clamps at the maximum', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8)
      expect(jitterCount(59, 38, 59)).toBe(59)
    })

    it('clamps at the minimum', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2)
      expect(jitterCount(38, 38, 59)).toBe(38)
    })
  })

  describe('randomRating', () => {
    it('returns 4.3 when random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomRating()).toBe(4.3)
    })

    it('returns 5 when random returns just under 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999999)
      expect(randomRating()).toBe(5)
    })
  })

  describe('isJobCompleted', () => {
    it('returns false at or below the completion threshold', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(isJobCompleted()).toBe(false)
    })

    it('returns true above the completion threshold', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.95)
      expect(isJobCompleted()).toBe(true)
    })
  })

  describe('randomOffset', () => {
    it('returns -spread/2 when random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomOffset(0.18)).toBeCloseTo(-0.09, 5)
    })

    it('returns spread/2 when random returns 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(1)
      expect(randomOffset(0.18)).toBeCloseTo(0.09, 5)
    })
  })

  describe('createJobMarker', () => {
    it('returns a marker with a valid shape', () => {
      const marker = createJobMarker('job-1')

      expect(marker.id).toBe('job-1')
      expect(LIVE_CATEGORIES.map((category) => category.name)).toContain(marker.category)
      expect(LIVE_AREAS).toContain(marker.area)
      expect(['In progress', 'Completed']).toContain(marker.status)
      expect(marker.rating).toBeGreaterThanOrEqual(4.3)
      expect(marker.rating).toBeLessThanOrEqual(5)
      expect(marker.lat).toBeGreaterThan(LIVE_CENTER[0] - 0.1)
      expect(marker.lat).toBeLessThan(LIVE_CENTER[0] + 0.1)
      expect(marker.lng).toBeGreaterThan(LIVE_CENTER[1] - 0.1)
      expect(marker.lng).toBeLessThan(LIVE_CENTER[1] + 0.1)
    })

    it('uses the completed color when the job is marked done', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0) // category pick -> first category
        .mockReturnValueOnce(0.95) // isJobCompleted -> true
        .mockReturnValueOnce(0.5) // lat offset
        .mockReturnValueOnce(0.5) // lng offset
        .mockReturnValueOnce(0) // area pick
        .mockReturnValueOnce(0) // rating

      const marker = createJobMarker('job-2')

      expect(marker.status).toBe('Completed')
      expect(marker.color).toBe('#FFD21E')
    })
  })

  describe('createJobMarker land bounds', () => {
    it('always places markers within Surabaya land bounds', () => {
      for (let i = 0; i < 100; i++) {
        const marker = createJobMarker(`bound-test-${i}`)
        expect(marker.lat).toBeGreaterThanOrEqual(-7.35)
        expect(marker.lat).toBeLessThanOrEqual(-7.20)
        expect(marker.lng).toBeGreaterThanOrEqual(112.66)
        expect(marker.lng).toBeLessThanOrEqual(112.79)
      }
    })
  })

  describe('createFeedItem', () => {
    it('returns a feed item with a valid shape', () => {
      const item = createFeedItem('feed-1')

      expect(item.id).toBe('feed-1')
      expect(LIVE_CATEGORIES.map((category) => category.name)).toContain(item.category)
      expect(LIVE_AREAS).toContain(item.area)
      expect(['In progress', 'Completed']).toContain(item.status)
      expect(item.rating).toBeGreaterThanOrEqual(4.3)
      expect(item.rating).toBeLessThanOrEqual(5)
      expect(item.timeLabel).toBe('Just now')
    })
  })
})
