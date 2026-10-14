import { useMemo, useState } from 'react'
import { suggestRoute } from '../lib/routes'
import { RouteIcon, TrainIcon, WalkIcon } from './Icons'

export default function RoutePlanner({ pandals, lines, onOpenDetail, onShowOnMap }) {
  const routesByLine = useMemo(() => {
    const map = {}
    for (const l of lines) map[l.id] = suggestRoute(l.id, pandals, lines)
    return map
  }, [pandals, lines])

  const defaultLine = useMemo(() => {
    const withStops = lines.find((l) => routesByLine[l.id]?.stop_count > 0)
    return (withStops || lines[0])?.id
  }, [lines, routesByLine])

  const [activeLine, setActiveLine] = useState(defaultLine)
  const current = routesByLine[activeLine] || routesByLine[defaultLine]
  const activeMeta = lines.find((l) => l.id === (activeLine || defaultLine))

  if (!current || !activeMeta) return null

  return (
    <section className="route-planner" id="route-planner">
      <div className="section-head">
        <h2 className="section-title">
          <RouteIcon width={24} height={24} /> Plan a Metro-line crawl
        </h2>
        <p className="section-desc">
          Pick a line and we'll sequence its pandals in station order — one tidy,
          walkable itinerary from one end of the line to the other.
        </p>
      </div>

      <div className="line-tabs" role="tablist" aria-label="Metro lines">
        {lines.map((l) => {
          const count = routesByLine[l.id]?.stop_count || 0
          const active = (activeLine || defaultLine) === l.id
          return (
            <button
              key={l.id}
              role="tab"
              aria-selected={active}
              className={`line-tab ${active ? 'line-tab--active' : ''}`}
              style={active ? { background: l.color, borderColor: l.color } : { borderColor: l.color, color: l.color }}
              onClick={() => setActiveLine(l.id)}
            >
              {l.name}
              <span className="line-tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="route-body" style={{ '--line-color': activeMeta.color }}>
        <p className="route-notes">
          <span className="route-line-badge" style={{ background: activeMeta.color }}>
            {activeMeta.name}
          </span>
          {current.notes}
        </p>

        {current.stop_count === 0 ? (
          <p className="muted">No seed pandals are mapped to this line yet.</p>
        ) : (
          <ol className="timeline">
            {current.stops.map((stop) => (
              <li key={stop.pandal.id} className="timeline-item">
                <div className="timeline-marker" style={{ background: activeMeta.color }}>
                  {stop.order}
                </div>
                <div className="timeline-content">
                  <div className="timeline-station">
                    <TrainIcon width={14} height={14} /> {stop.station}
                    <span className="timeline-walk">
                      <WalkIcon width={13} height={13} /> ~{stop.walk_minutes} min to pandal
                    </span>
                  </div>
                  <h4 className="timeline-pandal">{stop.pandal.name}</h4>
                  <p className="timeline-famous">{stop.pandal.famous_for}</p>
                  <div className="timeline-actions">
                    <button type="button" className="link-btn" onClick={() => onOpenDetail(stop.pandal.id)}>
                      Details
                    </button>
                    <button type="button" className="link-btn" onClick={() => onShowOnMap(stop.pandal.id)}>
                      Show on map
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
