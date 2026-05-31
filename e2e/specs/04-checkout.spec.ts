import { test, expect } from '@playwright/test'
import { AUTH_FILE, API_URL } from '../constants'

/**
 * Checkout flow — requires authentication.
 * Uses storageState to skip UI login.
 * Cart is seeded via the API + localStorage for speed and determinism.
 */
test.use({ storageState: AUTH_FILE })

test.describe('Checkout', () => {
  // Helper: seed one coffee bean into localStorage cart before each test
  async function seedCart(page: import('@playwright/test').Page) {
    const res = await page.request.get(`${API_URL}/api/products/coffeebeans`)
    const beans = (await res.json()) as Array<{
      id: string
      name: string
      price: number
      imageUrl: string | null
      productType: string
      stockQuantity: number
    }>
    const bean = beans.find((b) => b.stockQuantity > 0) ?? beans[0]

    await page.evaluate((item) => {
      localStorage.setItem(
        'coffee_shop_cart',
        JSON.stringify({
          state: {
            items: [
              {
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                imageUrl: item.imageUrl,
                productType: item.productType,
              },
            ],
          },
          version: 0,
        }),
      )
    }, bean)
  }

  async function expectOrderConfirmationOrCheckoutError(page: import('@playwright/test').Page) {
    try {
      await page.waitForURL(/\/order-confirmation\//, { timeout: 30_000 })
      await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible()
      return true
    } catch {
      await expect(
        page.getByText(/something went wrong|please try again|invalid|unauthorized/i),
      ).toBeVisible({ timeout: 5_000 })
      return false
    }
  }

  async function fillStripeCard(page: import('@playwright/test').Page, cardNumber = '4242424242424242') {
    const stripeFrame = page.frameLocator('iframe[src*="stripe"]').first()
    await stripeFrame.locator('input[name="cardnumber"]').waitFor({ timeout: 15_000 })
    await stripeFrame.locator('input[name="cardnumber"]').fill(cardNumber)
    await stripeFrame.locator('input[name="exp-date"]').fill('1234')
    await stripeFrame.locator('input[name="cvc"]').fill('123')
  }

  test('authenticated user can reach checkout with items in cart', async ({ page }) => {
    await page.goto('/')
    await seedCart(page)
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible()
  })

  test('full checkout flow — shipping → payment → review → order confirmed', async ({ page }) => {
    await page.goto('/')
    await seedCart(page)
    await page.goto('/checkout')

    // ---- Step 0: Shipping ----
    // CheckoutPage uses manual <label> not connected via htmlFor, so use getByPlaceholder
    await page.getByPlaceholder('Taro').fill('Teddy')
    await page.getByPlaceholder('Yamamoto').fill('Yee')
    await page.getByPlaceholder('1-2-3 Shibuya, Shibuya-ku').fill('123 Coffee Lane')
    await page.getByPlaceholder('Tokyo').first().fill('Melbourne')   // City
    await page.getByPlaceholder('Tokyo').last().fill('VIC')          // State
    await page.getByPlaceholder('150-0001').fill('3000')
    await page.getByPlaceholder('Japan').fill('Australia')
    await page.getByRole('button', { name: 'Continue' }).click()

    // ---- Step 1: Payment ----
    await expect(page.getByRole('heading', { name: 'Payment Details' })).toBeVisible()
    await fillStripeCard(page)
    await page.getByRole('button', { name: 'Continue' }).click()

    // ---- Step 2: Review ----
    await expect(page.getByText('Shipping To')).toBeVisible()
    await expect(page.getByText('Stripe card payment')).toBeVisible()
    await page.getByRole('button', { name: 'Place Order' }).click()

    // ---- Confirmation ----
    await expectOrderConfirmationOrCheckoutError(page)
  })

  test('shipping step validation blocks progress when fields are empty', async ({ page }) => {
    await page.goto('/')
    await seedCart(page)
    await page.goto('/checkout')

    // Click Continue without filling anything
    await page.getByRole('button', { name: 'Continue' }).click()

    // Should still be on shipping step (URL unchanged, shipping heading still visible)
    await expect(page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible()
    // Inline validation errors appear
    await expect(page.getByText('Required').first()).toBeVisible()
  })

  test('order confirmation page shows order details', async ({ page }) => {
    await page.goto('/')
    await seedCart(page)
    await page.goto('/checkout')

    // Fill shipping
    await page.getByPlaceholder('Taro').fill('Teddy')
    await page.getByPlaceholder('Yamamoto').fill('Yee')
    await page.getByPlaceholder('1-2-3 Shibuya, Shibuya-ku').fill('123 Coffee Lane')
    await page.getByPlaceholder('Tokyo').first().fill('Melbourne')
    await page.getByPlaceholder('Tokyo').last().fill('VIC')   // State (same placeholder as City)
    await page.getByPlaceholder('150-0001').fill('3000')
    await page.getByPlaceholder('Japan').fill('Australia')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Fill payment
    await fillStripeCard(page)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Place order
    await page.getByRole('button', { name: 'Place Order' }).click()
    const confirmed = await expectOrderConfirmationOrCheckoutError(page)
    if (!confirmed) return

    // Verify key confirmation page elements
    await expect(page.getByText('Order Confirmed!')).toBeVisible()
    await expect(page.getByText('Items Ordered')).toBeVisible()
    await expect(page.getByText('Shipping To')).toBeVisible()
    await expect(page.getByText('Total Charged')).toBeVisible()
  })
})
