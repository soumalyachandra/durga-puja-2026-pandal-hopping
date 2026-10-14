// Hand-drawn SVG motifs that carry the Durga Puja visual identity.
// All are inline SVG (no external assets), inherit color via props, and are
// decorative — marked aria-hidden unless given a title.

export function DurgaEyes({ className = '', width = 180 }) {
  // Maa Durga's "chokkhu" — the signature almond eyes + third eye + bindi.
  return (
    <svg
      className={className}
      width={width}
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden="true"
    >
      {/* Third eye / tilak */}
      <path
        d="M100 6 C110 20 110 34 100 48 C90 34 90 20 100 6 Z"
        fill="#C1121F"
      />
      <circle cx="100" cy="30" r="4" fill="#F4A300" />

      {/* Brow line */}
      <path
        d="M18 54 C50 40 78 44 100 58 C122 44 150 40 182 54"
        stroke="#7A0A12"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {[-1, 1].map((side) => (
        <g key={side} transform={side === -1 ? '' : 'translate(200,0) scale(-1,1)'}>
          {/* Eye white */}
          <path
            d="M20 78 C40 60 72 60 92 78 C72 96 40 96 20 78 Z"
            fill="#FFF8F0"
            stroke="#7A0A12"
            strokeWidth="3.5"
          />
          {/* Iris */}
          <circle cx="60" cy="78" r="15" fill="#C1121F" />
          <circle cx="60" cy="78" r="7.5" fill="#2A0A0A" />
          <circle cx="63" cy="74.5" r="2.6" fill="#FFF8F0" />
          {/* Lashes */}
          <path d="M20 78 C14 74 10 72 6 70" stroke="#7A0A12" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 90 C22 93 19 95 15 97" stroke="#7A0A12" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}

export function Dhak({ className = '', width = 60 }) {
  // The dhak — the barrel drum whose beat defines the festival.
  return (
    <svg className={className} width={width} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g transform="rotate(-12 50 50)">
        <ellipse cx="50" cy="26" rx="30" ry="12" fill="#F4A300" stroke="#7A0A12" strokeWidth="3" />
        <path d="M20 26 L24 74 C24 82 76 82 76 74 L80 26" fill="#C1121F" stroke="#7A0A12" strokeWidth="3" />
        <ellipse cx="50" cy="74" rx="26" ry="10" fill="#9B0A14" stroke="#7A0A12" strokeWidth="3" />
        {/* Lacing */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={22 + i * 11}
            y1="30"
            x2={26 + i * 11}
            y2="70"
            stroke="#FFD56B"
            strokeWidth="2"
          />
        ))}
      </g>
      {/* Stick */}
      <line x1="78" y1="8" x2="52" y2="40" stroke="#7A0A12" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Shiuli({ className = '', width = 44 }) {
  // Shiuli / night-jasmine — white petals, saffron heart. The flower of autumn.
  return (
    <svg className={className} width={width} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="30"
          cy="16"
          rx="6.5"
          ry="13"
          fill="#FFFDF8"
          stroke="#F0E3CE"
          strokeWidth="1"
          transform={`rotate(${deg} 30 30)`}
        />
      ))}
      <circle cx="30" cy="30" r="7.5" fill="#EF6C00" />
      <circle cx="30" cy="30" r="3.5" fill="#F4A300" />
    </svg>
  )
}

export function KashPhool({ className = '', width = 120 }) {
  // Kash phool — the white riverbank reeds that signal Ma is coming home.
  return (
    <svg className={className} width={width} viewBox="0 0 120 90" fill="none" aria-hidden="true">
      {[18, 40, 62, 84, 104].map((x, i) => {
        const bend = i % 2 === 0 ? 8 : -6
        return (
          <g key={x}>
            <path
              d={`M${x} 90 C${x + bend} 60 ${x + bend} 40 ${x + bend * 1.5} 20`}
              stroke="#C9A227"
              strokeWidth="2"
              fill="none"
            />
            <ellipse
              cx={x + bend * 1.5}
              cy="16"
              rx="7"
              ry="15"
              fill="#FFFDF8"
              opacity="0.95"
              transform={`rotate(${bend} ${x + bend * 1.5} 16)`}
            />
          </g>
        )
      })}
    </svg>
  )
}

export function Lotus({ className = '', width = 26 }) {
  return (
    <svg className={className} width={width} viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <path d="M24 30 C24 14 24 6 24 4 C30 10 32 20 30 30 Z" fill="#F4A300" />
      <path d="M24 30 C24 14 24 6 24 4 C18 10 16 20 18 30 Z" fill="#F4A300" />
      <path d="M24 30 C30 16 40 12 46 12 C44 22 36 29 24 30 Z" fill="#E86A33" />
      <path d="M24 30 C18 16 8 12 2 12 C4 22 12 29 24 30 Z" fill="#E86A33" />
      <path d="M24 30 C26 20 32 15 40 13 C39 22 33 28 24 30 Z" fill="#C1121F" opacity="0.85" />
      <path d="M24 30 C22 20 16 15 8 13 C9 22 15 28 24 30 Z" fill="#C1121F" opacity="0.85" />
    </svg>
  )
}

export function Trishul({ className = '', width = 24 }) {
  return (
    <svg className={className} width={width} viewBox="0 0 40 100" fill="none" aria-hidden="true">
      <line x1="20" y1="34" x2="20" y2="96" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 34 C8 16 12 10 20 4 C28 10 32 16 32 34" stroke="currentColor" strokeWidth="4" fill="none" />
      <line x1="8" y1="34" x2="8" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="34" x2="32" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="2.5" r="2.5" fill="currentColor" />
    </svg>
  )
}

// A scalloped "torana" bunting divider used between sections.
export function ToranaDivider({ className = '' }) {
  return (
    <div className={`torana ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 28" preserveAspectRatio="none" width="100%" height="28">
        <defs>
          <linearGradient id="toranaGold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFD56B" />
            <stop offset="100%" stopColor="#E8A51C" />
          </linearGradient>
        </defs>
        {/* Gold top band */}
        <rect x="0" y="0" width="1200" height="4" fill="url(#toranaGold)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = i * 50
          return (
            <path
              key={i}
              d={`M${x} 2 Q${x + 25} 40 ${x + 50} 2 Z`}
              fill="url(#toranaGold)"
              stroke="#C1121F"
              strokeWidth="1.5"
            />
          )
        })}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={`d${i}`} cx={i * 50 + 25} cy="24" r="2.5" fill="#C1121F" />
        ))}
      </svg>
    </div>
  )
}
