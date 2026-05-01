import { test, expect } from '@playwright/test'

test.describe('Rate limiting', () => {
  test('shows rate limit error after too many submissions', async ({ page }) => {
    await page.goto('/devis')

    // Helper to fill and submit wizard
    const submitWizard = async () => {
      await page.click('text=Isolation des combles')
      await page.selectOption('select', { label: '10 000€ – 20 000€' })
      await page.click('text=Continuer')

      await page.fill('input[placeholder="75001 Paris"]', '75001')
      await page.click('text=Maison')
      await page.selectOption('select >> nth=0', { label: 'Avant 1948' })
      await page.selectOption('select >> nth=1', { label: '50 – 100m²' })
      await page.click('text=Continuer')

      await page.click('text=Ménage très modeste ou modeste')
      await page.click('text=Continuer')

      await page.fill('input[placeholder="Jean"]', 'Jean')
      await page.fill('input[placeholder="Dupont"]', 'Dupont')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="tel"]', '0612345678')
      await page.click('text=Envoyer ma demande')
    }

    // First submission should work (or show non-rate-limit error since Supabase is not configured)
    await submitWizard()

    // Go back and try multiple times to trigger rate limit
    for (let i = 0; i < 6; i++) {
      await page.goto('/devis')
      await submitWizard()
    }

    // Eventually we should see the rate limit error message
    await expect(page.locator('text=trop de demandes')).toBeVisible({ timeout: 5000 })
  })
})
