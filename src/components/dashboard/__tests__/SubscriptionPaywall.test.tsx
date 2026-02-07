import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SubscriptionPaywall } from '../SubscriptionPaywall'

describe('SubscriptionPaywall', () => {
    it('renders upgrade message', () => {
        render(<SubscriptionPaywall />)
        expect(screen.getByText(/Unlock the Full Power/)).toBeInTheDocument()
    })

    it('renders upgrade button with correct link', () => {
        render(<SubscriptionPaywall />)
        const upgradeLink = screen.getByRole('link', { name: /Upgrade to Pro/ })
        expect(upgradeLink).toHaveAttribute('href', '/pricing')
    })

    it('renders restore purchase option', () => {
        render(<SubscriptionPaywall />)
        expect(screen.getByText('Restore Purchase')).toBeInTheDocument()
    })
})
