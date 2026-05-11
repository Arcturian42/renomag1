import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize a single text input by stripping all HTML tags and attributes
 * @param input - The raw string input from user
 * @returns The sanitized string with HTML stripped and whitespace trimmed
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return ''

  // Strip ALL HTML tags and attributes
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })

  return sanitized.trim()
}

/**
 * Check if sanitization changed the input (indicating HTML was present)
 * @param raw - The raw input string
 * @param sanitized - The sanitized output string
 * @returns True if HTML was detected and stripped
 */
export function wasHtmlDetected(raw: string | null | undefined, sanitized: string): boolean {
  if (!raw) return false
  return raw.trim() !== sanitized
}

/**
 * Sanitize all string fields in an object recursively
 * @param obj - Object with fields to sanitize
 * @returns New object with all string fields sanitized
 */
export function sanitizeFields(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value)
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeFields(value)
    } else if (Array.isArray(value)) {
      // Sanitize array elements
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeText(item)
          : typeof item === 'object'
            ? sanitizeFields(item)
            : item
      )
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Validate and sanitize a text input, throwing error if HTML detected
 * @param input - Raw text input
 * @param fieldName - Name of the field for error messages
 * @throws Error if HTML is detected in input
 * @returns Sanitized text
 */
export function sanitizeAndValidate(
  input: string | null | undefined,
  fieldName: string
): string {
  const sanitized = sanitizeText(input)

  if (wasHtmlDetected(input, sanitized)) {
    console.warn(
      `[XSS Protection] HTML detected in field "${fieldName}" at ${new Date().toISOString()}`
    )
    throw new Error('Contenu invalide — les balises HTML ne sont pas autorisées')
  }

  return sanitized
}
