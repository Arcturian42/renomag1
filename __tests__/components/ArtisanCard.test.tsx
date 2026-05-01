import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArtisanCard from '@/components/directory/ArtisanCard'

const mockArtisan = {
  id: '1',
  slug: 'test-artisan',
  name: 'Jean Test',
  company: 'Test Corp',
  avatar: 'https://ui-avatars.com/api/?name=Jean+Test',
  city: 'Paris',
  department: 'Paris (75)',
  region: 'Île-de-France',
  address: '1 rue Test',
  phone: '01 23 45 67 89',
  email: 'test@test.fr',
  description: 'Super artisan',
  specialties: ['Isolation'],
  certifications: ['RGE'] as ['RGE'],
  rating: 4.5,
  reviewCount: 10,
  projectCount: 50,
  yearsExperience: 5,
  responseTime: '< 2h',
  verified: true,
  premium: true,
  available: true,
  siret: '123 456 789 00012',
  since: 2019,
  gallery: [],
  reviews: [],
}

describe('ArtisanCard', () => {
  it('renders company name', () => {
    render(<ArtisanCard artisan={mockArtisan} />)
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
  })

  it('renders rating', () => {
    render(<ArtisanCard artisan={mockArtisan} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })
})
