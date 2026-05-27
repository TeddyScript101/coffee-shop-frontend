import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { API_URL, APP_ORIGIN, TEST_USER } from './constants'

const _dir = dirname(fileURLToPath(import.meta.url))

/**
 * Runs once before all tests.
 * 1. Registers the shared test user (ignores 400/409 if already exists).
 * 2. Logs in to get a JWT.
 * 3. Writes a Playwright storageState JSON to e2e/.auth/user.json so tests
 *    that need auth can use `storageState: AUTH_FILE` without hitting the UI.
 */
export default async function globalSetup() {
  const authDir = join(_dir, '.auth')
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }

  // Register the test user — ignore if it already exists
  try {
    await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER),
    })
  } catch {
    // backend not running or already registered — handled below
  }

  // Login to get JWT
  const loginRes = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password }),
  })

  if (!loginRes.ok) {
    throw new Error(
      `E2E global setup: login failed (${loginRes.status}). ` +
      `Is the backend running at ${API_URL}?`,
    )
  }

  const { token } = (await loginRes.json()) as { token: string }

  // Build Playwright's storageState format directly — no browser needed
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: APP_ORIGIN,
        localStorage: [
          {
            name: 'coffee_shop_auth',
            value: JSON.stringify({
              state: {
                token,
                user: {
                  email: TEST_USER.email,
                  firstName: TEST_USER.firstName,
                  roles: [],
                },
                isAuthenticated: true,
              },
              version: 0,
            }),
          },
        ],
      },
    ],
  }

  fs.writeFileSync(
    join(authDir, 'user.json'),
    JSON.stringify(storageState, null, 2),
  )

  console.log('[E2E] Auth state saved to e2e/.auth/user.json')
}
