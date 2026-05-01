# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public.spec.ts >> Public pages >> annuaire filters by specialty
- Location: e2e/public.spec.ts:61:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Public pages', () => {
  4  |   test('homepage loads with hero and CTAs', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await expect(page).toHaveTitle(/RENOMAG/)
  7  |     await expect(page.locator('h1')).toContainText(/Rénovez mieux/)
  8  |     await expect(page.locator('a:has-text("Trouver un artisan")').first()).toBeVisible()
  9  |     await expect(page.locator('a:has-text("Devis gratuit")').first()).toBeVisible()
  10 |   })
  11 | 
  12 |   test('homepage navigates to annuaire', async ({ page }) => {
  13 |     await page.goto('/')
  14 |     await page.click('text=Trouver un artisan RGE')
  15 |     await expect(page).toHaveURL(/\/annuaire/)
  16 |     await expect(page.locator('h1')).toContainText(/Annuaire des artisans RGE/)
  17 |   })
  18 | 
  19 |   test('homepage navigates to blog', async ({ page }) => {
  20 |     await page.goto('/')
  21 |     await page.click('text=Blog')
  22 |     await expect(page).toHaveURL(/\/blog/)
  23 |     await expect(page.locator('h1')).toContainText(/rénovation énergétique/)
  24 |   })
  25 | 
  26 |   test('annuaire displays artisans and detail page', async ({ page }) => {
  27 |     await page.goto('/annuaire')
  28 |     await expect(page.locator('text=ThermoConfort Paris').first()).toBeVisible()
  29 | 
  30 |     // Click the "Voir le profil" link within the ThermoConfort Paris card
  31 |     const card = page.locator('.bg-white:has-text("ThermoConfort Paris")')
  32 |     await card.locator('text=Voir le profil').click()
  33 |     await expect(page).toHaveURL(/\/annuaire\/thermoconfort-paris/)
  34 |     await expect(page.locator('h1')).toContainText(/ThermoConfort Paris/)
  35 |     await expect(page.locator('text=Contacter ThermoConfort Paris')).toBeVisible()
  36 |   })
  37 | 
  38 |   test('blog displays articles and article detail', async ({ page }) => {
  39 |     await page.goto('/blog')
  40 |     await expect(page.locator('text=MaPrimeRénov\' 2024')).toBeVisible()
  41 | 
  42 |     await page.click('text=MaPrimeRénov\' 2024')
  43 |     await expect(page).toHaveURL(/\/blog\/maprimrenov-2024-tout-savoir/)
  44 |     await expect(page.locator('h1')).toContainText(/MaPrimeRénov/)
  45 |     await expect(page.locator('text=Équipe RENOMAG')).toBeVisible()
  46 |   })
  47 | 
  48 |   test('footer links work', async ({ page }) => {
  49 |     await page.goto('/')
  50 |     await page.click('text=Mentions légales')
  51 |     await expect(page).toHaveURL(/\/mentions-legales/)
  52 |   })
  53 | 
  54 |   test('static pages load', async ({ page }) => {
  55 |     for (const url of ['/faq', '/tarifs', '/comment-ca-marche', '/partenaires', '/cgv', '/confidentialite']) {
  56 |       await page.goto(url)
  57 |       await expect(page.locator('body')).toBeVisible()
  58 |     }
  59 |   })
  60 | 
  61 |   test('annuaire filters by specialty', async ({ page }) => {
> 62 |     await page.goto('/annuaire')
     |                ^ Error: page.goto: Target page, context or browser has been closed
  63 |     await expect(page.locator('text=Annuaire des artisans RGE')).toBeVisible()
  64 | 
  65 |     // Select a specialty from the dropdown (the one with "Toutes spécialités" placeholder)
  66 |     const specialtySelect = page.locator('select:has(option:has-text("Toutes spécialités"))')
  67 |     await specialtySelect.selectOption({ label: 'Isolation thermique' })
  68 | 
  69 |     // Wait for navigation and verify URL
  70 |     await expect(page).toHaveURL(/specialite=Isolation[+%20]thermique/)
  71 | 
  72 |     // Results should still be visible (mock data has artisans)
  73 |     await expect(page.locator('text=artisans affichés')).toBeVisible()
  74 |   })
  75 | 
  76 |   test('annuaire search by query', async ({ page }) => {
  77 |     await page.goto('/annuaire')
  78 | 
  79 |     // Type in search box and wait for debounce
  80 |     await page.fill('input[placeholder*="Ville"]', 'Paris')
  81 |     await page.waitForTimeout(400)
  82 | 
  83 |     // Should update URL with q param
  84 |     await expect(page).toHaveURL(/q=Paris/)
  85 |   })
  86 | })
  87 | 
```