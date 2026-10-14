import { useEffect, useState } from 'react'
import { Dhak, KashPhool, Shiuli, Trishul } from './Motifs'

function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`)
  const now = new Date()
  const ms = target - now
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

function formatRange(start, end) {
  const opts = { day: 'numeric', month: 'long' }
  try {
    const s = new Date(`${start}T00:00:00`).toLocaleDateString('en-IN', opts)
    const e = new Date(`${end}T00:00:00`).toLocaleDateString('en-IN', { ...opts, year: 'numeric' })
    return `${s} – ${e}`
  } catch {
    return `${start} – ${end}`
  }
}

export default function Hero({ festival, pandalCount }) {
  const [countdown, setCountdown] = useState(() => daysUntil(festival.start_date))

  useEffect(() => {
    setCountdown(daysUntil(festival.start_date))
    const id = setInterval(() => setCountdown(daysUntil(festival.start_date)), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [festival.start_date])

  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <Shiuli className="float-shiuli float-shiuli--1" width={38} />
      <Shiuli className="float-shiuli float-shiuli--2" width={28} />
      <Shiuli className="float-shiuli float-shiuli--3" width={32} />
      <Dhak className="float-dhak" width={72} />

      <div className="container hero-inner">
        <p className="hero-greeting">
          <Trishul className="hero-trishul" width={18} />
          শুভ শারদীয়া · Shubho Sharodiya
        </p>
        <h1 className="hero-title">
          Pandal Hopping across <span className="hl">Kolkata</span> &amp; <span className="hl">Howrah</span>
        </h1>
        <p className="hero-sub">
          The city's greatest festival, mapped. Discover the finest Durga Puja pandals,
          paired with their nearest Metro stations — then let Google Maps guide you
          door to door.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{pandalCount}</span>
            <span className="stat-label">Pandals mapped</span>
          </div>
          <div className="stat">
            <span className="stat-num">4</span>
            <span className="stat-label">Metro lines</span>
          </div>
          <div className="stat">
            <span className="stat-num">{festival ? formatRange(festival.start_date, festival.end_date) : ''}</span>
            <span className="stat-label">Shashthi → Dashami</span>
          </div>
          {countdown > 0 && (
            <div className="stat stat--accent">
              <span className="stat-num">{countdown}</span>
              <span className="stat-label">days to Shashthi</span>
            </div>
          )}
          {countdown <= 0 && countdown > -6 && (
            <div className="stat stat--accent">
              <span className="stat-num">Pujo!</span>
              <span className="stat-label">It's on now</span>
            </div>
          )}
        </div>
      </div>

      <div className="hero-kash" aria-hidden="true">
        <KashPhool width={180} className="kash kash--1" />
        <KashPhool width={150} className="kash kash--2" />
        <KashPhool width={200} className="kash kash--3" />
      </div>
    </section>
  )
}
