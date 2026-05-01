import { test, expect } from '@playwright/test'

test.describe('Devis wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/devis')
  })

  test('loads wizard with progress steps', async ({ page }) => {
    await expect(page.locator('text=Obtenez vos devis gratuits')).toBeVisible()
    await expect(page.locator('span:has-text("Travaux")').first()).toBeVisible()
    await expect(page.locator('span:has-text("Logement")').first()).toBeVisible()
    await expect(page.locator('span:has-text("Contact")').first()).toBeVisible()
  })

  test('completes full wizard flow', async ({ page }) => {
    // Step 1: Travaux
    await page.click('text=Isolation des combles')
    await page.selectOption('select', { label: '10 000€ – 20 000€' })
    await page.click('text=Continuer')

    // Step 2: Logement
    await expect(page.locator('text=Votre logement')).toBeVisible()
    await page.fill('input[placeholder="75001 Paris"]', '75001')
    await page.click('text=Maison')
    await page.selectOption('select >> nth=0', { label: 'Avant 1948' })
    await page.selectOption('select >> nth=1', { label: '50 – 100m²' })
    await page.click('text=Continuer')

    // Step 3: Revenus
    await expect(page.locator('text=Votre situation financière')).toBeVisible()
    await page.click('text=Ménage très modeste ou modeste')
    await page.click('text=Continuer')

    // Step 4: Contact
    await expect(page.locator('text=Vos coordonnées')).toBeVisible()
    await page.fill('input[placeholder="Jean"]', 'Jean')
    await page.fill('input[placeholder="Dupont"]', 'Dupont')
    await page.fill('input[type="email"]', 'jean.dupont@test.fr')
    await page.fill('input[type="tel"]', '0612345678')

    // Check CGU text
    await expect(page.locator('text=CGU')).toBeVisible()
  })

  test('disables continue when no work type selected', async ({ page }) => {
    const continueBtn = page.locator('button:has-text("Continuer")')
    await expect(continueBtn).toBeDisabled()
  })

  test('shows subsidy estimate in sidebar', async ({ page }) => {
    await page.click('text=Isolation des combles')
    await page.selectOption('select', { label: '10 000€ – 20 000€' })
    await page.click('text=Continuer')

    // Fill logement step to advance
    await page.fill('input[placeholder="75001 Paris"]', '75001')
    await page.click('text=Maison')
    await page.selectOption('select >> nth=0', { label: 'Avant 1948' })
    await page.selectOption('select >> nth=1', { label: '50 – 100m²' })
    await page.click('text=Continuer')

    await page.click('text=Ménage très modeste ou modeste')

    await expect(page.locator('text=Vos aides estimées')).toBeVisible()
  })
})
