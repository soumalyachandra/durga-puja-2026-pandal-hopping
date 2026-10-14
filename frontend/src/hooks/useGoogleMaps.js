// Loads the Google Maps JavaScript API exactly once and reports status.
// Status: 'no-key' | 'loading' | 'ready' | 'error'.
import { useEffect, useState } from 'react'
import { GOOGLE_MAPS_API_KEY } from '../config'

let loadPromise = null

function loadGoogleMapsScript(key) {
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    return Promise.resolve(window.google)
  }
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = '__onGoogleMapsReady__'
    window[callbackName] = () => resolve(window.google)

    const script = document.createElement('script')
    const params = new URLSearchParams({
      key,
      v: 'weekly',
      libraries: 'marker',
      callback: callbackName,
      loading: 'async',
    })
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('Failed to load the Google Maps script'))
    document.head.appendChild(script)
  })
  return loadPromise
}

export function useGoogleMaps() {
  const hasKey = Boolean(GOOGLE_MAPS_API_KEY)
  const [status, setStatus] = useState(hasKey ? 'loading' : 'no-key')
  const [google, setGoogle] = useState(
    typeof window !== 'undefined' ? window.google || null : null
  )

  useEffect(() => {
    if (!hasKey) {
      setStatus('no-key')
      return
    }
    let cancelled = false
    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then((g) => {
        if (cancelled) return
        setGoogle(g)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [hasKey])

  return { google, status }
}
