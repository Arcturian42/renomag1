import { test, expect } from '@playwright/test'

test.describe('Public pages', () => {
  test('homepage loads with hero and CTAs', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/RENOMAG/)
    await expect(page.locator('h1')).toContainText(/Rénovez mieux/)
    await expect(page.locator('a:has-text("Trouver un artisan")').first()).toBeVisible()
    await expect(page.locator('a:has-text("Devis gratuit")').first()).toBeVisible()
  })

  test('homepage navigates to annuaire', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Trouver un artisan RGE')
    await expect(page).toHaveURL(/\/annuaire/)
    await expect(page.locator('h1')).toContainText(/Annuaire des artisans RGE/)
  })

  test('homepage navigates to blog', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Blog')
    await expect(page).toHaveURL(/\/blog/)
    await expect(page.locator('h1')).toContainText(/rénovation énergétique/)
  })

  test('annuaire displays artisans and detail page', async ({ page }) => {
    await page.goto('/annuaire')
    await expect(page.locator('text=ThermoConfort Paris').first()).toBeVisible()

    // Click the "Voir le profil" link within the ThermoConfort Paris card
    const card = page.locator('.bg-white:has-text("ThermoConfort Paris")')
    await card.locator('text=Voir le profil').click()
    await expect(page).toHaveURL(/\/annuaire\/thermoconfort-paris/)
    await expect(page.locator('h1')).toContainText(/ThermoConfort Paris/)
    await expect(page.locator('text=Contacter ThermoConfort Paris')).toBeVisible()
  })

  test('blog displays articles and article detail', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.locator('text=MaPrimeRénov\' 2024')).toBeVisible()

    await page.click('text=MaPrimeRénov\' 2024')
    await expect(page).toHaveURL(/\/blog\/maprimrenov-2024-tout-savoir/)
    await expect(page.locator('h1')).toContainText(/MaPrimeRénov/)
    await expect(page.locator('text=Équipe RENOMAG')).toBeVisible()
  })

  test('footer links work', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Mentions légales')
    await expect(page).toHaveURL(/\/mentions-legales/)
  })

  test('static pages load', async ({ page }) => {
    for (const url of ['/faq', '/tarifs', '/comment-ca-marche', '/partenaires', '/cgv', '/confidentialite']) {
      await page.goto(url)
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('annuaire filters by specialty', async ({ page }) => {
    await page.goto('/annuaire')
    await expect(page.locator('text=Annuaire des artisans RGE')).toBeVisible()

    // Select a specialty from the dropdown (the one with "Toutes spécialités" placeholder)
    const specialtySelect = page.locator('select:has(option:has-text("Toutes spécialités"))')
    await specialtySelect.selectOption({ label: 'Isolation thermique' })

    // Wait for navigation and verify URL
    await expect(page).toHaveURL(/specialite=Isolation[+%20]thermique/)

    // Results should still be visible (mock data has artisans)
    await expect(page.locator('text=artisans affichés')).toBeVisible()
  })

  test('annuaire search by query', async ({ page }) => {
    await page.goto('/annuaire')

    // Type in search box and wait for debounce
    await page.fill('input[placeholder*="Ville"]', 'Paris')
    await page.waitForTimeout(400)

    // Should update URL with q param
    await expect(page).toHaveURL(/q=Paris/)
  })
})
