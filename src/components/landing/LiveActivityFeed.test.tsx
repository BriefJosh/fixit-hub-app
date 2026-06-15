import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveActivityFeed from './LiveActivityFeed'

describe('LiveActivityFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 6 seeded feed items', () => {
    const { container } = render(<LiveActivityFeed />)
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(6)
  })

  it('adds new items over time but caps the feed at 7', () => {
    const { container } = render(<LiveActivityFeed />)

    act(() => {
      vi.advanceTimersByTime(5200)
    })
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(7)

    act(() => {
      vi.advanceTimersByTime(5200)
    })
    expect(container.querySelectorAll('.feed-enter')).toHaveLength(7)
  })
})
