import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTrendingNews, aggregateNews } from '../news'
import Parser from 'rss-parser'

vi.mock('rss-parser', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            parseURL: vi.fn()
        }))
    }
})

describe('news', () => {
    let mockParseURL: any

    beforeEach(() => {
        vi.clearAllMocks()
        // Access the mock instance
        const MockParser = Parser as unknown as ReturnType<typeof vi.fn>
        mockParseURL = new MockParser().parseURL
    })

    describe('fetchTrendingNews', () => {
        it('fetches and maps news items', async () => {
            mockParseURL.mockResolvedValue({
                items: [
                    { title: 'Item 1', link: 'url1', pubDate: '2023-01-01', creator: 'Source 1' },
                    { title: 'Item 2', link: 'url2', pubDate: '2023-01-02' }
                ]
            })

            const result = await fetchTrendingNews('Topic')

            expect(mockParseURL).toHaveBeenCalledWith(expect.stringContaining('google.com/rss/search?q=Topic'))
            expect(result).toHaveLength(2)
            expect(result[0]).toEqual(expect.objectContaining({
                title: 'Item 1',
                source: 'Source 1'
            }))
            // Fallback for missing creator
            expect(result[1]).toEqual(expect.objectContaining({
                title: 'Item 2',
                source: 'Google News'
            }))
        })

        it('returns empty array on error', async () => {
            mockParseURL.mockRejectedValue(new Error('Network Error'))
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { })

            const result = await fetchTrendingNews('Topic')

            expect(result).toEqual([])
            spy.mockRestore()
        })
    })

    describe('aggregateNews', () => {
        it('aggregates and deduplicates news', async () => {
            mockParseURL.mockImplementation(async (url: string) => {
                if (url.includes('T1')) {
                    return { items: [{ title: 'Common', link: 'l1', pubDate: '2023-01-01' }] }
                }
                if (url.includes('T2')) {
                    return { items: [{ title: 'Common', link: 'l1', pubDate: '2023-01-01' }, { title: 'Unique', link: 'l2', pubDate: '2023-01-02' }] }
                }
                return { items: [] }
            })

            const result = await aggregateNews(['T1', 'T2'])

            // Should have 2 items total (Common is deduped)
            expect(result).toHaveLength(2)
            // Sorted by date descending (Newest first)
            expect(result[0].title).toBe('Unique')
            expect(result[1].title).toBe('Common')
        })
    })
})
