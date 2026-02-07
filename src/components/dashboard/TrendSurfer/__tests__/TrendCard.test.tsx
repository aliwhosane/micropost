import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrendCard } from '../TrendCard'

describe('TrendCard', () => {
    const defaultProps = {
        title: 'AI Revolution',
        source: 'TechCrunch',
        publishedAt: new Date().toISOString(),
        viralScore: 85,
        summary: 'AI is changing everything...',
        onDraft: vi.fn(),
    }

    it('renders trend content', () => {
        render(<TrendCard {...defaultProps} />)
        expect(screen.getByText('AI Revolution')).toBeInTheDocument()
        expect(screen.getByText('TechCrunch • ' + new Date(defaultProps.publishedAt).toLocaleDateString())).toBeInTheDocument()
        expect(screen.getByText('Viral Score: 85/100')).toBeInTheDocument()
    })

    it('applies correct high viral score styles', () => {
        render(<TrendCard {...defaultProps} viralScore={90} />)
        // Check for red text class which indicates high virality
        // We can find the container with "Viral Score" and check class
        const badge = screen.getByText(/Viral Score/).parentElement
        expect(badge).toHaveClass('text-red-500')
    })

    it('applies correct medium viral score styles', () => {
        render(<TrendCard {...defaultProps} viralScore={60} />)
        const badge = screen.getByText(/Viral Score/).parentElement
        expect(badge).toHaveClass('text-orange-500')
    })

    it('triggers onDraft when clicked', () => {
        render(<TrendCard {...defaultProps} />)
        fireEvent.click(screen.getByText('Draft Post'))
        expect(defaultProps.onDraft).toHaveBeenCalled()
    })
})
