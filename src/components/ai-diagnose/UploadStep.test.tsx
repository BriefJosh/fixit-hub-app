import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import UploadStep from './UploadStep'

function createImageFile(name = 'appliance.png') {
  return new File(['fake-image-content'], name, { type: 'image/png' })
}

describe('UploadStep', () => {
  it('renders the upload prompt with a disabled Analyze button', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)

    expect(screen.getByText(/drag and drop a photo here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled()
  })

  it('enables Analyze and shows a preview after selecting a file', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)
    const input = screen.getByLabelText(/upload appliance photo/i)

    fireEvent.change(input, { target: { files: [createImageFile()] } })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeEnabled()
    expect(screen.getByAltText('Selected appliance')).toBeInTheDocument()
  })

  it('accepts a dropped file', () => {
    render(<UploadStep onAnalyze={vi.fn()} />)
    const dropzone = screen.getByText(/drag and drop a photo here/i).closest('div')!

    fireEvent.drop(dropzone, { dataTransfer: { files: [createImageFile('dropped.png')] } })

    expect(screen.getByRole('button', { name: /analyze/i })).toBeEnabled()
  })

  it('calls onAnalyze with the selected file and description', () => {
    const onAnalyze = vi.fn()
    render(<UploadStep onAnalyze={onAnalyze} />)
    const file = createImageFile()

    fireEvent.change(screen.getByLabelText(/upload appliance photo/i), { target: { files: [file] } })
    fireEvent.change(screen.getByLabelText(/describe the issue/i), { target: { value: 'Making a loud noise' } })
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }))

    expect(onAnalyze).toHaveBeenCalledWith(file, 'Making a loud noise')
  })
})
