import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HowItWorks from './HowItWorks'

describe('HowItWorks', () => {
  it('renders the heading and all three steps', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { name: /Book a fix in three steps/ })).toBeInTheDocument()
    expect(screen.getByText('Tell us the problem')).toBeInTheDocument()
    expect(screen.getByText('Pick a technician & slot')).toBeInTheDocument()
    expect(screen.getByText("Relax — it's logged")).toBeInTheDocument()
  })
})
