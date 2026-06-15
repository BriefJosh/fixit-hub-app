import { LIVE_AREAS, LIVE_CATEGORIES, LIVE_CENTER } from '../data/liveActivity'

export type JobStatus = 'In progress' | 'Completed'

export interface JobMarker {
  id: string
  lat: number
  lng: number
  category: string
  color: string
  area: string
  status: JobStatus
  rating: number
}

export interface FeedItem {
  id: string
  category: string
  color: string
  area: string
  status: JobStatus
  rating: number
  timeLabel: string
}

const COMPLETION_THRESHOLD = 0.8
const COORDINATE_SPREAD = 0.18
const COMPLETED_COLOR = '#FFD21E'

export function pickRandomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function jitterCount(current: number, min: number, max: number): number {
  const next = current + (Math.random() < 0.5 ? -1 : 1)
  return Math.max(min, Math.min(max, next))
}

export function randomRating(): number {
  return Math.round((4.3 + Math.random() * 0.7) * 10) / 10
}

export function isJobCompleted(): boolean {
  return Math.random() > COMPLETION_THRESHOLD
}

export function randomOffset(spread: number): number {
  return (Math.random() - 0.5) * spread
}

export function createJobMarker(id: string): JobMarker {
  const category = pickRandomItem(LIVE_CATEGORIES)
  const completed = isJobCompleted()

  return {
    id,
    lat: LIVE_CENTER[0] + randomOffset(COORDINATE_SPREAD),
    lng: LIVE_CENTER[1] + randomOffset(COORDINATE_SPREAD),
    category: category.name,
    color: completed ? COMPLETED_COLOR : category.color,
    area: pickRandomItem(LIVE_AREAS),
    status: completed ? 'Completed' : 'In progress',
    rating: randomRating(),
  }
}

export function createFeedItem(id: string): FeedItem {
  const category = pickRandomItem(LIVE_CATEGORIES)
  const completed = isJobCompleted()

  return {
    id,
    category: category.name,
    color: category.color,
    area: pickRandomItem(LIVE_AREAS),
    status: completed ? 'Completed' : 'In progress',
    rating: randomRating(),
    timeLabel: 'Just now',
  }
}
