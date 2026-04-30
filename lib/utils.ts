import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
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
  workCost: number
): number {
  const rates: Record<string, Record<string, number>> = {
    isolation: { modeste: 0.7, intermediaire: 0.45, superieur: 0.3 },
    pompe_chaleur: { modeste: 0.65, intermediaire: 0.4, superieur: 0.25 },
    chaudiere_gaz: { modeste: 0.4, intermediaire: 0.25, superieur: 0.15 },
    photovoltaique: { modeste: 0.3, intermediaire: 0.2, superieur: 0.1 },
    default: { modeste: 0.5, intermediaire: 0.35, superieur: 0.2 },
  }
  const rate = (rates[workType] || rates.default)[income]
  return Math.round(workCost * rate)
}
