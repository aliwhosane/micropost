import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ScriptWizard } from '../ScriptWizard'
import * as shortsActions from '@/app/actions/shorts'

// Mock the server actions
vi.mock('@/app/actions/shorts', () => ({
    createScriptAction: vi.fn(),
    renderStoryboardAction: vi.fn(),
    generateAudioAction: vi.fn(),
}))

// Mock Remotion Player to avoid rendering issues in JSDOM
vi.mock('@remotion/player', () => ({
    Player: () => <div data-testid="remotion-player">Remotion Player</div>,
}))

describe('ScriptWizard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render the initial input step', () => {
        render(<ScriptWizard />)

        expect(screen.getByText('ShortsMaker')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Example: 3 tips/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Generate Script/i })).toBeDisabled()
    })

    it('should enable button when input is provided', () => {
        render(<ScriptWizard />)

        const input = screen.getByPlaceholderText(/Example: 3 tips/i)
        fireEvent.change(input, { target: { value: 'Test video topic' } })

        expect(screen.getByRole('button', { name: /Generate Script/i })).toBeEnabled()
    })

    it('should call createScriptAction and move to SCRIPT step on success', async () => {
        const mockScript = {
            scenes: [
                { type: 'INTRO', text: 'Scene 1', visualCue: 'Cue 1' },
            ],
        }

        vi.mocked(shortsActions.createScriptAction).mockResolvedValueOnce({
            success: true,
            script: mockScript,
        })

        render(<ScriptWizard />)

        // Type input
        const input = screen.getByPlaceholderText(/Example: 3 tips/i)
        fireEvent.change(input, { target: { value: 'Test video topic' } })

        // Click generate
        const button = screen.getByRole('button', { name: /Generate Script/i })
        fireEvent.click(button)

        // Should show loading state (optional to check if fast enough, but we check final state)
        // expect(screen.getByTestId('loader')).toBeInTheDocument() 

        // Wait for the next step content
        await waitFor(() => {
            expect(screen.getByText('Review Script')).toBeInTheDocument()
        })

        expect(shortsActions.createScriptAction).toHaveBeenCalledWith('Test video topic')
        expect(screen.getByDisplayValue('Scene 1')).toBeInTheDocument()
    })
})
