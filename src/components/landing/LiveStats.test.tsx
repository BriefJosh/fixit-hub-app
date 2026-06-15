import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LiveStats from './LiveStats'
import { LIVE_STATS } from '../../data/liveActivity'

describe('LiveStats', () => {
  it('renders all stat cards with their values and labels', () => {
    render(<LiveStats />)

    LIVE_STATS.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument()
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })
})
