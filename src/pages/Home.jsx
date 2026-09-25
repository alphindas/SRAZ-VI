import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { MARQUEE, PROOF } from '../data'
import { Button } from '../components/ui'
import { PatternBg } from '../components/art'
import {
  Counter,
  EASE,
  MaskReveal,
  Marquee,
  Reveal,
  TextReveal,
} from '../components/fx'
import heroPhoto from '../assets/hero-photo.png'
import './home-hero.css'

const enter = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

// Leaves along the sprig: [x, y, rotation, scale]
const LEAVES = [
  [44, 176, -100, 1],
  [52, 170, 12, 0.95],
  [74, 156, -108, 0.9],
  [84, 146, 4, 0.85],
  [102, 128, -112, 0.78],
  [112, 116, -6, 0.72],
  [126, 100, -118, 0.62],
  [134, 88, -18, 0.55],
]
const LEAF = 'M0 0C9-11 29-11 38 0C29 11 9 11 0 0Z'

/** Gold botanical sprig in the hero corner; draws itself in, then sways gently. */
function HeroSprig() {
  const reduce = useReducedMotion()
  const draw = (delay) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.4, delay, ease: 'easeInOut' },
        }
  return (
    <svg
      className="srazvi-home-hero__sprig"
      viewBox="0 0 240 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <motion.path d="M6 194H232" strokeOpacity=".45" {...draw(0.4)} />
      <g className="srazvi-home-hero__sprig-sway">
        <motion.path d="M22 194C60 176 104 138 146 70" {...draw(0.6)} />
        <motion.path d="M92 136C112 132 132 136 150 148" strokeOpacity=".8" {...draw(1)} />
        {LEAVES.map(([x, y, r, k], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`}>
            <motion.path d={LEAF} fill="currentColor" fillOpacity=".1" {...draw(0.9 + i * 0.12)} />
            <motion.path d="M2 0H34" strokeOpacity=".6" {...draw(1 + i * 0.12)} />
          </g>
        ))}
        <g transform="translate(150 148) rotate(28) scale(.6)">
          <motion.path d={LEAF} fill="currentColor" fillOpacity=".1" {...draw(1.6)} />
        </g>
        <motion.circle cx="148" cy="66" r="3.2" fill="currentColor" stroke="none" {...(reduce ? {} : { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 2, duration: 0.5 } })} />
      </g>
    </svg>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax + scale on scroll
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  // Magnetic image
  const mx = useSpring(0, { stiffness: 120, damping: 18 })
  const my = useSpring(0, { stiffness: 120, damping: 18 })

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 24)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 24)
  }

  return (
    <section ref={ref} className="srazvi-home-hero" id="home">
      <motion.div className="srazvi-home-hero__copy" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
        <motion.p {...enter(0.05)} className="srazvi-home-hero__badge">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="6.5" r="4" />
            <circle cx="6.5" cy="12" r="4" />
            <circle cx="17.5" cy="12" r="4" />
            <circle cx="12" cy="17.5" r="4" />
          </svg>
          <span className="srazvi-home-hero__badge-dot" aria-hidden="true" />
          <span>Seed stage - 39 product trials</span>
        </motion.p>

        <TextReveal text="India's first anti‑ride saree shapewear." delay={0.2} className="srazvi-home-hero__headline" />
        <motion.hr {...enter(0.7)} className="srazvi-home-hero__rule" />
        <motion.p {...enter(0.85)} className="srazvi-home-hero__lead">
          SRAZVI ends waistband rolling and thigh ride-up — engineered over seven months of
          construction R&amp;D, not just stitched together.
        </motion.p>

        <motion.button
          {...enter(1.1)}
          type="button"
          onClick={() => document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth' })}
          className="srazvi-home-hero__scroll"
        >
          <span className="srazvi-home-hero__mouse" aria-hidden="true">
            <span />
          </span>
          Scroll to explore
        </motion.button>
      </motion.div>

      <HeroSprig />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        className="srazvi-home-hero__photo"
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(0)
          my.set(0)
        }}
        data-cursor="Explore"
      >
        <motion.div style={reduce ? undefined : { y: photoY, scale: photoScale }}>
          <motion.div style={reduce ? undefined : { x: mx, y: my }}>
            <img
              src={heroPhoto}
              alt="Woman wearing an emerald green silk saree with gold border, standing before a carved stone archway"
              width="828"
              height="972"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ProofStrip() {
  return (
    <section id="proof" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-14 md:py-20">
      <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {PROOF.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.1} className="border-l-2 border-vi/60 pl-5">
            <dt className="font-display text-5xl text-sraz md:text-6xl">
              <Counter value={p.value} />
            </dt>
            <dd className="mt-2 text-sm text-ink/65">{p.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />

      <div className="border-y border-vi/30 bg-sraz-deep py-5 font-display text-2xl italic text-cream md:text-3xl">
        <Marquee items={MARQUEE} />
      </div>

      <ProofStrip />

      <section className="relative overflow-hidden bg-sraz-deep text-cream">
        <PatternBg id="home-cta" opacity={0.15} />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-16">
          <MaskReveal className="max-w-lg font-display text-2xl leading-snug md:text-4xl">
            Wear the saree. Forget the shapewear.
          </MaskReveal>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            className="flex flex-wrap gap-3"
          >
            <Button href="#/construction" variant="gold" magnetic glow>
              See the construction
            </Button>
            <Button href="#/contact" variant="light" magnetic>
              Join the early-access list
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
