import { SearchIcon, TargetIcon } from './Icons'

export default function Controls({
  filters,
  setFilters,
  zones,
  lines,
  resultCount,
  totalCount,
  onReset,
  userLocation,
  onRequestLocation,
  locating,
  locationError,
}) {
  const setKey = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? '' : value }))

  const anyFilter = filters.zone || filters.line || filters.city || filters.q

  return (
    <section className="controls" id="directory" aria-label="Search and filters">
      <div className="controls-row">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="search"
            value={filters.q}
            placeholder="Search pandals, themes, metro stations…"
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            aria-label="Search pandals"
          />
        </div>

        <button
          type="button"
          className={`locate-btn ${userLocation ? 'is-on' : ''}`}
          onClick={onRequestLocation}
          disabled={locating}
        >
          <TargetIcon />
          {locating ? 'Locating…' : userLocation ? 'Location on' : 'Use my location'}
        </button>
      </div>

      {locationError && <p className="control-error">{locationError}</p>}

      <div className="chip-group" role="group" aria-label="Filter by zone">
        <span className="chip-label">Zone</span>
        {zones.map((z) => (
          <button
            key={z}
            type="button"
            className={`chip ${filters.zone === z ? 'chip--active' : ''}`}
            onClick={() => setKey('zone', z)}
          >
            {z}
          </button>
        ))}
      </div>

      <div className="chip-group" role="group" aria-label="Filter by metro line">
        <span className="chip-label">Metro line</span>
        {lines.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`chip chip--line ${filters.line === l.id ? 'chip--active' : ''}`}
            style={
              filters.line === l.id
                ? { background: l.color, borderColor: l.color, color: '#fff' }
                : { borderColor: l.color, color: l.color }
            }
            onClick={() => setKey('line', l.id)}
          >
            <span className="chip-dot" style={{ background: filters.line === l.id ? '#fff' : l.color }} />
            {l.name}
          </button>
        ))}
      </div>

      <div className="controls-footer">
        <p className="result-count">
          Showing <strong>{resultCount}</strong> of {totalCount} pandals
        </p>
        {anyFilter && (
          <button type="button" className="link-btn" onClick={onReset}>
            Clear all filters
          </button>
        )}
      </div>
    </section>
  )
}
