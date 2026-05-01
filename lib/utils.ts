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

export function parseBudget(budget: string): number {
  if (!budget) return 0
  // Parse strings like "< 5 000€", "5 000€ - 10 000€", "> 50 000€"
  const cleaned = budget.replace(/\s/g, '').replace(/€/g, '').replace(/,/g, '.')
  const match = cleaned.match(/(\d+)/g)
  if (!match) return 0
  const nums = match.map((n) => parseInt(n, 10))
  if (cleaned.startsWith('<')) return nums[0] ?? 0
  if (cleaned.startsWith('>')) return nums[0] ?? 0
  if (nums.length >= 2) return Math.round((nums[0] + nums[1]) / 2)
  return nums[0] ?? 0
}

export function calculateSubsidy(
  workTypes: string[],
  income: 'modeste' | 'intermediaire' | 'superieur',
  budget: number
): { maprimerenov: number; cee: number; tva: number; total: number } {
  // 2024-2025 rates
  const incomeRates: Record<string, number> = {
    modeste: 0.8,
    intermediaire: 0.5,
    superieur: 0.2,
  }

  const hasIsolation = workTypes.some((w) =>
    /isolation|combles|murs|ite|menuiserie|fenêtre/i.test(w)
  )
  const hasPac = workTypes.some((w) => /pompe|chaleur|pac|chauffage|chaudière|poêle/i.test(w))
  const hasSolaire = workTypes.some((w) => /solaire|photovoltaïque|pv/i.test(w))

  let maprimerenovRate = incomeRates[income] ?? 0.2

  // Cap MaPrimeRénov' per project type
  const maprimerenovMax = hasIsolation ? 15000 : hasPac ? 12000 : hasSolaire ? 9000 : 7000
  let maprimerenov = Math.round(budget * maprimerenovRate)
  maprimerenov = Math.min(maprimerenov, maprimerenovMax)

  // CEE : ~15% of budget, capped
  const ceeMax = hasIsolation ? 4000 : hasPac ? 3000 : 2000
  let cee = Math.round(budget * 0.15)
  cee = Math.min(cee, ceeMax)

  // TVA 5.5% vs 20% : saves ~14.5% of budget
  const tva = Math.round(budget * 0.145)

  return {
    maprimerenov,
    cee,
    tva,
    total: maprimerenov + cee + tva,
  }
}

export function calculateEstimate(
  workTypes: string[],
  budget: string,
  surface: string,
  income: string
): { cost: number; aids: number; remaining: number } {
  const surfaceNum = parseInt(surface, 10) || 50
  const cost = surfaceNum * 150 * workTypes.length
  const aids = Math.round(cost * 0.4)
  const remaining = cost - aids
  return { cost, aids, remaining }
}
