import { motion } from 'framer-motion'
import { MARKET, SURVEY, REVIEWS } from '../data'
import { PageIntro } from '../components/ui'
import { PatternBg } from '../components/art'
import { Counter, Reveal, TextReveal, Tilt } from '../components/fx'

function MarketCircles() {
  // Pure CSS fade-in that starts as soon as the graphic is drawn.
  // No scroll detection and no JavaScript animation, so iOS Safari cannot get it stuck.
  const fade = (delay) => ({ className: 'mk-fade', style: { animationDelay: `${delay}s` } })

  return (
    <svg
      viewBox="0 0 640 470"
      className="h-auto w-full"
      role="img"
      aria-label={`Market map: the ${MARKET.saree.value} saree market contains the ${MARKET.shapewear.value} shapewear market, which contains a ${MARKET.gap.value} gap where shapewear fails under a saree.`}
    >
      <style>{`
        .mk-fade { animation: mk-fade-in 0.9s ease-out both; }
        @keyframes mk-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .mk-fade { animation: none; } }
      `}</style>
      <defs>
        <pattern id="mk-jq" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M22 3 41 22 22 41 3 22Z" fill="none" stroke="#c8922a" strokeWidth=".8" />
          <circle cx="22" cy="22" r="1.8" fill="#c8922a" />
        </pattern>
      </defs>

      <g {...fade(0)}>
        <circle cx="320" cy="235" r="215" fill="#0f4a33" />
        <circle cx="320" cy="235" r="215" fill="url(#mk-jq)" fillOpacity=".16" />
        <circle cx="320" cy="235" r="215" fill="none" stroke="#c8922a" strokeWidth="2" />
        <text x="320" y="82" textAnchor="middle" fontSize="14" fill="#f1dfb8">
          {MARKET.saree.label}
        </text>
        <text x="320" y="122" textAnchor="middle" fontSize="38" fill="#fbf6f0" fontFamily="Playfair Display, Georgia, serif">
          {MARKET.saree.value}
        </text>
      </g>

      <g {...fade(0.25)}>
        <circle cx="320" cy="300" r="125" fill="#1a6b4a" stroke="#7fd1ad" strokeOpacity=".6" strokeWidth="1.5" />
        <text x="320" y="222" textAnchor="middle" fontSize="13" fill="#e8f6ef">
          {MARKET.shapewear.label}
        </text>
        <text x="320" y="252" textAnchor="middle" fontSize="26" fill="#fbf6f0" fontFamily="Playfair Display, Georgia, serif">
          {MARKET.shapewear.value}
        </text>
      </g>

      <g {...fade(0.5)}>
        {/* Soft pulse ring, drawn with SVG's own animation, which Safari supports well. */}
        <circle cx="320" cy="345" r="62" fill="none" stroke="#f1dfb8" strokeWidth="2" opacity=".7">
          <animate attributeName="r" from="62" to="84" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" from=".7" to="0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="345" r="62" fill="#c8922a" />
        <text x="320" y="333" textAnchor="middle" fontSize="13" fontWeight="600" letterSpacing="1" fill="#26221d">
          {MARKET.gap.label}
        </text>
        <text x="320" y="360" textAnchor="middle" fontSize="22" fill="#26221d" fontFamily="Playfair Display, Georgia, serif">
          {MARKET.gap.value}
        </text>
        <text x="320" y="380" textAnchor="middle" fontSize="10.5" fill="#26221d">
          rolling and ride-up
        </text>
      </g>
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