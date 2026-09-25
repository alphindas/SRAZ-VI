import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { FAQ, FEATURES, FOUNDER, SIZE_GUIDE } from '../data'
import { Button, Icon, PageIntro, SampleTag } from '../components/ui'
import { PatternBg, SHADES, SkirtArt } from '../components/art'
import { Accordion, EASE, Modal, Reveal, TextReveal, Tilt } from '../components/fx'

/* ------------------------------------------------------------ flash cards */

function FlashCard({ f, i, onOpen }) {
  const [flipped, setFlipped] = useState(false)
  const ref = useRef(null)
  const drawn = useInView(ref, { once: true, margin: '-60px' })
  return (
    <Reveal as="li" delay={(i % 3) * 0.12} from={i % 2 ? 'right' : 'left'} className="h-[290px]">
      <div ref={ref} className={`flip h-full ${flipped ? 'is-flipped' : ''}`}>
        <div className="flip-inner">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="flip-face flex flex-col bg-cream p-7 text-left shadow-sm ring-1 ring-sraz/10"
            aria-label={`${f.title}: ${f.text} Show more`}
          >
            <span
              className={`draw ${drawn ? 'is-drawn' : ''} grid h-12 w-12 place-items-center rounded-full border border-vi/60 text-vi`}
            >
              <Icon name={f.icon} className="h-5 w-5" />
            </span>
            <span className="mt-5 font-display text-xl text-sraz">{f.title}</span>
            <span className="mt-2 text-sm leading-relaxed text-ink/70">{f.text}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-vi">
              <Icon name="flip" className="h-3.5 w-3.5" /> Hover or tap to flip
            </span>
          </button>

          <div className="flip-face flip-back relative flex flex-col overflow-hidden bg-sraz-deep p-7 text-cream">
            <PatternBg id={`fc-${i}`} opacity={0.12} />
            <span className="relative font-display text-sm text-vi-soft">0{i + 1} / 0{FEATURES.length}</span>
            <span className="relative mt-3 font-display text-xl">{f.title}</span>
            <p className="relative mt-3 text-sm leading-relaxed text-cream/85">{f.more}</p>
            <div className="relative mt-auto flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="rounded-full bg-vi px-4 py-2 text-xs font-medium text-ink transition hover:bg-vi-soft"
              >
                Learn more
              </button>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="text-xs text-cream/70 underline underline-offset-4 hover:text-cream"
              >
                Flip back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function FeaturePopup({ index, onClose, onStep }) {
  const f = FEATURES[index]
  return (
    <Modal open={index !== null} onClose={onClose} title={f ? f.title : 'Feature'}>
      {f && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <span className="draw is-drawn grid h-16 w-16 place-items-center rounded-full bg-sraz text-vi-soft">
              <Icon name={f.icon} className="h-7 w-7" />
            </span>
            <p className="mt-6 text-xs tracking-wide text-vi">
              Feature {index + 1} of {FEATURES.length}
            </p>
            <h3 className="mt-1 font-display text-3xl text-sraz">{f.title}</h3>
            <p className="mt-3 text-base font-medium text-ink/80">{f.text}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{f.more}</p>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="mt-8 flex items-center justify-between border-t border-sraz/10 pt-5">
        <button type="button" onClick={() => onStep(-1)} className="text-sm text-sraz hover:underline">
          ← Previous
        </button>
        <div className="flex gap-1.5" aria-hidden="true">
          {FEATURES.map((x, j) => (
            <span key={x.title} className={`h-1.5 rounded-full transition-all ${j === index ? 'w-6 bg-vi' : 'w-1.5 bg-sraz/20'}`} />
          ))}
        </div>
        <button type="button" onClick={() => onStep(1)} className="text-sm text-sraz hover:underline">
          Next →
        </button>
      </div>
    </Modal>
  )
}

function Features() {
  const [open, setOpen] = useState(null)
  const step = (d) => setOpen((o) => (o + d + FEATURES.length) % FEATURES.length)
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TextReveal
            as="h2"
            inView
            text="Every detail, engineered."
            className="font-display text-3xl text-sraz md:text-5xl"
          />
          <p className="max-w-xs text-sm text-ink/65">Flip a card for the detail, or open it for the full story.</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FlashCard key={f.title} f={f} i={i} onOpen={setOpen} />
          ))}
        </ul>
        <p className="mx-auto mt-14 max-w-2xl text-center font-display text-2xl italic leading-snug text-sraz md:text-3xl">
          All-day comfort that feels like a second skin.
        </p>
      </div>
      <FeaturePopup index={open} onClose={() => setOpen(null)} onStep={step} />
    </section>
  )
}

/* ------------------------------------------------------------ shades + size guide */

function Shades() {
  const [s, setS] = useState(0)
  const [guide, setGuide] = useState(false)
  return (
    <section className="relative overflow-hidden bg-sraz-deep text-cream">
      <PatternBg id="shade-pat" opacity={0.1} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <Reveal from="left" scale>
          <Tilt max={6} className="mx-auto max-w-sm rounded-[2rem] bg-cream p-8">
            <SkirtArt color={SHADES[s].color} className="mx-auto h-auto w-full max-w-[260px]" />
          </Tilt>
        </Reveal>
        <Reveal from="right">
          <p className="text-sm text-vi-soft">Skin-tone range</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">Disappears under any saree.</h2>
          <p className="mt-4 max-w-md text-cream/75">
            Four shades, picked to vanish under chiffon, georgette and silk. Choose one to see it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4" role="radiogroup" aria-label="Shade">
            {SHADES.map((sh, i) => (
              <button
                key={sh.name}
                role="radio"
                aria-checked={s === i}
                onClick={() => setS(i)}
                className="group flex flex-col items-center gap-2 text-xs"
              >
                <span className="relative grid h-14 w-14 place-items-center">
                  {s === i && (
                    <motion.span layoutId="shade-ring" className="absolute inset-0 rounded-full border-2 border-vi" />
                  )}
                  <span
                    className="h-10 w-10 rounded-full ring-1 ring-cream/30 transition-transform group-hover:scale-110"
                    style={{ background: sh.color }}
                  />
                </span>
                <span className={s === i ? 'text-vi-soft' : 'text-cream/60'}>{sh.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="gold" onClick={() => setGuide(true)} magnetic>
              <Icon name="ruler" className="h-4 w-4" /> Size guide
            </Button>
            <Button variant="light" href="#/contact" magnetic>
              Reserve your shade
            </Button>
          </div>
        </Reveal>
      </div>

      <Modal open={guide} onClose={() => setGuide(false)} title="Size guide">
        <h3 className="font-display text-3xl text-sraz">Size guide</h3>
        <p className="mt-2 text-sm text-ink/65">Measurements in inches. Between two sizes? Pick the larger one.</p>
        <SampleTag className="mt-3" />
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sraz/15 text-ink/60">
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Waist</th>
              <th className="py-2 font-medium">Hip</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.map((r, i) => (
              <motion.tr
                key={r.size}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="border-b border-sraz/10"
              >
                <td className="py-3 font-display text-lg text-sraz">{r.size}</td>
                <td className="py-3">{r.waist}</td>
                <td className="py-3">{r.hip}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </section>
  )
}

/* ------------------------------------------------------------ page */

export default function About() {
  return (
    <>
      <PageIntro patternId="about-intro" eyebrow="About SRAZVI" title="Engineered for the saree, made for your day.">
        Every detail, from fabric to stitching to finish, is built to keep your drape flawless from
        morning rituals to late-evening dinners.
      </PageIntro>

      <Features />
      <Shades />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24" aria-labelledby="founder-h">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Reveal as="figure" from="left">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-[999px] rounded-b-2xl bg-sraz-deep">
              <PatternBg id="founder-pat" opacity={0.2} />
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-7xl text-vi">S</span>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-ink/55">Founder portrait: add photo here</figcaption>
          </Reveal>

          <div>
            <TextReveal
              as="h2"
              id="founder-h"
              inView
              text="From the founder."
              className="font-display text-3xl text-sraz md:text-4xl"
            />
            <Reveal>
              <blockquote className="mt-6 border-l-2 border-vi pl-5 font-display text-xl italic leading-relaxed text-ink md:text-2xl">
                {FOUNDER.quote}
              </blockquote>
            </Reveal>
            <div className="mt-8 max-w-prose space-y-5 text-base leading-[1.75] text-ink/75">
              {FOUNDER.paragraphs.map((p, i) => (
                <Reveal as="p" key={p.slice(0, 20)} delay={i * 0.08}>
                  {p}
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-sm font-medium text-sraz">{FOUNDER.sign}</p>
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
          <Reveal from="left">
            <p className="text-sm text-vi">FAQ</p>
            <h2 className="mt-2 font-display text-3xl text-sraz md:text-4xl">Questions, answered.</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/65">
              Something else on your mind? We read every message.
            </p>
            <div className="mt-6">
              <Button href="#/contact" variant="ghost" magnetic>
                Ask us anything
              </Button>
            </div>
          </Reveal>
          <Reveal from="right">
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>
    </>
  )
}