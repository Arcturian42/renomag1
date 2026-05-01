import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateSubsidy(
  workType: string,
  income: 'modeste' | 'intermediaire' | 'superieur',
  budget: number
): number {
  // Simplified calculation stub
  const baseRates: Record<string, number> = {
    modeste: 0.7,
    intermediaire: 0.4,
    superieur: 0.3,
  }
  const rate = workType === 'isolation' ? baseRates[income] : baseRates[income] * 0.6666666666666666
  return Math.round(budget * (rate ?? 0.2))
}

export function calculateEstimate(
  workTypes: string[],
  budget: string,
  surface: string,
  income: string
): { cost: number; aids: number; remaining: number } {
  // Simplified calculation stub
  const surfaceNum = parseInt(surface, 10) || 50
  const cost = surfaceNum * 150 * workTypes.length
  const aids = Math.round(cost * 0.4)
  const remaining = cost - aids
  return { cost, aids, remaining }
}
