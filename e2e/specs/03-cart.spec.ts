import { test, expect } from '@playwright/test'

/**
 * Cart flows — no authentication required.
 * Tests use the UI to add products, then verify cart state.
 */
test.describe('Cart', () => {
  test('empty cart shows the empty state message', async ({ page }) => {
    // Clear any leftover cart state
    await page.goto('/cart')
    await page.evaluate(() => localStorage.removeItem('coffee_shop_cart'))
    await page.reload()
    await expect(page.getByText('Your cart is empty')).toBeVisible()
  })

  test('add a product to cart from the product detail page', async ({ page }) => {
    // Navigate to the first coffee product
    await page.goto('/coffee')
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await expect(page).toHaveURL(/\/product\//)

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()
    // Button briefly changes to "✓ Added!"
    await expect(page.getByRole('button', { name: /added/i })).toBeVisible()

    // Navigate to cart and verify item is there
    await page.goto('/cart')
    await expect(page.getByText('Your cart is empty')).not.toBeVisible()
    await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible()
    // At least 1 item
    await expect(page.getByText(/1 item/i)).toBeVisible()
  })

  test('cart total updates correctly when quantity is changed', async ({ page }) => {
    // Add a product first
    await page.goto('/coffee')
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.waitForTimeout(300) // wait for feedback to clear

    // Go to cart
    await page.goto('/cart')
    // Use the increase quantity button ("+")
    await page.getByRole('button', { name: /increase quantity/i }).click()
    // Now 2 items
    await expect(page.getByText(/2 items/i)).toBeVisible()
  })

  test('removing the only item shows empty state', async ({ page }) => {
    // Add a product
    await page.goto('/coffee')
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.waitForTimeout(300)

    // Go to cart and remove
    await page.goto('/cart')
    await page.getByRole('button', { name: /remove/i }).click()
    await expect(page.getByText('Your cart is empty')).toBeVisible({ timeout: 5_000 })
  })

  test('cart checkout button shows "Sign in to Checkout" when unauthenticated', async ({ page }) => {
    // Add a product to cart
    await page.goto('/coffee')
    const firstCard = page.locator('a[href^="/product/"]').first()
    await firstCard.waitFor({ timeout: 10_000 })
    await firstCard.click()
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.waitForTimeout(300)

    await page.goto('/cart')
    await expect(page.getByRole('button', { name: /sign in to checkout/i })).toBeVisible()
  })
})
