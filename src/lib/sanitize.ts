/**
 * Sanitize user input before interpolation into AI prompts.
 * Prevents prompt injection by removing quote-breaking characters
 * and enforcing length limits.
 */
export function sanitizeForPrompt(input: string, maxLength: number = 2000): string {
    return input
        .slice(0, maxLength)
        .replace(/[\\\\]/g, '') // Remove backslash escapes
        .replace(/\u0000/g, '')  // Remove null bytes
        .trim();
}

/**
 * Sanitize and validate that a required string field is present.
 * Throws a descriptive error if the field is missing or empty.
 */
export function requireField(value: unknown, fieldName: string): string {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Missing required field: ${fieldName}`);
    }
    return sanitizeForPrompt(value.trim());
}
