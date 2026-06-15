import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { appliances } from '../../data/appliances'
import MaintenanceLog from './MaintenanceLog'

describe('MaintenanceLog', () => {
  it('lists every appliance with its health percentage', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    for (const appliance of appliances) {
      expect(screen.getByText(appliance.name)).toBeInTheDocument()
      expect(screen.getByText(`${appliance.healthPercent}%`)).toBeInTheDocument()
    }
  })

  it('flags the appliance that needs attention', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    expect(screen.getByText('Needs attention')).toBeInTheDocument()
  })

  it('routes "See your home health" to /dashboard', () => {
    render(<MaintenanceLog />, { wrapper: MemoryRouter })
    expect(screen.getByRole('link', { name: /See your home health/ })).toHaveAttribute('href', '/dashboard')
  })
})
