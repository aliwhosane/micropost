import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActiveTopicsCard } from '../ActiveTopicsCard'
import { updateTopicPreferences } from '@/lib/actions'

// Mock the server action
vi.mock('@/lib/actions', () => ({
    updateTopicPreferences: vi.fn(),
}))

// Mock Next.js Link (optional, but good practice if Link is used)
// We generally don't need to mock Link if we use memory router or just ignore navigation, 
// but since it renders an anchor tag, it should be fine in jsdom. 

describe('ActiveTopicsCard', () => {
    const mockTopics = [
        { id: '1', name: 'AI', notes: 'Focus on ethics', stance: 'NEUTRAL' },
        { id: '2', name: 'Crypto', notes: '', stance: 'ANTI' },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders active topics correctly', () => {
        render(<ActiveTopicsCard activeTopics={mockTopics} />)

        expect(screen.getByText('Active Topics')).toBeInTheDocument()
        expect(screen.getByText('AI')).toBeInTheDocument()
        expect(screen.getByText('Crypto')).toBeInTheDocument()
        expect(screen.getByText('Focus on ethics')).toBeInTheDocument()
        expect(screen.getByText('ANTI')).toBeInTheDocument()
    })

    it('renders empty state when no topics', () => {
        render(<ActiveTopicsCard activeTopics={[]} />)
        expect(screen.getByText('No active topics found.')).toBeInTheDocument()
        expect(screen.getByText(/Create your first topic/)).toBeInTheDocument()
    })

    it('enters edit mode when clicking a topic', () => {
        render(<ActiveTopicsCard activeTopics={mockTopics} />)

        // Click the first topic (AI)
        fireEvent.click(screen.getByText('AI'))

        // Check availability of edit fields
        expect(screen.getByDisplayValue('Focus on ethics')).toBeInTheDocument()
        expect(screen.getByText('Your Stance')).toBeInTheDocument()
        expect(screen.getByText('Save Changes')).toBeInTheDocument()
    })

    it('updates preferences and exits edit mode on save', async () => {
        render(<ActiveTopicsCard activeTopics={mockTopics} />)

        // Enter edit mode for AI
        fireEvent.click(screen.getByText('AI'))

        // Change notes
        const textarea = screen.getByDisplayValue('Focus on ethics')
        fireEvent.change(textarea, { target: { value: 'Updated notes' } })

        // Change stance to PRO (find button with label "Pro" and click it)
        fireEvent.click(screen.getByText('Pro'))

        // Click Save
        fireEvent.click(screen.getByText('Save Changes'))

        // Verify server action called
        expect(updateTopicPreferences).toHaveBeenCalledWith('1', 'Updated notes', 'PRO')

        // Verify exit edit mode (wait for async action to complete)
        await waitFor(() => {
            expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
        })
    })

    it('handles cancellation of edit', () => {
        render(<ActiveTopicsCard activeTopics={mockTopics} />)

        // Enter edit
        fireEvent.click(screen.getByText('AI'))
        expect(screen.getByText('Save Changes')).toBeInTheDocument()

        // Cancel (there is an X button, typically aria-label helps but let's find by class or icon presence?)
        // The component uses lucide-react X icon inside a Button. 
        // We can find the button. Since there are multiple buttons, we need to be specific.
        // It's the one that is NOT "Save Changes".
        // Or better, let's look at the component code again.
        // <Button size="sm" variant="text" onClick={onCancel}> <X /> </Button>
        // We can try to find by role 'button' that contains the icon or is the first button in edit view.

        // Let's use getByRole array
        const buttons = screen.getAllByRole('button')
        // The X button is likely the first one in the edit card (top right)
        fireEvent.click(buttons[0])

        expect(screen.queryByText('Save Changes')).not.toBeInTheDocument()
    })
})
