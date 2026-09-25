import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTES, CONTACT } from '../data'
import { Logo, Icon } from './ui'
import { EASE, Magnetic, ripple } from './fx'

function useScrolled(y = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > y)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [y])
  return scrolled
}

export function Header({ path }) {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-cream/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'border-sraz/10 shadow-[0_8px_30px_-12px_rgba(15,74,51,0.25)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {ROUTES.map((r) => {
            const active = r.path === path
            return (
              <a
                key={r.path}
                href={`#${r.path}`}
                aria-current={active ? 'page' : undefined}
                className={`relative pb-1 text-sm transition-colors ${active ? 'text-sraz' : 'text-ink/70 hover:text-sraz'}`}
              >
                {r.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded bg-vi"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            )
          })}
        </nav>
        <button
          className="relative overflow-hidden rounded-lg border border-sraz/20 px-3 py-2 text-sm text-sraz md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onPointerDown={ripple}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-sraz/10 bg-cream px-6 md:hidden"
          >
            <div className="py-3">
              {ROUTES.map((r, i) => (
                <motion.a
                  key={r.path}
                  href={`#${r.path}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`block py-3 text-base ${r.path === path ? 'text-sraz' : 'text-ink/70'}`}
                >
                  {r.label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/** Floating early-access button that stays reachable once you scroll (hidden on Contact). */
export function StickyCTA({ path }) {
  const scrolled = useScrolled(700)
  const show = scrolled && path !== '/contact'
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed bottom-5 right-5 z-50"
        >
          <Magnetic>
            <a
              href="#/contact"
              onPointerDown={ripple}
              className="glow-pulse relative flex items-center gap-2 overflow-hidden rounded-full bg-sraz px-5 py-3 text-sm font-medium text-cream shadow-xl transition-colors hover:bg-sraz-deep"
            >
              Join early access
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Footer() {
  return (
    <footer className="bg-sraz-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            India’s first anti-roll saree shapewear. Engineered over seven months of construction R&amp;D.
          </p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 text-vi-soft">Explore</p>
          <ul className="space-y-2 text-cream/80">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <a href={`#${r.path}`} className="inline-block transition hover:translate-x-1 hover:text-vi-soft">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-3 text-vi-soft">Talk to us</p>
          <ul className="space-y-2 text-cream/80">
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-vi-soft">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} SRAZVI. All rights reserved.
      </div>
    </footer>
  )
}
