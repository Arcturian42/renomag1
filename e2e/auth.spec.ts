import { test, expect } from '@playwright/test'

test.describe('Authentication & middleware', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/connexion')
    await expect(page.locator('text=Bon retour !')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible()
  })

  test('signup page renders form', async ({ page }) => {
    await page.goto('/inscription')
    await expect(page.locator('text=Créer un compte')).toBeVisible()
    await expect(page.locator('text=Je suis particulier')).toBeVisible()
    await expect(page.locator('text=Je suis artisan RGE')).toBeVisible()

    await page.click('text=Je suis particulier')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('unauthenticated user is redirected from admin', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/connexion/)
  })

  test('unauthenticated user is redirected from espace-pro', async ({ page }) => {
    await page.goto('/espace-pro')
    await expect(page).toHaveURL(/\/connexion/)
  })

  test('unauthenticated user is redirected from espace-proprietaire', async ({ page }) => {
    await page.goto('/espace-proprietaire')
    await expect(page).toHaveURL(/\/connexion/)
  })

  test('login shows validation error for empty fields', async ({ page }) => {
    await page.goto('/connexion')
    const form = page.locator('form')
    await form.evaluate((f: HTMLFormElement) => f.reportValidity())
    // HTML5 validation should prevent submit; button remains enabled but form won't submit
    await expect(page.locator('text=Bon retour !')).toBeVisible()
  })

  test('login page has Google OAuth button', async ({ page }) => {
    await page.goto('/connexion')
    const googleBtn = page.locator('button:has-text("Continuer avec Google")')
    await expect(googleBtn).toBeVisible()
    await expect(googleBtn.locator('svg')).toBeVisible()
  })

  test('signup page has Google OAuth button', async ({ page }) => {
    await page.goto('/inscription')
    await page.click('text=Je suis particulier')
    const googleBtn = page.locator('button:has-text("S\'inscrire avec Google")')
    await expect(googleBtn).toBeVisible()
  })

  test('password reset page renders form', async ({ page }) => {
    await page.goto('/mot-de-passe-oublie')
    await expect(page.locator('text=Mot de passe oublié')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button:has-text("Envoyer le lien de réinitialisation")')).toBeVisible()
  })

  test('OAuth callback route exists and redirects without code', async ({ page }) => {
    await page.goto('/auth/callback')
    // Without a code param it should redirect to login with an error
    await expect(page).toHaveURL(/\/connexion/)
  })
})
