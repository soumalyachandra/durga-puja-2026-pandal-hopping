import { Lotus } from './Motifs'

export default function Footer({ lines, offline, festival }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3 className="footer-h">
            <Lotus width={22} /> Durga Puja 2026
          </h3>
          <p className="footer-p">
            A festive guide to pandal hopping across Kolkata &amp; Howrah.
            {festival ? ` Celebrations run ${festival.start_date} to ${festival.end_date}.` : ''}
          </p>
          {offline && (
            <p className="footer-note">
              Showing bundled sample data — the backend API was not reachable.
            </p>
          )}
        </div>

        <div className="footer-col">
          <h3 className="footer-h">Metro lines</h3>
          <ul className="legend">
            {lines.map((l) => (
              <li key={l.id}>
                <span className="legend-dot" style={{ background: l.color }} />
                <span>
                  <strong>{l.name}</strong> — {l.route}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-h">Good to know</h3>
          <p className="footer-p">
            Pandal locations and metro pairings are approximate and best-effort.
            Kolkata Metro's Orange &amp; Purple lines are only partially open —
            always re-confirm timings and routes before you set out. Travel safe,
            and <em>Asche bochor abar hobe!</em>
          </p>
        </div>
      </div>
      <div className="footer-base">
        <span>Made with devotion for the City of Joy.</span>
      </div>
    </footer>
  )
}
