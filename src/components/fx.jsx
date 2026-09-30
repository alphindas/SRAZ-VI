/**
 * Motion and interaction building blocks used across the site:
 * scroll progress, reveals, text reveals, tilt, magnetic, counters, marquee,
 * modal, toast, accordion, before/after drag, custom cursor,
 * loading screen and skeleton images. All of them respect prefers-reduced-motion.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { LogoMark } from './logo'

export const EASE = [0.22, 1, 0.36, 1]

function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/* ---------------------------------------------------------------- scroll progress */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg, #c8922a, #1a6b4a)' }}
    />
  )
}

/* ---------------------------------------------------------------- reveals */

const OFFSET = { up: [0, 36], down: [0, -36], left: [-56, 0], right: [56, 0], none: [0, 0] }

/** Fade / slide in when the element scrolls into view. */
export function Reveal({ as = 'div', from = 'up', delay = 0, scale = false, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 768px)')
  const M = motion[as]
  if (reduce) return <M className={className} {...rest}>{children}</M>
  // Sideways entrances only on wide screens; phones slide up so nothing pokes past the edge.
  const [x, y] = OFFSET[!wide && (from === 'left' || from === 'right') ? 'up' : from]
  return (
    <M
      className={className}
      initial={{ opacity: 0, x, y, scale: scale ? 0.94 : 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Headline that rises word by word out of a mask. */
export function TextReveal({ text, as = 'h1', id, className = '', delay = 0, stagger = 0.07, inView = false }) {
  const reduce = useReducedMotion()
  const Tag = as
  if (reduce) return <Tag id={id} className={className}>{text}</Tag>
  const words = text.split(' ')
  const trigger = inView ? { whileInView: 'show', viewport: { once: true, margin: '-40px' } } : { animate: 'show' }
  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hide"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{ hide: { y: '110%' }, show: { y: '0%', transition: { duration: 0.85, ease: EASE } } }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/** Brand statement that is uncovered through a moving mask, with a gold edge. */
export function MaskReveal({ children, className = '', as = 'p' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  if (reduce) return <M className={className}>{children}</M>
  return (
    <span className="relative inline-block">
      <M
        className={className}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {children}
      </M>
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 w-[2px] bg-vi"
        initial={{ left: '0%', opacity: 1 }}
        whileInView={{ left: '100%', opacity: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.2, ease: EASE, opacity: { delay: 1.1, duration: 0.3 } }}
      />
    </span>
  )
}

/** Image/section revealed through a growing shape (wipe or circle), image settles from a zoom. */
export function ClipReveal({ shape = 'wipe', className = '', children }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  const from = shape === 'circle' ? 'circle(0% at 50% 50%)' : 'inset(100% 0% 0% 0%)'
  const to = shape === 'circle' ? 'circle(75% at 50% 50%)' : 'inset(0% 0% 0% 0%)'
  return (
    <motion.div
      className={className}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: to }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- images */

/** Image with a shimmering skeleton until it has loaded. */
export function Img({ className = '', imgClassName = '', alt, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && <span aria-hidden="true" className="skeleton absolute inset-0" />}
      <img
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block h-auto w-full transition-[opacity,transform] duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </span>
  )
}

/* ---------------------------------------------------------------- pointer effects */

/** Card tilts toward the cursor with a soft glare. */
export function Tilt({ as = 'div', max = 8, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const M = motion[as]
  if (reduce) return <M className={className} {...rest}>{children}</M>

  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    ref.current.style.setProperty('--gx', `${px * 100}%`)
    ref.current.style.setProperty('--gy', `${py * 100}%`)
  }
  const leave = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <M
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`tilt-glare ${className}`}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Wrapper that pulls its child a little toward the cursor. */
export function Magnetic({ strength = 0.35, className = '', children }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 250, damping: 15, mass: 0.4 })
  const y = useSpring(0, { stiffness: 250, damping: 15, mass: 0.4 })
  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/** Adds a ripple at the click point. Spread the returned handler onto any element. */
export function ripple(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const d = Math.max(r.width, r.height) * 2
  const s = document.createElement('span')
  s.className = 'ripple'
  s.style.width = s.style.height = `${d}px`
  s.style.left = `${e.clientX - r.left - d / 2}px`
  s.style.top = `${e.clientY - r.top - d / 2}px`
  el.appendChild(s)
  setTimeout(() => s.remove(), 650)
}

/* ---------------------------------------------------------------- counters */

/** "₹3,000Cr" -> counts 0 -> 3,000 keeping prefix/suffix. */
export function useCountUp(value, ref, duration = 1.8) {
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const m = String(value).match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/)
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0
  const commas = m ? m[2].includes(',') : false
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || !m || reduce) return
    const c = animate(0, target, { duration, ease: EASE, onUpdate: setN })
    return () => c.stop()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!m || reduce) return value
  const num = commas
    ? n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals)
  return `${m[1]}${num}${m[3]}`
}

export function Counter({ value, className = '' }) {
  const ref = useRef(null)
  const shown = useCountUp(value, ref)
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
      {shown}
    </span>
  )
}

/* ---------------------------------------------------------------- marquee */

export function Marquee({ items, className = '' }) {
  const row = (copy) => (
    <div className="flex flex-none items-center gap-8 pr-8" key={copy} aria-hidden={copy > 0}>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-8">
          <span>{t}</span>
          <span className="text-vi" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max">{[0, 1, 2, 3].map(row)}</div>
    </div>
  )
}

/* ---------------------------------------------------------------- modal */

export function Modal({ open, onClose, title, wide = false, children }) {
  const box = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => box.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-cream p-6 shadow-2xl outline-none md:p-9 ${
              wide ? 'max-w-5xl' : 'max-w-lg'
            }`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-sraz/20 text-sraz transition hover:rotate-90 hover:bg-sraz hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ---------------------------------------------------------------- toast */

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[85] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-center gap-3 rounded-full bg-sraz-deep px-5 py-3 text-sm text-cream shadow-xl"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-vi text-ink">✓</span>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------------------------------------------------------------- accordion */

export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-sraz/15 border-y border-sraz/15">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                aria-expanded={on}
                onClick={() => setOpen(on ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg text-sraz md:text-xl"
              >
                {it.q}
                <motion.span
                  animate={{ rotate: on ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-vi/60 text-vi transition-colors group-hover:bg-vi group-hover:text-ink"
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink/70 md:text-base">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- before / after */

/** Drag the divider to compare two images. Plays a short "hint" wiggle on first view. */
export function BeforeAfter({ left, right, leftLabel, rightLabel, className = '' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)
  const touched = useRef(false)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(50, [50, 28, 72, 50], {
      duration: 2.4,
      ease: 'easeInOut',
      onUpdate: (v) => !touched.current && setPos(v),
    })
    return () => c.stop()
  }, [inView, reduce])

  const update = (clientX) => {
    const r = ref.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div
      ref={ref}
      data-cursor="Drag"
      className={`relative touch-pan-y select-none overflow-hidden rounded-3xl ${className}`}
      onPointerDown={(e) => {
        touched.current = true
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="pointer-events-none">{right}</div>
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {left}
      </div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-sraz px-3 py-1 text-xs font-medium text-cream shadow">
        {leftLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-[#8a3346] px-3 py-1 text-xs font-medium text-cream shadow">
        {rightLabel}
      </span>
      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-vi" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={`Compare ${leftLabel} and ${rightLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
          touched.current = true
        }}
        className="absolute top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-cream bg-vi text-ink shadow-xl"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
        </svg>
      </button>
    </div>
  )
}

/* ---------------------------------------------------------------- cursor */

function TrailDot({ x, y, stiffness, size, opacity }) {
  const sx = useSpring(x, { stiffness, damping: 28 })
  const sy = useSpring(y, { stiffness, damping: 28 })
  return (
    <motion.span
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-vi"
      style={{ x: sx, y: sy, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity }}
    />
  )
}

/** Custom cursor with a soft gold trail. Desktop (fine pointer) only. */
export function CustomCursor() {
  const enabled = useMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 420, damping: 32 })
  const ry = useSpring(y, { stiffness: 420, damping: 32 })
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const el = e.target.closest?.('a,button,[data-cursor],label,select')
      setHover(!!el)
      setLabel(el?.dataset.cursor || '')
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const size = label ? 78 : hover ? 46 : 30
  return (
    <>
      {[
        [260, 6, 0.35],
        [170, 5, 0.25],
        [110, 4, 0.15],
      ].map(([s, d, o]) => (
        <TrailDot key={s} x={x} y={y} stiffness={s} size={d} opacity={o} />
      ))}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] grid place-items-center rounded-full border border-vi text-[11px] font-medium uppercase tracking-wider text-ink"
        style={{ x: rx, y: ry }}
        animate={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          backgroundColor: label ? 'rgba(200,146,42,0.92)' : hover ? 'rgba(200,146,42,0.15)' : 'rgba(200,146,42,0)',
        }}
        transition={{ duration: 0.25 }}
      >
        {label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-sraz"
        style={{ x, y }}
      />
    </>
  )
}

/* ---------------------------------------------------------------- loader */

/** Branded loading screen with the animated logo. Shown once per browser session. */
export function Loader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('srazvi-loaded')
    } catch {
      return true
    }
  })
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => {
      setShow(false)
      try {
        sessionStorage.setItem('srazvi-loaded', '1')
      } catch {
        /* storage blocked: loader simply shows again next time */
      }
    }, reduce ? 300 : 1700)
    return () => clearTimeout(t)
  }, [show, reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center bg-cream"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center">
            <LogoMark animated className="h-16 w-auto md:h-20" />
            <div className="mt-6 h-[2px] w-40 overflow-hidden rounded bg-sraz/10">
              <motion.div
                className="h-full bg-vi"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
