import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTES, ROUTE_ALIASES } from './data'
import { Header, Footer, StickyCTA } from './components/Layout'
import { CustomCursor, EASE, Loader, ScrollProgress, ToastProvider } from './components/fx'
import Home from './pages/Home'
import About from './pages/About'
import Construction from './pages/Construction'
import Opportunity from './pages/Opportunity'
import Contact from './pages/Contact'

const PAGES = {
  '/': Home,
  '/about': About,
  '/construction': Construction,
  '/opportunity': Opportunity,
  '/contact': Contact,
}

const readHash = () => {
  const p = window.location.hash.replace(/^#/, '') || '/'
  return ROUTE_ALIASES[p] || p
}

export default function App() {
  const [path, setPath] = useState(readHash)

  useEffect(() => {
    const onChange = () => {
      setPath(readHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const known = PAGES[path] ? path : '/'
  const Page = PAGES[known]
  const label = ROUTES.find((r) => r.path === known)?.label

  useEffect(() => {
    document.title = known === '/' ? 'SRAZVI | Saree Shapewear' : `${label} | SRAZVI`
  }, [known, label])

  return (
    <ToastProvider>
      <Loader />
      <ScrollProgress />
      <CustomCursor />
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Header path={known} />
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          tabIndex={-1}
          key={known}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="outline-none"
        >
          <Page />
        </motion.main>
      </AnimatePresence>
      <StickyCTA path={known} />
      <Footer />
    </ToastProvider>
  )
}
