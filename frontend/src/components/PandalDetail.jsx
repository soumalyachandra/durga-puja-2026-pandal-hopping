import { useEffect } from 'react'
import { colorForLineName } from '../lib/metro'
import { ClockIcon, CloseIcon, ExternalIcon, PeopleIcon, PinIcon, TrainIcon, WalkIcon } from './Icons'
import { Lotus } from './Motifs'

function directionsUrl(pandal, userLocation) {
  const dest = `${pandal.location.lat},${pandal.location.lng}`
  const params = new URLSearchParams({ api: '1', destination: dest })
  if (userLocation) params.set('origin', `${userLocation.lat},${userLocation.lng}`)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export default function PandalDetail({ pandal, lines, onClose, onShowOnMap, userLocation }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const color = colorForLineName(pandal.nearest_metro.line, lines)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={pandal.name}
        onClick={(e) => e.stopPropagation()}
        style={{ '--line-color': color }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon width={22} height={22} />
        </button>

        <div className="modal-head">
          <h2 className="modal-title">{pandal.name}</h2>
          <p className="modal-sub">
            <PinIcon width={14} height={14} /> {pandal.address}
          </p>
          <div className="modal-tags">
            <span className="tag">{pandal.zone}</span>
            {pandal.established && <span className="tag">est. {pandal.established}</span>}
            <span className="tag tag--crowd">
              <PeopleIcon width={13} height={13} /> {pandal.crowd_level} crowds
            </span>
          </div>
        </div>

        <div className="modal-metro" style={{ borderColor: color }}>
          <span className="metro-chip" style={{ background: color }}>
            <TrainIcon width={14} height={14} /> {pandal.nearest_metro.station}
          </span>
          <span>
            <strong style={{ color }}>{pandal.nearest_metro.line} Line</strong> ·{' '}
            <WalkIcon width={13} height={13} /> ~{pandal.nearest_metro.walk_minutes} min walk
          </span>
          {pandal.alt_metro && pandal.alt_metro.length > 0 && (
            <span className="modal-alt">
              Alternatives: {pandal.alt_metro.map((a) => `${a.station} (${a.line} Line)`).join(', ')}
            </span>
          )}
        </div>

        <div className="modal-body">
          <h4><Lotus width={18} /> Known for</h4>
          <p>{pandal.famous_for}</p>

          <h4><Lotus width={18} /> Theme 2026</h4>
          <p>{pandal.theme}</p>

          <p className="modal-best">
            <ClockIcon width={14} height={14} /> Best time to visit: <strong>{pandal.best_time_to_visit}</strong>
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn--solid" onClick={() => onShowOnMap(pandal.id)}>
            Show on map
          </button>
          <a
            className="btn btn--ghost"
            href={directionsUrl(pandal, userLocation)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions in Google Maps <ExternalIcon width={15} height={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
