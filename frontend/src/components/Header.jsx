import { DurgaEyes } from './Motifs'

export default function Header({ offline }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <DurgaEyes className="brand-eyes" width={64} />
          <div className="brand-text">
            <span className="brand-bengali">আগমনী</span>
            <span className="brand-title">Durga Puja 2026 · Pandal Hopping</span>
          </div>
        </div>

        <nav className="header-nav" aria-label="Sections">
          <a href="#directory">Directory</a>
          <a href="#map-panel">Map</a>
          <a href="#route-planner">Metro Routes</a>
        </nav>

        {offline && (
          <span className="offline-pill" title="Backend API not reachable — showing bundled data.">
            Offline data
          </span>
        )}
      </div>
    </header>
  )
}
