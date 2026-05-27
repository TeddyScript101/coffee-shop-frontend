import { test, expect } from '@playwright/test'

/**
 * Browse flows — public pages that require no authentication.
 */
test.describe('Browse', () => {
  test('homepage shows the brand name', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('BeanWorks').first()).toBeVisible()
  })

  test('coffee list page loads and shows products', async ({ page }) => {
    await page.goto('/coffee')
    await expect(page.getByRole('heading', { name: 'Coffee Beans' })).toBeVisible()
    // Wait for at least one product card link to appear (API data loaded)
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({ timeout: 10_000 })
  })

  test('roast filter chips render on coffee page', async ({ page }) => {
    await page.goto('/coffee')
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Light' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Dark' })).toBeVisible()
  })

  test('equipment list page loads and shows products', async ({ page }) => {
    await page.goto('/equipment')
    await expect(page.getByRole('heading', { name: 'Equipment' })).toBeVisible({ timeout: 5_000 })
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({ timeout: 10_000 })
  })

  test('clicking a product card navigates to product detail page', async ({ page }) => {
    await page.goto('/coffee')
    // Wait for product cards and click the first one
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await expect(page).toHaveURL(/\/product\//)
  })

  test('product detail page shows name, price, and Add to Cart button', async ({ page }) => {
    await page.goto('/coffee')
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await expect(page).toHaveURL(/\/product\//)
    // Price shown as currency
    await expect(page.getByText(/\$\d+/).first()).toBeVisible({ timeout: 5_000 })
    // Add to Cart button
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible()
  })
})
