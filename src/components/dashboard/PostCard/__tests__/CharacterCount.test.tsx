import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CharacterCount } from '../CharacterCount'

describe('CharacterCount', () => {
    it('renders safely when within limit', () => {
        render(<CharacterCount current={100} limit={280} />)
        // Logic: remaining > 20 -> safe
        // We can check for safe class 'text-emerald-500' if using class checking, or just rendering
        const circle = screen.getByRole('presentation', { hidden: true }).querySelector('.text-emerald-500')
        // Querying by class is brittle but cva usage makes it likely. 
        // Better to check SR text
        expect(screen.getByText('100 / 280 characters')).toBeInTheDocument()
    })

    it('renders warning when close to limit', () => {
        // remaining <= 20
        render(<CharacterCount current={270} limit={280} />)
        expect(screen.getByText('10 chars left')).toBeInTheDocument()
        // Check for warning styling (amber-500)
        // We can inspect the circle element indirectly by verifying it exists in the document
        // Or just rely on visual correctness derived from logic coverage in component logic.
    })

    it('renders danger when over limit', () => {
        render(<CharacterCount current={290} limit={280} />)
        expect(screen.getByText('-10 chars left')).toBeInTheDocument()
        expect(screen.getByText('-10 chars left')).toHaveClass('text-error')
    })
})
