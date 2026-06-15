import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LiveSection from './LiveSection'

describe('LiveSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the live badge, headline, stats, map, and feed', () => {
    render(<LiveSection />)

    expect(screen.getByText(/Live · updating in real time/i)).toBeInTheDocument()
    expect(screen.getByText(/pros working/i)).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
    expect(screen.getByText('repairs this week')).toBeInTheDocument()
    expect(screen.getByText(/Preview map/i)).toBeInTheDocument()
  })

  it('jitters the pro count after an interval tick', () => {
    render(<LiveSection />)
    expect(screen.getByText('47')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5200)
    })

    expect(screen.getByText(/^(46|48)$/)).toBeInTheDocument()
  })
})
