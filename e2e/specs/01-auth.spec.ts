import { test, expect } from '@playwright/test'
import { TEST_USER } from '../constants'

/**
 * Auth flows — login, register, and PrivateRoute redirect.
 * No auth state pre-loaded; all tests start unauthenticated.
 */
test.describe('Auth', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('wrong credentials show error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('nobody@nowhere.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    // Backend takes ~7 s to return 401 for wrong credentials; raise timeout accordingly
    await expect(page.getByRole('alert')).toContainText('Invalid email or password', { timeout: 15_000 })
  })

  test('valid credentials redirect to home', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password').fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/')
  })

  test('login with redirect param goes to the right page after login', async ({ page }) => {
    await page.goto('/login?redirect=/cart')
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password').fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/cart')
  })

  test('register with a new email auto-logs-in and redirects home', async ({ page }) => {
    const uniqueEmail = `e2e-reg-${Date.now()}@beanworks.test`
    await page.goto('/register')
    await page.getByLabel('First name').fill('New')
    await page.getByLabel('Last name').fill('User')
    await page.getByLabel('Email').fill(uniqueEmail)
    await page.getByLabel('Password').fill('Test1234!')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page).toHaveURL('/')
  })

  test('/account without auth redirects to /login', async ({ page }) => {
    await page.goto('/account')
    await expect(page).toHaveURL(/\/login\?redirect=/)
  })

  test('/checkout without auth redirects to /login', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveURL(/\/login\?redirect=/)
  })

  test('/membership without auth redirects to /login', async ({ page }) => {
    await page.goto('/membership')
    await expect(page).toHaveURL(/\/login\?redirect=/)
  })
})
