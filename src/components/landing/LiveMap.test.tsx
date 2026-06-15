import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LiveMap from './LiveMap'

describe('LiveMap', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a Leaflet map with seeded job markers', () => {
    const { container } = render(<LiveMap />)

    expect(container.querySelector('.leaflet-container')).toBeInTheDocument()
    expect(container.querySelectorAll('.jobdot')).toHaveLength(22)
  })

  it('shows the preview badge and status legend', () => {
    render(<LiveMap />)

    expect(screen.getByText(/Preview map/i)).toBeInTheDocument()
    expect(screen.getByText('Live now')).toBeInTheDocument()
    expect(screen.getByText('Just completed')).toBeInTheDocument()
  })
})
