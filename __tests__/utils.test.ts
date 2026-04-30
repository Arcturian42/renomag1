import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatDate, slugify, truncate, getInitials, calculateSubsidy } from '@/lib/utils'

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('a', 'b')).toBe('a b')
  })
  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})

describe('formatPrice', () => {
  it('formats euros', () => {
    expect(formatPrice(1500)).toBe('1 500 €')
  })
  it('formats custom currency', () => {
    expect(formatPrice(100, 'USD')).toBe('100 $US')
  })
})

describe('formatDate', () => {
  it('formats ISO date', () => {
    expect(formatDate('2024-03-15')).toContain('2024')
  })
})

describe('slugify', () => {
  it('slugifies french text', () => {
    expect(slugify('Pompe à chaleur')).toBe('pompe-a-chaleur')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })
  it('returns short strings as-is', () => {
    expect(truncate('hi', 10)).toBe('hi')
  })
})

describe('getInitials', () => {
  it('returns initials', () => {
    expect(getInitials('Jean Dupont')).toBe('JD')
  })
})

describe('calculateSubsidy', () => {
  it('calculates modeste isolation', () => {
    expect(calculateSubsidy('isolation', 'modeste', 10000)).toBe(7000)
  })
  it('calculates superieur default', () => {
    expect(calculateSubsidy('unknown', 'superieur', 10000)).toBe(2000)
  })
})
