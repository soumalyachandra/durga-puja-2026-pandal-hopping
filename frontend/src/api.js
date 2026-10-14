// Thin API client for the backend. Each call has a short timeout so the UI can
// fall back to bundled data quickly when no backend is reachable.
import { API_BASE_URL } from './config'

async function getJSON(path, { timeout = 6000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

export const fetchHealth = () => getJSON('/api/health')
export const fetchPandals = () => getJSON('/api/pandals')
export const fetchMetroLines = () => getJSON('/api/metro-lines')
export const fetchRoutes = () => getJSON('/api/routes')
