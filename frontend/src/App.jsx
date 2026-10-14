import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchHealth, fetchMetroLines, fetchPandals } from './api'
import { FESTIVAL, METRO_LINES, PANDALS } from './data/fallbackData'
import { useGoogleMaps } from './hooks/useGoogleMaps'

import Header from './components/Header'
import Hero from './components/Hero'
import Controls from './components/Controls'
import PandalGrid from './components/PandalGrid'
import MapPanel from './components/MapPanel'
import RoutePlanner from './components/RoutePlanner'
import PandalDetail from './components/PandalDetail'
import Footer from './components/Footer'
import { ToranaDivider } from './components/Motifs'

const EMPTY_FILTERS = { zone: '', line: '', city: '', q: '' }

export default function App() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready'
  const [offline, setOffline] = useState(false)
  const [festival, setFestival] = useState(FESTIVAL)
  const [pandals, setPandals] = useState([])
  const [lines, setLines] = useState([])

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState(null)
  const [detailId, setDetailId] = useState(null)

  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const maps = useGoogleMaps()

  // ---- Load data (API first, bundled fallback if unreachable) ----
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [health, pandalsRes, linesRes] = await Promise.all([
          fetchHealth(),
          fetchPandals(),
          fetchMetroLines(),
        ])
        if (cancelled) return
        setFestival(health.festival || FESTIVAL)
        setPandals(pandalsRes.pandals || [])
        setLines(linesRes.lines || [])
        setOffline(false)
      } catch {
        if (cancelled) return
        setFestival(FESTIVAL)
        setPandals(PANDALS)
        setLines(METRO_LINES)
        setOffline(true)
      } finally {
        if (!cancelled) setStatus('ready')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // ---- Geolocation ----
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocationError(err.message || 'Could not determine your location.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  // ---- Derived ----
  const zones = useMemo(() => {
    const order = ['North Kolkata', 'South Kolkata', 'Salt Lake & East', 'Howrah']
    const present = new Set(pandals.map((p) => p.zone))
    return order.filter((z) => present.has(z))
  }, [pandals])

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return pandals.filter((p) => {
      if (filters.zone && p.zone !== filters.zone) return false
      if (filters.city && p.city !== filters.city) return false
      if (filters.line) {
        const onLine =
          p.nearest_metro.line.toLowerCase() === filters.line ||
          (p.alt_metro || []).some((a) => a.line.toLowerCase() === filters.line)
        if (!onLine) return false
      }
      if (q) {
        const hay = [
          p.name,
          p.famous_for,
          p.theme,
          p.address,
          p.nearest_metro.station,
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [pandals, filters])

  const selectedPandal = useMemo(
    () => pandals.find((p) => p.id === selectedId) || null,
    [pandals, selectedId]
  )
  const detailPandal = useMemo(
    () => pandals.find((p) => p.id === detailId) || null,
    [pandals, detailId]
  )

  const handleSelect = useCallback((id) => {
    setSelectedId(id)
  }, [])

  const handleShowOnMap = useCallback((id) => {
    setSelectedId(id)
    setDetailId(null)
    const el = document.getElementById('map-panel')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), [])

  if (status === 'loading') {
    return (
      <div className="app-loading">
        <div className="chakra-spinner" aria-hidden="true" />
        <p>Lighting the pradeep…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header offline={offline} />
      <Hero festival={festival} pandalCount={pandals.length} />

      <main className="container">
        <Controls
          filters={filters}
          setFilters={setFilters}
          zones={zones}
          lines={lines}
          resultCount={filtered.length}
          totalCount={pandals.length}
          onReset={resetFilters}
          userLocation={userLocation}
          onRequestLocation={requestLocation}
          locating={locating}
          locationError={locationError}
        />

        <section className="layout">
          <div className="list-col">
            <PandalGrid
              pandals={filtered}
              lines={lines}
              selectedId={selectedId}
              onSelect={handleSelect}
              onOpenDetail={setDetailId}
            />
          </div>

          <aside className="map-col" id="map-panel">
            <MapPanel
              maps={maps}
              pandals={filtered}
              selectedPandal={selectedPandal}
              onSelect={handleSelect}
              userLocation={userLocation}
              onRequestLocation={requestLocation}
              locating={locating}
            />
          </aside>
        </section>

        <ToranaDivider className="section-gap" />

        <RoutePlanner
          pandals={pandals}
          lines={lines}
          onOpenDetail={setDetailId}
          onShowOnMap={handleShowOnMap}
        />
      </main>

      <Footer lines={lines} offline={offline} festival={festival} />

      {detailPandal && (
        <PandalDetail
          pandal={detailPandal}
          lines={lines}
          onClose={() => setDetailId(null)}
          onShowOnMap={handleShowOnMap}
          userLocation={userLocation}
        />
      )}
    </div>
  )
}
