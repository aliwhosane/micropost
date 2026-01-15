export class RateLimiter {
    private ipMap = new Map<string, { count: number; lastReset: number }>();
    private limit: number;
    private windowMs: number;

    constructor(limit: number = 20, windowMs: number = 60000) {
        this.limit = limit;
        this.windowMs = windowMs;

        // Basic cleanup verification to avoid indefinite memory growth
        // In a real serverless edge environment, this map won't live forever anyway.
    }

    public check(ip: string): boolean {
        const now = Date.now();
        const record = this.ipMap.get(ip);

        if (!record) {
            this.ipMap.set(ip, { count: 1, lastReset: now });
            return true;
        }

        // Check if window has passed
        if (now - record.lastReset > this.windowMs) {
            record.count = 1;
            record.lastReset = now;
            return true;
        }

        // Check limit
        if (record.count >= this.limit) {
            return false;
        }

        // Increment
        record.count++;
        return true;
    }
}

// Singleton for "instance" reuse where possible (best effort in serverless)
export const apiRateLimiter = new RateLimiter(60, 60000); // 60 requests per minute per IP
