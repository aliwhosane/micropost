import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GenerationWizard } from '../GenerationWizard'
import { triggerManualGeneration } from '@/lib/actions'

vi.mock('@/lib/actions', () => ({
    triggerManualGeneration: vi.fn(),
}))

// Mock ResizeObserver for Radix Dialog/Select
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

describe('GenerationWizard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('opens dialog on click', () => {
        render(<GenerationWizard />)
        const trigger = screen.getByText(/Generate New Posts/)
        fireEvent.click(trigger)
        expect(screen.getByText('Generate Content')).toBeInTheDocument()
    })

    it('submits manual generation request', async () => {
        render(<GenerationWizard />)
        fireEvent.click(screen.getByText(/Generate New Posts/))

        // Input thoughts
        const textarea = screen.getByPlaceholderText(/E.g. 'I just read an article/)
        fireEvent.change(textarea, { target: { value: 'Test Thoughts' } })

        // Click Generate
        const generateBtn = screen.getByText(/Generate Now/)
        fireEvent.click(generateBtn)

        expect(triggerManualGeneration).toHaveBeenCalled()
    })
})
