// Central runtime configuration, driven by Vite env vars (VITE_*).
// Copy .env.example to .env and fill these in.

// Base URL of the backend API. No trailing slash.
// - Unset  -> defaults to http://localhost:8000 (local `uvicorn` dev).
// - Empty "" -> relative/same-origin (used by the Docker setup, where nginx
//   reverse-proxies /api to the backend — no CORS, no baked-in host/IP).
const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL === undefined
    ? 'http://localhost:8000'
    : import.meta.env.VITE_API_BASE_URL
export const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '')

// Google Maps JavaScript API key. Leave blank to run without live maps —
// the directory, filters and route planner still work; the map area shows
// setup instructions instead.
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Map defaults — central Kolkata.
export const KOLKATA_CENTER = { lat: 22.5726, lng: 88.3639 }
export const DEFAULT_ZOOM = 12
