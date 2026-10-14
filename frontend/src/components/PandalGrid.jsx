import PandalCard from './PandalCard'
import { Shiuli } from './Motifs'

export default function PandalGrid({ pandals, lines, selectedId, onSelect, onOpenDetail }) {
  if (pandals.length === 0) {
    return (
      <div className="empty-state">
        <Shiuli width={54} />
        <h3>No pandals match your filters</h3>
        <p>Try clearing a filter or searching for a different name or metro station.</p>
      </div>
    )
  }

  return (
    <div className="pandal-grid">
      {pandals.map((p) => (
        <PandalCard
          key={p.id}
          pandal={p}
          lines={lines}
          selected={selectedId === p.id}
          onSelect={onSelect}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  )
}
