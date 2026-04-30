import { describe, it, expect } from 'vitest'
import { calculateLeadScore } from '@/src/lib/scoring'

describe('calculateLeadScore', () => {
  it('scores multiple work types at 40', () => {
    const score = calculateLeadScore({
      workTypes: ['isolation', 'pac'],
      budget: '10000',
      zipCode: '75001',
      propertyType: 'maison',
      propertyYear: 'avant1948',
      surface: '100',
      income: 'modeste',
    })
    expect(score).toBeGreaterThanOrEqual(40)
  })

  it('scores high budget at 30', () => {
    const score = calculateLeadScore({
      workTypes: ['pac'],
      budget: '50000',
      zipCode: '75001',
      propertyType: 'maison',
      propertyYear: 'avant1948',
      surface: '100',
      income: 'modeste',
    })
    expect(score).toBeGreaterThanOrEqual(30)
  })

  it('handles invalid budget gracefully', () => {
    const score = calculateLeadScore({
      workTypes: ['pac'],
      budget: '',
      zipCode: '75001',
      propertyType: 'maison',
      propertyYear: 'avant1948',
      surface: '100',
      income: 'superieur',
    })
    expect(score).toBeGreaterThanOrEqual(0)
  })
})
