import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VisionSelector } from '../VisionSelector'
import { generateVisionAction } from '@/app/actions/image'

// Mock server action
vi.mock('@/app/actions/image', () => ({
    generateVisionAction: vi.fn(),
}))

describe('VisionSelector', () => {
    const defaultProps = {
        postContent: 'Test Content',
        platform: 'TWITTER' as const,
        onImageSelect: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders all generation options', () => {
        render(<VisionSelector {...defaultProps} />)
        expect(screen.getByText('Social Snap')).toBeInTheDocument()
        expect(screen.getByText('Pull Quote')).toBeInTheDocument()
        expect(screen.getByText('Zen Note')).toBeInTheDocument()
        expect(screen.getByText('Visual Hook')).toBeInTheDocument()
    })

    it('triggers generation for Social Snap', async () => {
        // Mock success response
        vi.mocked(generateVisionAction).mockResolvedValue('https://fake-url.com/image.png')

        render(<VisionSelector {...defaultProps} />)

        // Find Snap card's generate area (the big clickable area or specific fallback text)
        // The component has "Generate" text inside each card when no image is there.
        // But there are multiple "Generate" texts.
        // We can find by heading "Social Snap" and click the parent or a simpler approach:
        // Click the first "Generate" text or use test id.
        // The component structure: H3 titles are distinct.

        // Let's modify component slightly to add test ids?
        // Or find by text "Social Snap" and navigate to its clickable container.

        // Simpler: The whole card is clickable via onClick={...} 
        // We can find text "Social Snap" and click slightly below it? 
        // Or finding the generic "Generate" text is hard as there are 4 of them.

        // Strategy: Get all elements with text "Generate", click the first one (Snap is usually first).
        const generateButtons = screen.getAllByText('Generate')
        fireEvent.click(generateButtons[0]) // Snap is first in grid

        expect(generateVisionAction).toHaveBeenCalledWith('SNAP', 'Test Content', 'TWITTER')

        await waitFor(() => {
            expect(defaultProps.onImageSelect).toHaveBeenCalledWith('https://fake-url.com/image.png')
        })
    })

    it('opens Note Editor for Zen Note', () => {
        render(<VisionSelector {...defaultProps} />)

        // Click Zen Note card (3rd option)
        // Or find by text "Zen Note" and traverse.
        const zenNoteTitle = screen.getByText('Zen Note')
        fireEvent.click(zenNoteTitle) // The Card component passes onClick to the generic container

        expect(screen.getByText('Customize Note')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Write your note...')).toBeInTheDocument()
    })

    it('submits custom note', async () => {
        vi.mocked(generateVisionAction).mockResolvedValue('https://fake-url.com/note.png')
        render(<VisionSelector {...defaultProps} />)

        // Open Editor
        fireEvent.click(screen.getByText('Zen Note'))

        // Edit text
        const textarea = screen.getByPlaceholderText('Write your note...')
        fireEvent.change(textarea, { target: { value: 'Custom Note' } })

        // Click Generate Note button
        fireEvent.click(screen.getByText('Generate Note'))

        expect(generateVisionAction).toHaveBeenCalledWith('NOTE', 'Custom Note', 'TWITTER')
    })
})
