import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PostCard } from '../index'
import { approvePost, updatePostContent, rejectPost } from '@/lib/actions'

// Mock server actions
vi.mock('@/lib/actions', () => ({
    approvePost: vi.fn(),
    rejectPost: vi.fn(),
    updatePostContent: vi.fn(),
    regeneratePostAction: vi.fn(),
}))

// Mock Hooks
// usePostSelection and usePostScheduling are custom hooks. 
// We can mock them to simplify the test logic or test integration if we mock the underlying primitives.
// Since the Plan says "Integration test mainly", checking strict hooking might be better.
// But mocking them gives more control over complex state like "isScheduling".
// Let's mock them partially or just use real implementations if they rely on simple React state.
// Looking at the imports in index.tsx:
// import { usePostSelection } from "@/hooks/usePostSelection";
// import { usePostScheduling } from "@/hooks/usePostScheduling";

// If we don't mock them, we need to ensure their dependencies are mocked.
// They likely use useState and maybe some DOM interaction.
// Let's assume real hooks work fine in JSDOM usually. 

// Mock Next.js navigation
const mockRouter = { refresh: vi.fn() }
vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/dashboard'
}))

// Mock sub-components if they are complex to render or irrelevant to PostCard logic
// But PostCardActions and CharacterCount are simple enough.
// VisionSelector might be complex (imports Satori etc potentially?), let's mock it.
vi.mock('../VisionCraft/VisionSelector', () => ({
    VisionSelector: () => <div data-testid="vision-selector">Vision Selector</div>
}))

describe('PostCard', () => {
    const defaultProps = {
        id: 'post-123',
        content: 'Hello World',
        platform: 'TWITTER',
        topic: 'Tech',
        createdAt: new Date(),
        status: 'PENDING',
        imageUrl: null
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders post content and metadata', () => {
        render(<PostCard {...defaultProps} />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
        expect(screen.getByText('Tech')).toBeInTheDocument()
    })

    it('enters edit mode and updates content', async () => {
        render(<PostCard {...defaultProps} />)

        // Find Edit button
        const editBtn = screen.getByText('Edit')
        fireEvent.click(editBtn)

        // Check textarea appears
        const textarea = screen.getByDisplayValue('Hello World')
        expect(textarea).toBeInTheDocument()

        // Update content
        fireEvent.change(textarea, { target: { value: 'Updated Content' } })

        // Click Save
        const saveBtn = screen.getByText('Save')
        fireEvent.click(saveBtn)

        // Verify action called
        expect(updatePostContent).toHaveBeenCalledWith('post-123', 'Updated Content')
    })

    it('handles approval action', async () => {
        render(<PostCard {...defaultProps} />)

        const approveBtn = screen.getByText('Approve')
        fireEvent.click(approveBtn)

        expect(approvePost).toHaveBeenCalledWith('post-123')
    })

    it('handles rejection action', async () => {
        render(<PostCard {...defaultProps} />)

        const rejectBtn = screen.getByText('Reject')
        fireEvent.click(rejectBtn)

        expect(rejectPost).toHaveBeenCalledWith('post-123')
    })

    it('toggles VisionSelector when Add Visual clicked', () => {
        render(<PostCard {...defaultProps} />)

        const addVisualBtn = screen.getByText('Add Visual')
        fireEvent.click(addVisualBtn)

        expect(screen.getByTestId('vision-selector')).toBeInTheDocument()
    })
})
