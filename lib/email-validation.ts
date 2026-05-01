import { promises as dns } from 'dns'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export async function hasValidMXRecord(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return false

    const mxRecords = await dns.resolveMx(domain)
    return mxRecords.length > 0
  } catch {
    return false
  }
}

export async function validateEmail(email: string): Promise<{
  valid: boolean
  error?: string
}> {
  if (!email || !isValidEmailFormat(email)) {
    return { valid: false, error: 'Adresse email invalide' }
  }

  const hasMX = await hasValidMXRecord(email)
  if (!hasMX) {
    return { valid: false, error: 'Domaine email invalide ou inexistant' }
  }

  return { valid: true }
}
