import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const _dir = dirname(fileURLToPath(import.meta.url))

export const API_URL = 'http://localhost:5046'
export const APP_ORIGIN = 'http://localhost:5173'

// Path to the Playwright storageState file created by global-setup
export const AUTH_FILE = join(_dir, '.auth/user.json')

export const TEST_USER = {
  email: 'e2e-test@beanworks.test',
  password: 'Test1234!',
  firstName: 'E2E',
  lastName: 'Tester',
}
