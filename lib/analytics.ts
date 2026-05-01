import posthog from 'posthog-js'

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, properties)
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, traits)
  }
}

export function resetUser() {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset()
  }
}

export function isFeatureEnabled(flag: string): boolean {
  if (typeof window !== 'undefined' && posthog) {
    return posthog.isFeatureEnabled(flag) ?? false
  }
  return false
}

export function trackDevisStep(step: number, stepName: string) {
  trackEvent('devis_step_completed', { step, step_name: stepName })
}

export function trackLeadSubmitted(projectType: string, budget?: string | null) {
  trackEvent('lead_submitted', { project_type: projectType, budget })
}

export function trackArtisanContact(artisanId: string, artisanName: string) {
  trackEvent('artisan_contact', { artisan_id: artisanId, artisan_name: artisanName })
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search_performed', { query, results_count: resultsCount })
}
