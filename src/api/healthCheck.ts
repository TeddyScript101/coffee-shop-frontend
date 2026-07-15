/**
 * Health check via same-origin proxy endpoint.
 *
 * In production:  /api/health  → Vercel rewrite → onrender.com/health
 * In development: /api/health  → Vite proxy     → localhost:5046/health
 *
 * Using a same-origin URL means Brave Shields and other blockers
 * never see a cross-origin request to the backend domain.
 */
export async function checkHealth(timeoutMs = 5000): Promise<void> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch('/api/health', { signal: controller.signal })
    if (!res.ok) throw new Error(`Health check returned ${res.status}`)
  } finally {
    clearTimeout(timer)
  }
}
