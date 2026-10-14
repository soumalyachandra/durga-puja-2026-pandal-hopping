import { colorForLineName } from '../lib/metro'
import { ClockIcon, PeopleIcon, PinIcon, TrainIcon, WalkIcon } from './Icons'

const crowdClass = (level) =>
  'crowd--' + (level || '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

export default function PandalCard({ pandal, lines, selected, onSelect, onOpenDetail }) {
  const color = colorForLineName(pandal.nearest_metro.line, lines)

  return (
    <article
      className={`pandal-card ${selected ? 'is-selected' : ''}`}
      style={{ '--line-color': color }}
      onClick={() => onSelect(pandal.id)}
    >
      <div className="card-top">
        <div className="card-heads">
          <h3 className="card-title">{pandal.name}</h3>
          <p className="card-zone">
            <PinIcon width={14} height={14} /> {pandal.zone}
            {pandal.established ? <span className="card-est"> · est. {pandal.established}</span> : null}
          </p>
        </div>
        <span className={`crowd-badge ${crowdClass(pandal.crowd_level)}`}>
          <PeopleIcon width={13} height={13} /> {pandal.crowd_level}
        </span>
      </div>

      <div className="metro-row">
        <span className="metro-chip" style={{ background: color }}>
          <TrainIcon width={14} height={14} /> {pandal.nearest_metro.station}
        </span>
        <span className="metro-line-name" style={{ color }}>
          {pandal.nearest_metro.line} Line
        </span>
        <span className="walk">
          <WalkIcon width={14} height={14} /> ~{pandal.nearest_metro.walk_minutes} min
        </span>
      </div>

      {pandal.alt_metro && pandal.alt_metro.length > 0 && (
        <p className="alt-metro">
          also near {pandal.alt_metro.map((a) => `${a.station} (${a.line})`).join(', ')}
        </p>
      )}

      <p className="card-famous">{pandal.famous_for}</p>

      <p className="card-best">
        <ClockIcon width={13} height={13} /> Best time: {pandal.best_time_to_visit}
      </p>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail(pandal.id)
          }}
        >
          Details
        </button>
        <button
          type="button"
          className="btn btn--solid"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(pandal.id)
            const el = document.getElementById('map-panel')
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          Show on map
        </button>
      </div>
    </article>
  )
}
