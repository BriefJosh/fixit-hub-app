import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Ticker from './Ticker'

describe('Ticker', () => {
  it('renders two copies of the scrolling category list for a seamless loop', () => {
    render(<Ticker />)
    expect(screen.getAllByText(/AC & HVAC ✦ Refrigerator ✦ Washing Machine/)).toHaveLength(2)
  })
})
