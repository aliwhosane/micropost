import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
    it('should merge class names correctly', () => {
        expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
    })

    it('should handle conditional classes', () => {
        expect(cn('px-2', false && 'py-2', 'text-red-500')).toBe('px-2 text-red-500')
        expect(cn('px-2', true && 'py-2')).toBe('px-2 py-2')
    })

    it('should merge tailwind classes properly (override conflicts)', () => {
        expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4')
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should handle arrays and objects', () => {
        expect(cn(['px-2', 'py-2'])).toBe('px-2 py-2')
        expect(cn({ 'px-2': true, 'py-2': false, 'text-center': true })).toBe('px-2 text-center')
    })
})
