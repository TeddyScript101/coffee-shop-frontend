import axios from 'axios'

const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] as string ?? 'http://localhost:5046'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('coffee_shop_auth')
  if (raw) {
    try {
      const state = JSON.parse(raw) as { state?: { token?: string | null } }
      const token = state?.state?.token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    } catch {
      // malformed storage — ignore
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Skip redirect when already on an auth page — those pages handle 401 themselves
      const onAuthPage = ['/login', '/register'].some(p => window.location.pathname.startsWith(p))
      if (!onAuthPage) {
        localStorage.removeItem('coffee_shop_auth')
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    return Promise.reject(error)
  },
)
