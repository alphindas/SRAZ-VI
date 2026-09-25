import { motion } from 'framer-motion'

/**
 * SRAZVI® wordmark: green "SRAZ" with a gold "VI" set tight against the Z (no gap).
 * `textLength` pins the letter widths so the gold VI always meets the Z,
 * whichever font finally renders.
 */
export function LogoMark({ light = false, animated = false, className = 'h-9 w-auto' }) {
  const green = light ? '#FBF6F0' : '#0f4a33'
  const gid = light ? 'logo-gold-l' : animated ? 'logo-gold-a' : 'logo-gold'
  const font = '"Cormorant Garamond", "Playfair Display", Georgia, serif'

  // Staggered entrance used by the loading screen.
  const part = (i, from = { y: 10 }) =>
    animated
      ? {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, x: 0, y: 0 },
          transition: { duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
        }
      : {}

  return (
    <svg viewBox="0 0 154 46" className={className} role="img" aria-label="SRAZVI">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#b57c1c" />
        </linearGradient>
      </defs>
      <motion.g {...part(0)}>
        <text x="0" y="40" fontFamily={font} fontSize="58" fontWeight="500" fill={green}>
          S
        </text>
      </motion.g>
      <motion.g {...part(1)}>
        <text
          x="27"
          y="40"
          fontFamily={font}
          fontSize="44"
          fontWeight="500"
          fill={green}
          textLength="78"
          lengthAdjust="spacingAndGlyphs"
        >
          RAZ
        </text>
      </motion.g>
      <motion.g {...part(2, { y: -14 })}>
        <g fill={`url(#${gid})`} transform="translate(-4.5 0)">
          {/* V: heavy left arm, hairline right arm, touching the Z */}
          <polygon points="105,12.5 115.5,12.5 124.6,34 130,12.5 133.4,12.5 124.6,40 121.6,40" />
          <rect x="102.5" y="11.6" width="15.5" height="1.5" />
          <rect x="128.2" y="11.6" width="7" height="1.5" />
          {/* I */}
          <rect x="137" y="12.4" width="4.3" height="27.6" />
          <rect x="134.4" y="11.6" width="9.5" height="1.5" />
          <rect x="134.4" y="38.6" width="9.5" height="1.5" />
        </g>
      </motion.g>
      <motion.g {...part(3, { y: 0 })}>
        <circle cx="147" cy="10" r="4.6" fill="none" stroke={green} strokeWidth="0.9" />
        <text x="147" y="12.4" fontSize="6.4" fontFamily="Georgia, serif" textAnchor="middle" fill={green}>
          R
        </text>
      </motion.g>
    </svg>
  )
}

export function Logo({ light = false, className = '' }) {
  return (
    <a
      href="#/"
      aria-label="SRAZVI, home"
      className={`inline-flex items-center select-none transition-opacity hover:opacity-85 ${className}`}
    >
      <LogoMark light={light} />
    </a>
  )
}
