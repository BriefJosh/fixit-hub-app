import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ScanningStep from './ScanningStep'

describe('ScanningStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the provided image', () => {
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={vi.fn()} />)

    expect(screen.getByAltText('Appliance being analyzed')).toHaveAttribute('src', 'blob:mock-url')
  })

  it('calls onComplete after the scan duration', () => {
    const onComplete = vi.fn()
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cycles through scanning status messages', () => {
    render(<ScanningStep imagePreviewUrl="blob:mock-url" onComplete={vi.fn()} />)

    expect(screen.getByText('Detecting appliance category...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(screen.getByText('Checking brand markings...')).toBeInTheDocument()
  })
})
