import { test, expect } from '@playwright/test'

test.describe('SEO & structured data', () => {
  test('sitemap.xml is valid', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('<urlset')
    expect(body).toContain('https://renomag.fr/')
    expect(body).toContain('/annuaire/thermoconfort-paris')
    expect(body).toContain('/blog/maprimrenov-2024-tout-savoir')
  })

  test('robots.txt blocks private routes', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain('User-Agent: *')
    expect(body).toContain('Disallow: /admin')
    expect(body).toContain('Disallow: /espace-pro')
    expect(body).toContain('Sitemap: https://renomag.fr/sitemap.xml')
  })

  test('homepage has JSON-LD Organization', async ({ page }) => {
    await page.goto('/')
    const jsonLd = await page.locator('script[type="application/ld+json"]').innerHTML()
    const data = JSON.parse(jsonLd)
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('RENOMAG')
    expect(data.url).toBe('https://renomag.fr')
  })

  test('artisan page has JSON-LD LocalBusiness', async ({ page }) => {
    await page.goto('/annuaire/thermoconfort-paris')
    const jsonLd = await page.locator('script[type="application/ld+json"]').innerHTML()
    const data = JSON.parse(jsonLd)
    expect(data['@type']).toBe('LocalBusiness')
    expect(data.name).toBe('ThermoConfort Paris')
    expect(data.aggregateRating).toBeDefined()
  })

  test('blog article has JSON-LD Article', async ({ page }) => {
    await page.goto('/blog/maprimrenov-2024-tout-savoir')
    const jsonLd = await page.locator('script[type="application/ld+json"]').innerHTML()
    const data = JSON.parse(jsonLd)
    expect(data['@type']).toBe('Article')
    expect(data.headline).toContain("MaPrimeRénov'")
  })

  test('meta tags are present on homepage', async ({ page }) => {
    await page.goto('/')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('artisans RGE')
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toContain('RENOMAG')
  })
})
