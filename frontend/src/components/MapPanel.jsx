import { useEffect, useRef, useState } from 'react'
import { DEFAULT_ZOOM, KOLKATA_CENTER } from '../config'
import { colorForLineName } from '../lib/metro'
import { TargetIcon } from './Icons'

const TRAVEL_MODES = [
  { id: 'DRIVING', label: 'Drive' },
  { id: 'TRANSIT', label: 'Transit' },
  { id: 'WALKING', label: 'Walk' },
]

// A soft, warm map style so the map sits inside the festive palette.
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#fbf5ec' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b4f3a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fffaf2' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfe3df' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dcebcf' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )
}

export default function MapPanel({
  maps,
  pandals,
  selectedPandal,
  onSelect,
  userLocation,
  onRequestLocation,
  locating,
}) {
  const { google, status } = maps

  const mapDivRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const dirServiceRef = useRef(null)
  const dirRendererRef = useRef(null)
  const userMarkerRef = useRef(null)
  const infoRef = useRef(null)

  const [mapReady, setMapReady] = useState(false)
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [eta, setEta] = useState(null)
  const [dirError, setDirError] = useState('')

  // --- Initialise the map once ---
  useEffect(() => {
    if (status !== 'ready' || !google || !mapDivRef.current || mapRef.current) return
    mapRef.current = new google.maps.Map(mapDivRef.current, {
      center: KOLKATA_CENTER,
      zoom: DEFAULT_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: MAP_STYLE,
    })
    dirServiceRef.current = new google.maps.DirectionsService()
    dirRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#C1121F', strokeWeight: 5, strokeOpacity: 0.85 },
    })
    infoRef.current = new google.maps.InfoWindow()
    setMapReady(true)
  }, [status, google])

  // --- (Re)build pandal markers ---
  useEffect(() => {
    if (!mapReady || !google) return
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const bounds = new google.maps.LatLngBounds()
    pandals.forEach((p) => {
      const selected = selectedPandal && selectedPandal.id === p.id
      const color = colorForLineName(p.nearest_metro.line, [])
      const marker = new google.maps.Marker({
        position: p.location,
        map: mapRef.current,
        title: p.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: selected ? 11 : 7.5,
          fillColor: selected ? '#C1121F' : color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: selected ? 999 : 1,
      })
      marker.addListener('click', () => onSelect(p.id))
      markersRef.current.push(marker)
      bounds.extend(p.location)
    })

    if (userLocation) bounds.extend(userLocation)
    if (pandals.length > 0 && !selectedPandal && !userLocation) {
      mapRef.current.fitBounds(bounds, 48)
    }
  }, [mapReady, google, pandals, selectedPandal, userLocation, onSelect])

  // --- Pan to selection + info window ---
  useEffect(() => {
    if (!mapReady || !google || !selectedPandal) {
      if (infoRef.current) infoRef.current.close()
      return
    }
    mapRef.current.panTo(selectedPandal.location)
    if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15)

    infoRef.current.setContent(
      `<div class="gm-info"><strong>${escapeHtml(selectedPandal.name)}</strong><br/>` +
        `Nearest Metro: ${escapeHtml(selectedPandal.nearest_metro.station)} ` +
        `(${escapeHtml(selectedPandal.nearest_metro.line)} Line)</div>`
    )
    const idx = pandals.findIndex((p) => p.id === selectedPandal.id)
    if (idx >= 0 && markersRef.current[idx]) {
      infoRef.current.open(mapRef.current, markersRef.current[idx])
    }
  }, [mapReady, google, selectedPandal, pandals])

  // --- User location marker ---
  useEffect(() => {
    if (!mapReady || !google) return
    if (!userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null)
        userMarkerRef.current = null
      }
      return
    }
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(userLocation)
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: userLocation,
        map: mapRef.current,
        title: 'You are here',
        zIndex: 500,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#1565C0',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      })
    }
  }, [mapReady, google, userLocation])

  // --- Directions + ETA ---
  useEffect(() => {
    if (!mapReady || !google) return
    if (!selectedPandal || !userLocation) {
      if (dirRendererRef.current) dirRendererRef.current.set('directions', null)
      setEta(null)
      setDirError('')
      return
    }
    setDirError('')
    dirServiceRef.current.route(
      {
        origin: userLocation,
        destination: selectedPandal.location,
        travelMode: google.maps.TravelMode[travelMode],
      },
      (result, st) => {
        if (st === 'OK' && result.routes[0]) {
          dirRendererRef.current.setDirections(result)
          const leg = result.routes[0].legs[0]
          setEta({
            distance: leg.distance ? leg.distance.text : '—',
            duration: leg.duration ? leg.duration.text : '—',
          })
        } else {
          dirRendererRef.current.set('directions', null)
          setEta(null)
          setDirError(
            st === 'ZERO_RESULTS'
              ? 'No route found for this travel mode.'
              : `Directions unavailable (${st}).`
          )
        }
      }
    )
  }, [mapReady, google, selectedPandal, userLocation, travelMode])

  const recenter = () => {
    if (!mapReady || !google || pandals.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    pandals.forEach((p) => bounds.extend(p.location))
    if (userLocation) bounds.extend(userLocation)
    mapRef.current.fitBounds(bounds, 48)
  }

  // ---------- Render ----------
  if (status === 'no-key') {
    return (
      <div className="map-shell">
        <div className="map-placeholder">
          <h3>Live map is switched off</h3>
          <p>
            Add a Google Maps API key to unlock the interactive map, live routing
            and ETAs. Create <code>frontend/.env</code> with:
          </p>
          <pre>VITE_GOOGLE_MAPS_API_KEY=your_key_here</pre>
          <p className="muted">
            The directory, filters and metro route planner all work without a key.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="map-shell">
        <div className="map-placeholder map-placeholder--error">
          <h3>Couldn't load Google Maps</h3>
          <p>
            Check that your API key is valid and that the <em>Maps JavaScript API</em>{' '}
            and <em>Directions API</em> are enabled, with billing active.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="map-shell">
      <div className="map-toolbar">
        <div className="travel-modes" role="group" aria-label="Travel mode">
          {TRAVEL_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`tmode ${travelMode === m.id ? 'tmode--active' : ''}`}
              onClick={() => setTravelMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button type="button" className="map-recenter" onClick={recenter}>
          Recenter
        </button>
      </div>

      <div className="map-canvas" ref={mapDivRef}>
        {status === 'loading' && <div className="map-loading">Loading map…</div>}
      </div>

      <div className="map-readout">
        {!userLocation && (
          <button type="button" className="btn btn--solid full" onClick={onRequestLocation} disabled={locating}>
            <TargetIcon width={16} height={16} />
            {locating ? 'Locating…' : 'Use my location for distance & ETA'}
          </button>
        )}

        {userLocation && !selectedPandal && (
          <p className="readout-hint">Select a pandal to see live distance, ETA and the route.</p>
        )}

        {userLocation && selectedPandal && eta && (
          <div className="eta-card">
            <div className="eta-head">
              Route to <strong>{selectedPandal.name}</strong>
            </div>
            <div className="eta-metrics">
              <div>
                <span className="eta-value">{eta.duration}</span>
                <span className="eta-key">ETA ({travelMode.toLowerCase()})</span>
              </div>
              <div>
                <span className="eta-value">{eta.distance}</span>
                <span className="eta-key">distance</span>
              </div>
            </div>
          </div>
        )}

        {userLocation && selectedPandal && dirError && <p className="control-error">{dirError}</p>}
      </div>
    </div>
  )
}
