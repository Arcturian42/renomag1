/**
 * Calculate profile completion score for an artisan company
 * @param artisan - The artisan company object
 * @param reviewCount - Number of reviews (optional, defaults to 0)
 * @returns Profile completion score (0-100)
 */
export function calculateProfileScore(
  artisan: {
    name?: string | null
    description?: string | null
    phone?: string | null
    website?: string | null
  } | null,
  reviewCount: number = 0
): number {
  if (!artisan) return 0

  const scoreFields = [
    !!artisan.name,
    !!artisan.description && artisan.description.length > 50,
    !!artisan.phone,
    !!artisan.website,
    reviewCount > 0,
  ]

  return Math.round((scoreFields.filter(Boolean).length / scoreFields.length) * 100)
}

/**
 * Get profile completion status label
 * @param score - Profile score (0-100)
 * @returns Status label
 */
export function getProfileScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 50) return 'Bon profil'
  return 'À compléter'
}
