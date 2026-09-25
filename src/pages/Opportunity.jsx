import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MARKET, SURVEY, REVIEWS } from '../data'
import { PageIntro, SampleTag } from '../components/ui'
import { PatternBg } from '../components/art'
import { Counter, Reveal, TextReveal, Tilt, useCountUp } from '../components/fx'

/** SVG <text> whose number counts up when it scrolls into view. */
function CountText({ value, ...props }) {
  const ref = useRef(null)
  const shown = useCountUp(value, ref)
  return (
    <text ref={ref} {...props}>
      {shown}
    </text>
  )
}

function MarketCircles() {
  const reduce = useReducedMotion()
  const grow = (delay) =>
    reduce
      ? {}
      : {
          initial: { scale: 0.8, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.8, delay, ease: 'easeOut' },
        }
  const still = { transformBox: 'fill-box', transformOrigin: 'center' }

  return (
    <svg
      viewBox="0 0 640 470"
      className="h-auto w-full"
      role="img"
      aria-label={`Market map: the ${MARKET.saree.value} saree market contains the ${MARKET.shapewear.value} shapewear market, which contains a ${MARKET.gap.value} gap where shapewear fails under a saree.`}
    >
      <defs>
        <pattern id="mk-jq" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M22 3 41 22 22 41 3 22Z" fill="none" stroke="#c8922a" strokeWidth=".8" />
          <circle cx="22" cy="22" r="1.8" fill="#c8922a" />
        </pattern>
        <clipPath id="mk-big">
          <circle cx="320" cy="235" r="215" />
        </clipPath>
      </defs>

      <motion.g {...grow(0)} style={still}>
        <circle cx="320" cy="235" r="215" fill="#0f4a33" />
        <rect width="640" height="470" fill="url(#mk-jq)" opacity=".16" clipPath="url(#mk-big)" />
        <circle cx="320" cy="235" r="215" fill="none" stroke="#c8922a" strokeWidth="2" />
        <text x="320" y="82" textAnchor="middle" fontSize="14" fill="#f1dfb8">
          {MARKET.saree.label}
        </text>
        <CountText value={MARKET.saree.value} x="320" y="122" textAnchor="middle" fontSize="38" fill="#fbf6f0" fontFamily="Playfair Display, Georgia, serif" />
      </motion.g>

      <motion.g {...grow(0.25)} style={still}>
        <circle cx="320" cy="300" r="125" fill="#1a6b4a" stroke="#7fd1ad" strokeOpacity=".6" strokeWidth="1.5" />
        <text x="320" y="222" textAnchor="middle" fontSize="13" fill="#e8f6ef">
          {MARKET.shapewear.label}
        </text>
        <CountText value={MARKET.shapewear.value} x="320" y="252" textAnchor="middle" fontSize="26" fill="#fbf6f0" fontFamily="Playfair Display, Georgia, serif" />
      </motion.g>

      <motion.g {...grow(0.5)} style={still}>
        {!reduce && (
          <motion.circle
            cx="320"
            cy="345"
            fill="none"
            stroke="#f1dfb8"
            strokeWidth="2"
            initial={{ r: 62, opacity: 0.7 }}
            animate={{ r: 84, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <circle cx="320" cy="345" r="62" fill="#c8922a" />
        <text x="320" y="333" textAnchor="middle" fontSize="13" fontWeight="600" letterSpacing="1" fill="#26221d">
          {MARKET.gap.label}
        </text>
        <CountText value={MARKET.gap.value} x="320" y="360" textAnchor="middle" fontSize="22" fill="#26221d" fontFamily="Playfair Display, Georgia, serif" />
        <text x="320" y="380" textAnchor="middle" fontSize="10.5" fill="#26221d">
          rolling and ride-up
        </text>
      </motion.g>
    </svg>
  )
}

function Bar({ label, pct }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-ink">{label}</span>
        <span className="font-medium text-sraz">{pct}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sraz/10">
        <motion.div
          className="h-full rounded-full bg-sraz"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </li>
  )
}

export default function Opportunity() {
  return (
    <>
      <PageIntro patternId="opp-intro" eyebrow="The opportunity" title="A Huge Gap in the Market" />

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <MarketCircles />
            <ul className="mt-6 grid gap-3 text-sm text-ink/75 sm:grid-cols-3">
              <li className="flex gap-2">
                <span className="mt-1 h-3 w-3 flex-none rounded-full bg-sraz-deep" />
                Big circle: the saree market
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-3 w-3 flex-none rounded-full bg-sraz" />
                Small circle: the shapewear market
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-3 w-3 flex-none rounded-full bg-vi" />
                Gold circle: the gap, where shapewear fails under a saree
              </li>
            </ul>
          </div>

          <dl className="divide-y divide-sraz/15 border-y border-sraz/15">
            {MARKET.stats.map((s, i) => (
              <Reveal key={s.value} from="right" delay={i * 0.12} className="py-6">
                <dt className="font-display text-4xl text-sraz md:text-5xl">
                  <Counter value={s.value} />
                </dt>
                <dd className="mt-2 max-w-xs text-sm leading-relaxed text-ink/65">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <TextReveal
              as="h2"
              inView
              text="We asked women what goes wrong."
              className="max-w-lg font-display text-3xl text-sraz md:text-4xl"
            />
            <SampleTag />
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="mb-5 text-sm text-ink/60">Share of respondents who reported each problem</p>
              <ul className="space-y-5">
                {SURVEY.results.map((r) => (
                  <Bar key={r.label} {...r} />
                ))}
              </ul>
            </div>
            <Reveal from="right" className="relative overflow-hidden rounded-3xl bg-sraz-deep p-7 text-cream md:p-9">
              <PatternBg id="svy-q" opacity={0.12} />
              <div className="relative">
                <h3 className="font-display text-xl">Questions we asked</h3>
                <ol className="mt-5 space-y-4 text-sm leading-relaxed text-cream/85">
                  {SURVEY.questions.map((q, i) => (
                    <li key={q} className="flex gap-3">
                      <span className="text-vi-soft">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ol>
                <a href="#/contact" className="mt-7 inline-block text-sm text-vi-soft underline underline-offset-4">
                  Answer the survey yourself
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-vi">Survey</p>
            <h2 className="mt-2 font-display text-3xl text-sraz md:text-4xl">Survey</h2>
          </div>
          <SampleTag />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.12} className="h-full">
              <Tilt
                as="figure"
                className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-sraz/10 transition-shadow hover:shadow-xl"
              >
                <span className="font-display text-5xl leading-none text-vi" aria-hidden="true">
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-sm italic leading-relaxed text-ink/80">
                  {r.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sraz text-sm text-cream">
                    {r.name[0]}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium text-ink">{r.name}</span>
                    <span className="text-xs text-ink/55">{r.city}</span>
                  </span>
                </figcaption>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
