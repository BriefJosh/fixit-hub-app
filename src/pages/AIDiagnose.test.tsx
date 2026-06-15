import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AIDiagnose from './AIDiagnose'

function createImageFile(name = 'appliance.png') {
  return new File(['fake-image-content'], name, { type: 'image/png' })
}

describe('AIDiagnose', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the upload step', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })

  it('walks through scanning to a result after selecting a photo and analyzing', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [createImageFile()] } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    expect(screen.getByText(/analyzing photo with ai diagnose/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(screen.getByText('Demo mode')).toBeInTheDocument()
  })

  it('returns to the upload step from "Try another photo"', () => {
    render(<AIDiagnose />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [createImageFile()] } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    fireEvent.click(screen.getByRole('button', { name: /try another photo/i }))

    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })
})
