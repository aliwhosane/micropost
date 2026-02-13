import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureGuard } from '../FeatureGuard'

// Mock usePathname
const mockPathname = vi.fn()
vi.mock('next/navigation', () => ({
    usePathname: () => mockPathname(),
}))

// Mock SubscriptionPaywall because it's imported
vi.mock('@/components/dashboard/SubscriptionPaywall', () => ({
    SubscriptionPaywall: () => <div>Paywall Shown</div>
}))

describe('FeatureGuard', () => {
    it('renders children if subscribed', () => {
        mockPathname.mockReturnValue('/dashboard')
        render(<FeatureGuard isSubscribed={true}><div>Content</div></FeatureGuard>)
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.queryByText('Paywall Shown')).not.toBeInTheDocument()
    })

    it('renders paywall if not subscribed and not settings page', () => {
        mockPathname.mockReturnValue('/dashboard')
        render(<FeatureGuard isSubscribed={false}><div>Content</div></FeatureGuard>)
        expect(screen.queryByText('Content')).not.toBeInTheDocument()
        expect(screen.getByText('Paywall Shown')).toBeInTheDocument()
    })

    it('renders children if not subscribed but on settings page', () => {
        mockPathname.mockReturnValue('/dashboard/settings')
        render(<FeatureGuard isSubscribed={false}><div>Content</div></FeatureGuard>)
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.queryByText('Paywall Shown')).not.toBeInTheDocument()
    })
})
