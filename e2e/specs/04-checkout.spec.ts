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
    await page.getByPlaceholder('TARO YAMAMOTO').fill('TEDDY YEE')
    await page.getByPlaceholder('1234 5678 9012 3456').fill('1234 5678 9012 3456')
    await page.getByPlaceholder('MM/YY').fill('08/34')
    // exact: true avoids matching the card number placeholder which also contains "123"
    await page.getByPlaceholder('123', { exact: true }).fill('123')
    await page.getByRole('button', { name: 'Continue' }).click()

    // ---- Step 2: Review ----
    await expect(page.getByText('Shipping To')).toBeVisible()
    // Regex (no /i flag) is case-sensitive: matches "TEDDY YEE · ending in …" but not "Teddy Yee"
    await expect(page.getByText(/TEDDY YEE/)).toBeVisible()
    await page.getByRole('button', { name: 'Place Order' }).click()

    // ---- Confirmation ----
    await expect(page).toHaveURL(/\/order-confirmation\//, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible()
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
    await page.getByPlaceholder('TARO YAMAMOTO').fill('TEDDY YEE')
    await page.getByPlaceholder('1234 5678 9012 3456').fill('4111 1111 1111 1111')
    await page.getByPlaceholder('MM/YY').fill('12/29')
    await page.getByPlaceholder('123', { exact: true }).fill('999')
    await page.getByRole('button', { name: 'Continue' }).click()

    // Place order
    await page.getByRole('button', { name: 'Place Order' }).click()
    await expect(page).toHaveURL(/\/order-confirmation\//, { timeout: 15_000 })

    // Verify key confirmation page elements
    await expect(page.getByText('Order Confirmed!')).toBeVisible()
    await expect(page.getByText('Items Ordered')).toBeVisible()
    await expect(page.getByText('Shipping To')).toBeVisible()
    await expect(page.getByText('Total Charged')).toBeVisible()
  })
})
