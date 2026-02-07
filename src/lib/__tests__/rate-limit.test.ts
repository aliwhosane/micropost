import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RateLimiter } from '../rate-limit'

describe('RateLimiter', () => {
    let dateNowSpy: any

    beforeEach(() => {
        // Mock Date.now to control time
        dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1000)
    })

    it('should allow requests within the limit', () => {
        const limiter = new RateLimiter(2, 60000)
        expect(limiter.check('ip-1')).toBe(true)
        expect(limiter.check('ip-1')).toBe(true)
    })

    it('should block requests exceeding the limit', () => {
        const limiter = new RateLimiter(2, 60000)
        expect(limiter.check('ip-1')).toBe(true)
        expect(limiter.check('ip-1')).toBe(true)
        expect(limiter.check('ip-1')).toBe(false)
    })

    it('should track different IPs separately', () => {
        const limiter = new RateLimiter(1, 60000)
        expect(limiter.check('ip-1')).toBe(true)
        expect(limiter.check('ip-1')).toBe(false)
        expect(limiter.check('ip-2')).toBe(true)
    })

    it('should reset after the window passes', () => {
        const limiter = new RateLimiter(1, 60000) // 1 minute window

        // T = 1000
        expect(limiter.check('ip-1')).toBe(true)
        expect(limiter.check('ip-1')).toBe(false)

        // Advance time by 60001ms (just over 1 minute)
        dateNowSpy.mockReturnValue(1000 + 60001)

        // Should be allowed again
        expect(limiter.check('ip-1')).toBe(true)
    })
})
