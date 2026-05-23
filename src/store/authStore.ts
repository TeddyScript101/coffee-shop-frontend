import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface JwtClaims {
  email?: string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[]
  given_name?: string
  family_name?: string
  exp?: number
}

interface AuthUser {
  email: string
  firstName: string
  roles: string[]
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string) => {
        try {
          const claims = jwtDecode<JwtClaims>(token)
          const email =
            claims.email ??
            claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
            ''
          const rolesRaw = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          const roles = rolesRaw ? (Array.isArray(rolesRaw) ? rolesRaw : [rolesRaw]) : []
          const firstName = claims.given_name ?? email.split('@')[0] ?? ''

          set({ token, user: { email, firstName, roles }, isAuthenticated: true })
        } catch {
          set({ token, user: null, isAuthenticated: true })
        }
      },

      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'coffee_shop_auth' },
  ),
)
