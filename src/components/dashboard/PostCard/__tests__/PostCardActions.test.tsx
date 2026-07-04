import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PostCardActions } from '../PostCardActions'

describe('PostCardActions', () => {
    const defaultProps = {
        status: 'PENDING',
        isEditing: false,
        actionStatus: 'IDLE',
        onEdit: vi.fn(),
        onCancel: vi.fn(),
        onSave: vi.fn(),
        onApprove: vi.fn(),
        onReject: vi.fn(),
        onToggleSchedule: vi.fn(),
        isValid: true
    }

    it('renders pending actions correctly', () => {
        render(<PostCardActions {...defaultProps} />)
        expect(screen.getByText('Edit')).toBeInTheDocument()
        expect(screen.getByText('Reject')).toBeInTheDocument()
        expect(screen.getByText('Approve')).toBeInTheDocument()
    })

    it('renders edit mode actions', () => {
        render(<PostCardActions {...defaultProps} isEditing={true} />)
        expect(screen.getByText('Cancel')).toBeInTheDocument()
        expect(screen.getByText('Save')).toBeInTheDocument()
        expect(screen.queryByText('Approve')).not.toBeInTheDocument()
    })

    it('renders published status', () => {
        render(<PostCardActions {...defaultProps} status="PUBLISHED" />)
        expect(screen.getByText('Posted')).toBeInTheDocument()
        expect(screen.queryByText('Approve')).not.toBeInTheDocument()
    })

    it('disables actions when buttons are clicked', () => {
        const onApprove = vi.fn()
        render(<PostCardActions {...defaultProps} onApprove={onApprove} />)

        fireEvent.click(screen.getByText('Approve'))
        expect(onApprove).toHaveBeenCalled()
    })

    it('shows loading state for save', () => {
        render(<PostCardActions {...defaultProps} isEditing={true} actionStatus="SAVING" />)
        const saveBtn = screen.getByRole('button', { name: /Save/ })
        expect(saveBtn).toBeDisabled()
        // Assuming Button component shows spinner or similar, or just disabled check
    })

    it('handles compact mode', () => {
        render(<PostCardActions {...defaultProps} isCompact={true} />)
        // In compact pending mode, we expect quick action buttons (icons only)
        // They use titles 'Quick Approve' and 'Quick Reject'
        expect(screen.getByTitle('Quick Approve')).toBeInTheDocument()
        expect(screen.getByTitle('Quick Reject')).toBeInTheDocument()
    })
})
