/**
 * Form field max lengths for client and server validation
 */
export const MAX_LENGTHS = {
  name: 100,
  email: 254,
  description: 2000,
  bio: 2000,
  message: 2000,
  phone: 20,
  address: 200,
  city: 100,
  zipCode: 10,
  postalCode: 10,
  siret: 14,
} as const

/**
 * Password strength validation
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordValidation {
  valid: boolean
  strength: PasswordStrength
  errors: string[]
  score: number // 0-4
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []
  let score = 0

  // Check length
  if (password.length < 8) {
    errors.push('Au moins 8 caractères')
  } else {
    score++
  }

  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins 1 majuscule')
  } else {
    score++
  }

  // Check lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins 1 minuscule')
  } else {
    score++
  }

  // Check digit
  if (!/[0-9]/.test(password)) {
    errors.push('Au moins 1 chiffre')
  } else {
    score++
  }

  // Check special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Au moins 1 caractère spécial')
  } else {
    score++
  }

  // Determine strength
  let strength: PasswordStrength
  if (score < 3) {
    strength = 'weak'
  } else if (score < 5) {
    strength = 'medium'
  } else {
    strength = 'strong'
  }

  return {
    valid: errors.length === 0,
    strength,
    errors,
    score,
  }
}

/**
 * SIRET validation (14 digits + Luhn algorithm)
 */
export interface SiretValidation {
  valid: boolean
  error?: string
}

export function validateSiret(siret: string): SiretValidation {
  // Remove spaces and non-digit characters
  const cleaned = siret.replace(/\s/g, '')

  // Check if it's exactly 14 digits
  if (!/^\d{14}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'SIRET invalide — veuillez vérifier le numéro (14 chiffres requis)',
    }
  }

  // Luhn algorithm check
  if (!luhnCheck(cleaned)) {
    return {
      valid: false,
      error: 'SIRET invalide — veuillez vérifier le numéro',
    }
  }

  return { valid: true }
}

/**
 * Luhn algorithm implementation for SIRET validation
 */
function luhnCheck(digits: string): boolean {
  let sum = 0
  let isEven = false

  // Loop through digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Validate field length
 */
export function validateLength(
  value: string,
  fieldName: keyof typeof MAX_LENGTHS
): { valid: boolean; error?: string } {
  const maxLength = MAX_LENGTHS[fieldName]
  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Maximum ${maxLength} caractères`,
    }
  }
  return { valid: true }
}

/**
 * French phone number validation
 * Format: 0X XX XX XX XX (10 digits starting with 0)
 */
export interface PhoneValidation {
  valid: boolean
  error?: string
}

export function validateFrenchPhone(phone: string): PhoneValidation {
  // Remove spaces and non-digit characters
  const cleaned = phone.replace(/\s/g, '')

  // Check if it's exactly 10 digits starting with 0
  if (!/^0[1-9]\d{8}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Format invalide. Le numéro doit commencer par 0 et contenir 10 chiffres (ex: 06 12 34 56 78)',
    }
  }

  return { valid: true }
}
