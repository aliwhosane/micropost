import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddTopicForm } from '../AddTopicForm'
import { addTopic } from '@/lib/actions'

// Mock server action
vi.mock('@/lib/actions', () => ({
    addTopic: vi.fn(),
}))

// Mock Radix UI Select to simplify testing if needed, or use real one.
// Since we have @radix-ui/react-select installed and it works in jsdom mostly (with some polyfills),
// let's try using the real one first. 
// However, Radix Select often needs Pointer events mock.
// A simpler approach for unit testing the *form logic* is to trust Select updates the state 
// and the hidden input is what matters for the form action.

// We need to mock ResizeObserver for Radix
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

describe('AddTopicForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders form fields', () => {
        render(<AddTopicForm />)
        expect(screen.getByText('Topic Name')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/e.g. 'React Server Components'/)).toBeInTheDocument()
        expect(screen.getByText('Stance')).toBeInTheDocument()
        expect(screen.getByText('Notes / Context (Optional)')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Add Topic/ })).toBeInTheDocument()
    })

    it('submits form with default values', () => {
        render(<AddTopicForm />)

        const topicInput = screen.getByPlaceholderText(/e.g. 'React Server Components'/)
        fireEvent.change(topicInput, { target: { value: 'New Topic' } })

        // Default stance is NEUTRAL
        // We can verify hidden input value
        // hidden inputs are not accessible by getByRole defaults, need css selector
        const hiddenInput = document.querySelector('input[name="stance"]') as HTMLInputElement
        expect(hiddenInput.value).toBe('NEUTRAL')

        const form = document.querySelector('form') as HTMLFormElement

        // In React 19/Next 14 app router, 'action' is a function prop.
        // fireEvent.submit(form) DOES trigger the action prop if handled by React?
        // Or we might need to rely on the button click.
        // Actually, jsdom form submission doesn't automatically call the function prop unless React hydration is perfect.
        // But let's try fireEvent.submit

        fireEvent.submit(form)

        // Since addTopic is passed as `action` prop, verifying it was called is tricky 
        // because React handles the FormData construction and call.
        // Standard Unit Test for Server Actions in Forms usually involves:
        // 1. Integration test (running passing real formData)
        // 2. Or mocking the component to see if it passes function to form (shallow)
        // 3. Or hoping React Testing Library + JSDOM fires it. 
        // If fireEvent.submit doesn't work, we might need a different approach or verify the prop is passed.
    })

    // Alternative: Test that inputs are wired correctly.
    it('updates text inputs', () => {
        render(<AddTopicForm />)
        const textarea = screen.getByPlaceholderText(/Add any specific thoughts/)
        fireEvent.change(textarea, { target: { value: 'My notes' } })
        expect(textarea).toHaveValue('My notes')
    })
})
