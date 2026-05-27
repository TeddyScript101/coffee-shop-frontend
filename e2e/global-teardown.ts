import { API_URL, TEST_USER } from './constants'

/**
 * Runs once after all tests.
 * Deletes the test account entirely — restores product stock for any orders,
 * then removes the user (DB cascade clears orders, order items, and membership).
 * The next test run's global-setup will re-register the account fresh.
 */
export default async function globalTeardown() {
  // Get a fresh JWT for the test user
  let token: string
  try {
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password }),
    })
    if (!loginRes.ok) {
      console.warn(`[E2E] Teardown: login failed (${loginRes.status}) — skipping cleanup`)
      return
    }
    ;({ token } = (await loginRes.json()) as { token: string })
  } catch {
    console.warn('[E2E] Teardown: backend unreachable — skipping cleanup')
    return
  }

  const res = await fetch(`${API_URL}/api/auth/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 204) {
    console.log('[E2E] Teardown: test account deleted (orders cleaned, stock restored)')
  } else {
    console.warn(`[E2E] Teardown: account deletion failed (${res.status})`)
  }
}
