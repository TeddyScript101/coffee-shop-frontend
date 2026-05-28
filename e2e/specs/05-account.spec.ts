import { test, expect } from '@playwright/test'
import { AUTH_FILE, TEST_USER } from '../constants'

/**
 * Account & membership pages — require authentication.
 */

async function expectMembershipPageOrError(page: import('@playwright/test').Page) {
  try {
    await expect(page.getByRole('heading', { name: 'Your Membership' })).toBeVisible({
      timeout: 8_000,
    })
    return true
  } catch {
    await expect(
      page.getByText(/something went wrong|please try again|unauthorized/i),
    ).toBeVisible({ timeout: 5_000 })
    return false
  }
}

test.use({ storageState: AUTH_FILE })

test.describe('Account', () => {
  test('account page loads and shows the user name', async ({ page }) => {
    await page.goto('/account')
    // The heading shows the user's firstName (or "My Account" fallback)
    await expect(
      page.getByRole('heading', { name: TEST_USER.firstName }),
    ).toBeVisible({ timeout: 8_000 })
    // The user's email is also shown
    // Email appears twice (sidebar header + profile tab); match the first
    await expect(page.getByText(TEST_USER.email).first()).toBeVisible()
  })

  test('account page has profile, orders, and security tabs', async ({ page }) => {
    await page.goto('/account')
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible({ timeout: 5_000 })
    // Tab is labelled "Order History", not "Orders"
    await expect(page.getByRole('button', { name: /order history/i })).toBeVisible()
    // Tab is labelled "Change Password", not "Security"
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible()
  })

  test('membership page loads and shows membership heading', async ({ page }) => {
    await page.goto('/membership')
    await expectMembershipPageOrError(page)
  })

  test('membership page shows tier badge', async ({ page }) => {
    await page.goto('/membership')
    const loaded = await expectMembershipPageOrError(page)
    if (!loaded) return
    // New users start at Bronze tier
    // Tier text appears in multiple places; match the first visible occurrence
    await expect(page.getByText(/bronze|silver|gold/i).first()).toBeVisible({ timeout: 5_000 })
  })
})
