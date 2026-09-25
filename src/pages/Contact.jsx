import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT, SURVEY } from '../data'
import { Icon, PageIntro } from '../components/ui'
import { EASE, Reveal, ripple, useToast } from '../components/fx'

const input =
  'w-full rounded-xl border border-sraz/20 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-sraz focus:ring-2 focus:ring-sraz/20'

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink/80">{label}</span>
      {children}
    </label>
  )
}

/** Collect a form into { name: "a, b" } (checkbox groups are joined). */
function collect(form) {
  const out = {}
  for (const [k, v] of new FormData(form)) out[k] = out[k] ? `${out[k]}, ${v}` : String(v)
  return out
}

/**
 * No backend yet: submitting opens the visitor's mail app with the answers filled in,
 * addressed to CONTACT.email. Swap this for a fetch() to Formspree / your API when ready.
 */
function sendByMail(subject, data) {
  const body = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const FORMS = {
  enquiry: {
    tab: 'Enquiry',
    title: 'Ask us anything',
    subject: 'SRAZVI enquiry',
    cta: 'Send enquiry',
    fields: (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <input name="Name" required autoComplete="name" className={input} />
          </Field>
          <Field label="Phone">
            <input name="Phone" type="tel" autoComplete="tel" className={input} />
          </Field>
        </div>
        <Field label="Email">
          <input name="Email" type="email" required autoComplete="email" className={input} />
        </Field>
        <Field label="What is it about?">
          <select name="Topic" className={input} defaultValue="Product question">
            <option>Product question</option>
            <option>Wholesale or partnership</option>
            <option>Investor deck</option>
            <option>Press</option>
            <option>Something else</option>
          </select>
        </Field>
        <Field label="Message">
          <textarea name="Message" rows="4" required className={input} />
        </Field>
      </>
    ),
  },
  trial: {
    tab: 'Early access',
    title: 'Join the early-access list',
    subject: 'SRAZVI early access request',
    cta: 'Request early access',
    fields: (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <input name="Name" required autoComplete="name" className={input} />
          </Field>
          <Field label="City">
            <input name="City" autoComplete="address-level2" className={input} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input name="Email" type="email" required autoComplete="email" className={input} />
          </Field>
          <Field label="Phone">
            <input name="Phone" type="tel" autoComplete="tel" className={input} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Shade">
            <select name="Shade" className={input}>
              <option>Beige</option>
              <option>Skin</option>
              <option>Maroon</option>
              <option>Black</option>
            </select>
          </Field>
          <Field label="Size">
            <select name="Size" className={input}>
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Saree you wear most">
            <select name="Saree" className={input}>
              <option>Silk</option>
              <option>Cotton</option>
              <option>Georgette</option>
              <option>Chiffon</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
        <Field label="Anything we should know? (optional)">
          <textarea name="Note" rows="3" className={input} />
        </Field>
      </>
    ),
  },
  survey: {
    tab: 'Saree survey',
    title: 'Tell us your saree struggle',
    subject: 'SRAZVI survey response',
    cta: 'Send my answers',
    fields: (
      <>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink/80">
            What goes wrong with your shapewear? (pick any)
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SURVEY.results.map((r) => (
              <label
                key={r.label}
                className="flex items-center gap-2.5 rounded-xl border border-sraz/15 bg-white px-3 py-2.5 text-sm"
              >
                <input type="checkbox" name="Problems" value={r.label} className="h-4 w-4 accent-[#1a6b4a]" />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="How long do you wear a saree at a stretch?">
          <select name="Hours worn" className={input}>
            <option>Under 4 hours</option>
            <option>4 to 8 hours</option>
            <option>8 to 12 hours</option>
            <option>More than 12 hours</option>
          </select>
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink/80">
            How comfortable is your current shapewear? (1 = not at all, 5 = very)
          </legend>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer">
                <input type="radio" name="Comfort" value={n} className="peer sr-only" />
                <span className="grid h-11 w-11 place-items-center rounded-full border border-sraz/25 bg-white text-sm peer-checked:border-sraz peer-checked:bg-sraz peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-vi">
                  {n}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Your worst saree moment (optional)">
          <textarea name="Story" rows="3" className={input} />
        </Field>
        <Field label="Email, if you want us to reply (optional)">
          <input name="Email" type="email" autoComplete="email" className={input} />
        </Field>
      </>
    ),
  },
}

/** Submit button that morphs into a "Sent" confirmation. */
function MorphButton({ done, children }) {
  return (
    <motion.button
      type="submit"
      layout
      disabled={done}
      onPointerDown={ripple}
      transition={{ layout: { duration: 0.4, ease: EASE } }}
      style={{ borderRadius: 999 }}
      className={`relative inline-flex h-12 items-center justify-center overflow-hidden px-7 text-sm font-medium transition-colors ${
        done ? 'bg-vi text-ink' : 'bg-sraz text-cream hover:bg-sraz-deep'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? 'done' : 'idle'}
          layout="position"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2"
        >
          {done ? (
            <>
              <Icon name="check" className="h-4 w-4" /> Sent
            </>
          ) : (
            children
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

function FormPanel({ id }) {
  const f = FORMS[id]
  const toast = useToast()
  const [sent, setSent] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-sraz/10">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sraz text-cream">
          <Icon name="check" />
        </span>
        <h3 className="mt-4 font-display text-2xl text-sraz">Thank you.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
          Your email app should have opened with your answers ready to send. If it didn’t, write to{' '}
          <a className="text-sraz underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          .
        </p>
        <button
          onClick={() => {
            setDone(false)
            setSent(false)
          }}
          className="mt-6 text-sm text-sraz underline underline-offset-4"
        >
          Fill in another response
        </button>
      </div>
    )
  }

  return (
    <form
      className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-sraz/10 md:p-8"
      onSubmit={(e) => {
        e.preventDefault()
        sendByMail(f.subject, collect(e.currentTarget))
        setDone(true)
        toast('Opening your email app with your answers')
        timer.current = setTimeout(() => setSent(true), 1200)
      }}
    >
      <h3 className="font-display text-2xl text-sraz">{f.title}</h3>
      {f.fields}
      <div className="pt-2">
        <MorphButton done={done}>{f.cta}</MorphButton>
      </div>
    </form>
  )
}

export default function Contact() {
  const [tab, setTab] = useState('enquiry')

  return (
    <>
      <PageIntro patternId="ct-intro" eyebrow="Contact" title="Let’s talk about your drape.">
        Questions, early access, partnerships or your own saree story. We read everything.
      </PageIntro>

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal as="aside" from="left">
            <h2 className="font-display text-3xl text-sraz">{CONTACT.name}</h2>
            <p className="mt-1 text-sm text-ink/60">SRAZVI</p>
            <ul className="mt-8 space-y-5 text-sm">
              <li className="flex gap-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-vi/60 text-vi">
                  <Icon name="mail" />
                </span>
                <span>
                  <span className="block text-xs text-ink/55">Email</span>
                  <a href={`mailto:${CONTACT.email}`} className="text-base text-ink hover:text-sraz">
                    {CONTACT.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-vi/60 text-vi">
                  <Icon name="pin" />
                </span>
                <span>
                  <span className="block text-xs text-ink/55">Address</span>
                  <span className="text-base text-ink">{CONTACT.address || 'Studio address coming soon'}</span>
                </span>
              </li>
            </ul>
          </Reveal>

          <div>
            <div role="tablist" aria-label="Forms" className="mb-5 flex flex-wrap gap-2">
              {Object.entries(FORMS).map(([id, f]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`relative rounded-full border px-5 py-2.5 text-sm transition-colors ${
                    tab === id ? 'border-sraz text-cream' : 'border-sraz/25 text-sraz hover:bg-sraz/5'
                  }`}
                >
                  {tab === id && (
                    <motion.span
                      layoutId="form-tab"
                      className="absolute inset-0 rounded-full bg-sraz"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{f.tab}</span>
                </button>
              ))}
            </div>
            <div role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <FormPanel id={tab} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
