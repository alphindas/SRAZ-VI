import { SAMPLE } from '../data'
import { PatternBg } from './art'
import { Magnetic, TextReveal, ripple } from './fx'

export { Logo } from './logo'

const ICONS = {
  antiride: (
    <>
      <path d="M6 4h12M6 20h12" />
      <path d="M12 8v8m0 0-3-3m3 3 3-3" />
    </>
  ),
  breathe: (
    <>
      <path d="M3 9h11a3 3 0 1 0-3-3" />
      <path d="M3 15h15a3 3 0 1 1-3 3" />
      <path d="M3 12h7" />
    </>
  ),
  move: (
    <>
      <path d="M4 12h16m0 0-4-4m4 4-4 4" />
      <path d="M8 8l-4 4 4 4" />
    </>
  ),
  band: <path d="M4 8h16M4 12h16M4 16h16" />,
  slit: (
    <>
      <path d="M12 4 5 20h14L12 4z" />
      <path d="M12 4v9" />
    </>
  ),
  shades: (
    <>
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="m5 12 5 5L20 7" />,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
    </>
  ),
  flip: (
    <>
      <path d="M4 9a8 8 0 0 1 14-3l2 2" />
      <path d="M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2" />
      <path d="M4 20v-4h4" />
    </>
  ),
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

export function SampleTag({ className = '' }) {
  if (!SAMPLE) return null
  return (
    <span
      className={`inline-block rounded-full border border-vi/50 bg-vi-soft/60 px-2.5 py-0.5 text-xs text-[#7a5510] ${className}`}
    >
      Sample data, replace with real results
    </span>
  )
}

/** Pill button with a click ripple. `magnetic` makes it drift toward the cursor, `glow` adds a soft pulse. */
export function Button({ href, onClick, variant = 'solid', children, type, magnetic = false, glow = false, cursor }) {
  const base =
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
  const styles = {
    solid: 'bg-sraz text-cream hover:bg-sraz-deep',
    gold: 'bg-vi text-ink hover:bg-[#d6a03a]',
    ghost: 'border border-sraz/30 text-sraz hover:bg-sraz/5',
    light: 'border border-cream/40 text-cream hover:bg-cream/10',
  }
  const cls = `${base} ${styles[variant]} ${glow ? 'glow-pulse' : ''}`
  const el = href ? (
    <a href={href} className={cls} onPointerDown={ripple} data-cursor={cursor}>
      {children}
    </a>
  ) : (
    <button type={type || 'button'} onClick={onClick} className={cls} onPointerDown={ripple} data-cursor={cursor}>
      {children}
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

/** Top-of-page heading block used on pages 2 to 5. */
export function PageIntro({ eyebrow, title, children, patternId }) {
  return (
    <section className="relative overflow-hidden bg-sraz-deep text-cream">
      <PatternBg id={patternId} color="#c8922a" opacity={0.16} />
      <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
        {eyebrow && <p className="mb-4 text-sm tracking-wide text-vi-soft">{eyebrow}</p>}
        <TextReveal text={title} delay={0.15} className="max-w-3xl font-display text-4xl leading-[1.1] md:text-6xl" />
        {children && (
          <p className="intro-fade mt-6 max-w-xl text-base leading-relaxed text-cream/80">{children}</p>
        )}
      </div>
    </section>
  )
}
