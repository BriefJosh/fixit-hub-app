import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ResultStep from './ResultStep'
import { DEMO_SEEDS, getDemoDiagnosis } from '../../lib/aiDiagnose'

describe('ResultStep', () => {
  it('renders identification, specs, AI note, demo badge, and technicians for a high-confidence result', () => {
    const result = getDemoDiagnosis(undefined, 0)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: result.category })).toBeInTheDocument()
    expect(screen.getByText(`${result.brand} ${result.model}`)).toBeInTheDocument()
    expect(screen.getByText('Demo mode')).toBeInTheDocument()
    expect(screen.getByText(`${Math.round(result.confidence * 100)}% confident`)).toBeInTheDocument()
    expect(screen.getByText(result.technicianNotes)).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /book/i })).toHaveLength(result.recommendedTechnicians.length)
  })

  it('shows best-guess framing and category-typical specs for a low-confidence result', () => {
    const lowConfidenceIndex = DEMO_SEEDS.findIndex((seed) => seed.confidence < 0.5)
    const result = getDemoDiagnosis(undefined, lowConfidenceIndex)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    expect(screen.getByText(/best guess/i)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`typical for ${result.category}`, 'i'))).toBeInTheDocument()
  })

  it('calls onReset when "Try another photo" is clicked', () => {
    const result = getDemoDiagnosis(undefined, 0)
    const onReset = vi.fn()
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={onReset} />, { wrapper: MemoryRouter })

    fireEvent.click(screen.getByRole('button', { name: /try another photo/i }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('routes technician "Book" CTAs to /dashboard', () => {
    const result = getDemoDiagnosis(undefined, 0)
    render(<ResultStep result={result} imagePreviewUrl="blob:mock-url" onReset={vi.fn()} />, { wrapper: MemoryRouter })

    const bookLinks = screen.getAllByRole('link', { name: /book/i })
    bookLinks.forEach((link) => expect(link).toHaveAttribute('href', '/dashboard'))
  })
})
