import '@testing-library/jest-dom/vitest'

URL.createObjectURL = vi.fn(() => 'blob:mock-url')
URL.revokeObjectURL = vi.fn()

// jsdom does not implement scrollIntoView — stub it globally
window.HTMLElement.prototype.scrollIntoView = vi.fn()
