import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, Center, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { BUILD_STEPS, WEAR_TEST } from '../data'
import { Icon, PageIntro } from '../components/ui'
import { PatternBg, SKIRT } from '../components/art'
import { BeforeAfter, EASE, Img, Reveal, TextReveal } from '../components/fx'
import graceImg from '../assets/grace-in-every-step.webp'
import oursImg from '../assets/srazvi-shapewear.webp'
import otherImg from '../assets/other-shapewear.webp'

/* ------------------------------------------------------------ drag comparison */

function FitCompare() {
  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <Reveal from="left">
          <p className="text-sm text-vi">Saree fit comparison</p>
          <h2 className="mt-2 font-display text-3xl text-sraz md:text-5xl">Drag to see the difference.</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
            Same goal, different designs. Slide between SRAZVI and typical shapewear to see where one
            holds and the other rolls, rides up and shows through.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {['Waistband that does not roll', 'Grip that stops ride-up', 'Slit open for easy movement'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sraz text-cream">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal from="right" scale>
          <BeforeAfter
            className="mx-auto max-w-md bg-cream shadow-xl ring-1 ring-sraz/10"
            leftLabel="SRAZVI"
            rightLabel="Other shapewear"
            left={<img src={oursImg} alt="SRAZVI saree shapewear with its features labelled" width="1024" height="1536" className="block h-full w-full object-cover" />}
            right={<Img src={otherImg} alt="Typical shapewear under a saree with its problems labelled" width="1024" height="1536" />}
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ pinned 3D product story */

const MODEL_STORY = [
  {
    file: 'over-the-drape.glb',
    title: 'Over the drape',
    description: 'A sleek, uninterrupted foundation that lets the saree fall exactly as it should.',
    fallback: graceImg,
    callouts: [
      { text: 'Smooth saree-ready finish', angleRange: [18, 92], position: [1.4, 0.8, 0.35] },
      { text: 'Clean, sculpted silhouette', angleRange: [198, 278], position: [-1.45, 0.2, 0.35] },
    ],
  },
  {
    file: 'under-the-drape.glb',
    title: 'Under the drape',
    description: 'Thoughtful construction works quietly underneath for comfort that stays put all day.',
    fallback: oursImg,
    callouts: [
      { text: 'Wide bonded waistband', angleRange: [22, 102], position: [1.42, 0.8, 0.25] },
      { text: 'Anti-slide support', angleRange: [132, 210], position: [-1.45, 0.35, 0.3] },
      { text: 'Easy-movement side slit', angleRange: [244, 328], position: [1.35, -1.3, 0.25] },
    ],
  },
  {
    file: 'other-shapewear.glb',
    title: 'Other shapewear',
    description: 'The common compromises—rolling, visible seams and restriction—are easy to spot.',
    fallback: otherImg,
    callouts: [
      { text: 'Can roll at the waist', angleRange: [16, 92], position: [1.42, 0.8, 0.3] },
      { text: 'Visible seam lines', angleRange: [132, 205], position: [-1.45, -0.1, 0.3] },
      { text: 'Restricts natural movement', angleRange: [242, 325], position: [1.38, -1.35, 0.3] },
    ],
  },
]

const MODEL_HEIGHT = 4.25
const TAU = Math.PI * 2

function modelUrl(file) {
  return `/models/${file}`
}

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function smoothstep(start, end, value) {
  const t = clamp((value - start) / (end - start))
  return t * t * (3 - 2 * t)
}

function storyStatus(progress, index, count) {
  const position = clamp(progress * count, 0, count)
  const local = clamp(position - index)
  const entered = index === 0 ? 1 : smoothstep(index - 0.18, index, position)
  const exited = index === count - 1 ? 1 : 1 - smoothstep(index + 0.82, index + 1, position)
  return { local, opacity: Math.min(entered, exited) }
}

function angleVisibility(angle, [start, end]) {
  const fade = 12
  return Math.min(smoothstep(start - fade, start + fade, angle), 1 - smoothstep(end - fade, end + fade, angle))
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-full border border-sraz/10 bg-cream/95 px-4 py-2 text-xs font-medium text-sraz shadow-sm">
        Preparing product view…
      </div>
    </Html>
  )
}

function StoryCallout({ callout, index, count, scrollProgress }) {
  const labelRef = useRef(null)

  useFrame(() => {
    const { local, opacity } = storyStatus(scrollProgress.get(), index, count)
    const calloutOpacity = opacity * angleVisibility((local * 360) % 360, callout.angleRange)
    if (labelRef.current) {
      labelRef.current.style.opacity = calloutOpacity.toFixed(3)
      labelRef.current.style.transform = `translateY(${(1 - calloutOpacity) * 8}px)`
    }
  })

  return (
    <Html position={callout.position} center distanceFactor={8} zIndexRange={[10, 0]}>
      <div
        ref={labelRef}
        className="pointer-events-none whitespace-nowrap rounded-full border border-sraz/15 bg-cream/95 px-3 py-1.5 text-[10px] font-medium tracking-wide text-sraz shadow-sm backdrop-blur-sm md:text-xs"
      >
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vi align-middle" />
        {callout.text}
      </div>
    </Html>
  )
}

function StoryModel({ item, index, count, scrollProgress }) {
  const group = useRef(null)
  const { scene } = useGLTF(modelUrl(item.file))
  const { object, materials, scale } = useMemo(() => {
    const cloned = scene.clone(true)
    const clonedMaterials = []
    cloned.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = false
      child.receiveShadow = false
      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material]
      const nextMaterials = sourceMaterials.map((material) => {
        // The in-app browser's GPU rejects this model's PBR shader. Keeping the
        // original albedo map on a Lambert material preserves the visual while
        // using a much smaller, broadly supported shader program.
        const next = new THREE.MeshLambertMaterial({
          color: material.color?.clone() ?? new THREE.Color('#d2a47d'),
          map: material.map,
          side: material.side,
          opacity: material.opacity,
        })
        // Keep the fully visible model on the normal opaque render path. Rendering
        // every large GLB as transparent overwhelms integrated GPUs and can make
        // the garment disappear against a light canvas.
        next.transparent = false
        next.depthWrite = true
        next.userData.storyOpacity = next.opacity
        next.userData.isStoryTransparent = false
        clonedMaterials.push(next)
        return next
      })
      child.material = Array.isArray(child.material) ? nextMaterials : nextMaterials[0]
    })

    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    return {
      object: cloned,
      materials: clonedMaterials,
      scale: MODEL_HEIGHT / Math.max(size.y, 0.001),
    }
  }, [scene])

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose())
    },
    [materials],
  )

  useFrame(() => {
    const { local, opacity } = storyStatus(scrollProgress.get(), index, count)
    if (group.current) {
      group.current.rotation.y = local * TAU
      group.current.scale.setScalar(0.93 + opacity * 0.07)
    }
    materials.forEach((material) => {
      material.opacity = material.userData.storyOpacity * opacity
      const isTransparent = opacity < 0.999
      if (material.userData.isStoryTransparent !== isTransparent) {
        material.transparent = isTransparent
        material.depthWrite = !isTransparent
        material.userData.isStoryTransparent = isTransparent
        material.needsUpdate = true
      }
    })
  })

  return (
    <group ref={group}>
      <group scale={scale}>
        <Center>
          <primitive object={object} />
        </Center>
      </group>
      {item.callouts.map((callout) => (
        <StoryCallout
          key={callout.text}
          callout={callout}
          index={index}
          count={count}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  )
}

function ProductCanvas({ models, visibleIndexes, scrollProgress, onModelError }) {
  return (
    <Canvas
      className="!bg-transparent"
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0, 7.4], fov: 32 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#fbf6f0', 0)}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 5]} intensity={2.25} />
      <directionalLight position={[-4, 1, 3]} intensity={0.5} color="#f6e9d7" />
      <Bounds fit clip observe margin={1.0}>
        <Suspense fallback={<CanvasLoader />}>
          {visibleIndexes.map((index) => {
            const item = models[index]
            if (!item) return null
            return (
              <ModelErrorBoundary key={item.file} onError={() => onModelError(item.file)}>
                <StoryModel item={item} index={index} count={models.length} scrollProgress={scrollProgress} />
              </ModelErrorBoundary>
            )
          })}
        </Suspense>
      </Bounds>
    </Canvas>
  )
}

function StaticProductView({ item, reducedMotion }) {
  return (
    <AnimatePresence mode="wait">
      <motion.img
        key={item.file}
        src={item.fallback}
        alt={`${item.title} product illustration`}
        className="h-full w-full object-contain p-3 md:p-8"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
      />
    </AnimatePresence>
  )
}

function ModelStory() {
  const wrapperRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [webgl, setWebgl] = useState(null)
  const [canvasFailed, setCanvasFailed] = useState(false)
  const [availableModels, setAvailableModels] = useState(null)
  const [active, setActive] = useState(0)
  const [visibleIndexes, setVisibleIndexes] = useState([0])
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const models = availableModels ?? MODEL_STORY

  useEffect(() => {
    let cancelled = false
    const findAvailableModels = async () => {
      const checks = await Promise.all(
        MODEL_STORY.map(async (item) => {
          try {
            const response = await fetch(modelUrl(item.file), { method: 'HEAD' })
            return response.ok ? item : null
          } catch {
            return null
          }
        }),
      )
      if (!cancelled) setAvailableModels(checks.filter(Boolean))
    }
    findAvailableModels()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (availableModels) availableModels.forEach((item) => useGLTF.preload(modelUrl(item.file)))
  }, [availableModels])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    setWebgl(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
  }, [])

  useEffect(() => {
    setActive((current) => Math.min(current, Math.max(models.length - 1, 0)))
  }, [models.length])

  useEffect(() => {
    setVisibleIndexes((current) => current.filter((index) => index < models.length))
  }, [models.length])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const position = Math.min(value * models.length, models.length - Number.EPSILON)
    const next = Math.max(0, Math.floor(position))
    const withinSegment = position - next
    // Mount one GLB at a time; bring in the following one only during the
    // short hand-off window. Each supplied model carries a high-detail mesh
    // and two 4K maps, so keeping all three resident in the canvas can exhaust
    // an integrated GPU before any garment is drawn.
    const nextVisible = withinSegment > 0.8 && next < models.length - 1 ? [next, next + 1] : [next]
    setActive((current) => (current === next ? current : next))
    setVisibleIndexes((current) =>
      current.length === nextVisible.length && current.every((index, i) => index === nextVisible[i]) ? current : nextVisible,
    )
  })

  const handleModelError = useCallback((file) => {
    setAvailableModels((current) => current?.filter((item) => item.file !== file) ?? [])
  }, [])

  const scrollToModel = (index) => {
    if (!wrapperRef.current || !models.length) return
    const top = window.scrollY + wrapperRef.current.getBoundingClientRect().top
    const travel = wrapperRef.current.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + (index / models.length) * travel,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  if (availableModels && availableModels.length === 0) return null
  const current = models[active] ?? models[0]
  const showCanvas = webgl && !canvasFailed && !reducedMotion && availableModels !== null

  return (
    <section
      ref={wrapperRef}
      className="relative bg-cream"
      style={{ height: `${(models.length + 1) * 100}vh` }}
      aria-labelledby="product-story-h"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto grid h-full max-w-7xl items-center px-6 py-7 lg:grid-cols-[minmax(0,1.9fr)_minmax(18rem,0.8fr)] lg:gap-4 lg:px-10">
          <div className="relative h-[58svh] min-h-[22rem] lg:h-[75vh]" aria-hidden="true">
            {showCanvas ? (
              <WebGLErrorBoundary onError={() => setCanvasFailed(true)}>
                <ProductCanvas
                  models={models}
                  visibleIndexes={visibleIndexes}
                  scrollProgress={scrollYProgress}
                  onModelError={handleModelError}
                />
              </WebGLErrorBoundary>
            ) : current ? (
              <StaticProductView item={current} reducedMotion={Boolean(reducedMotion)} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-sraz/65">Preparing product view…</div>
            )}
          </div>

          <div className="self-end pb-4 lg:self-center lg:pb-0">
            <p className="text-sm text-vi">Product construction</p>
            <h2 id="product-story-h" className="mt-2 font-display text-3xl text-sraz md:text-5xl">
              {current?.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70 md:text-base">{current?.description}</p>
            <div className="mt-7 flex items-center gap-2" role="tablist" aria-label="Product views">
              {models.map((item, index) => (
                <button
                  key={item.file}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${item.title}`}
                  onClick={() => scrollToModel(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vi focus-visible:ring-offset-4 ${
                    index === active ? 'w-9 bg-vi' : 'w-2.5 bg-sraz/20 hover:bg-sraz/45'
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink/45">Scroll to turn each view.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ pinned build diagram */

const STEP_POINT = { band: [150, 79], panel: [150, 150], grip: [150, 312], slit: [216, 420] }

function BuildDiagram({ step }) {
  const on = (k) => step >= k
  const draw = (k) => ({ pathLength: on(k) ? 1 : 0, opacity: on(k) ? 1 : 0.1 })
  const t = { duration: 0.9, ease: EASE }
  const [px, py] = STEP_POINT[BUILD_STEPS[step].key]
  return (
    <svg viewBox="0 0 300 470" className="mx-auto h-[36vh] w-auto md:h-[68vh]" role="img" aria-label="Construction diagram of SRAZVI">
      <defs>
        <clipPath id="build-clip">
          <path d={SKIRT.outline} />
        </clipPath>
      </defs>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * 40 + 10}H300`} stroke="#9ff5d3" strokeOpacity=".06" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * 40 + 10} 0V470`} stroke="#9ff5d3" strokeOpacity=".06" />
      ))}
      <motion.path
        d={SKIRT.outline}
        fill="#1a6b4a"
        fillOpacity=".25"
        stroke="#f1dfb8"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path d={SKIRT.band} fill="#c8922a" stroke="#c8922a" initial={false} animate={{ ...draw(0), fillOpacity: on(0) ? 0.9 : 0 }} transition={t} />
      <motion.path d={SKIRT.bandStitch} stroke="#0f4a33" strokeDasharray="4 3" initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={t} />
      <motion.path d={SKIRT.panels} stroke="#9ff5d3" strokeOpacity=".8" initial={false} animate={draw(1)} transition={{ duration: 1.4, ease: EASE }} />
      <motion.path d={SKIRT.panelEdge} stroke="#9ff5d3" fill="none" initial={false} animate={draw(1)} transition={t} />
      <g clipPath="url(#build-clip)">
        <motion.path d={SKIRT.grip} fill="#c8922a" stroke="#c8922a" initial={false} animate={{ ...draw(2), fillOpacity: on(2) ? 0.9 : 0 }} transition={t} />
      </g>
      <motion.path d={SKIRT.slit} fill="#0f4a33" stroke="#c8922a" strokeWidth="2" initial={false} animate={draw(3)} transition={t} />

      <motion.g initial={false} animate={{ x: px, y: py }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
        <circle r="14" fill="none" stroke="#f1dfb8" strokeWidth="1.5" className="build-pulse" />
        <circle r="5" fill="#f1dfb8" />
      </motion.g>
    </svg>
  )
}

function BuildSection() {
  const ref = useRef(null)
  const [step, setStep] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) =>
    setStep(Math.min(BUILD_STEPS.length - 1, Math.max(0, Math.floor(v * BUILD_STEPS.length)))),
  )

  return (
    <section ref={ref} className="relative bg-sraz-deep text-cream" style={{ height: `${BUILD_STEPS.length * 70 + 30}vh` }}>
      <PatternBg id="build-pat" opacity={0.08} />
      <div className="sticky top-16 mx-auto grid h-[calc(100vh-4rem)] max-w-6xl content-center items-center gap-6 px-6 md:grid-cols-2 md:gap-12">
        <BuildDiagram step={step} />
        <div>
          <p className="text-sm text-vi-soft">How SRAZVI is built</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">Four layers of engineering.</h2>
          <ol className="mt-6 space-y-2 md:mt-8 md:space-y-3">
            {BUILD_STEPS.map((s, i) => {
              const current = i === step
              return (
                <li key={s.key} className={`rounded-2xl p-3 transition-colors duration-500 md:p-4 ${current ? 'bg-cream/10' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-8 w-8 flex-none place-items-center rounded-full border text-xs transition-colors duration-500 ${
                        i <= step ? 'border-vi bg-vi text-ink' : 'border-cream/30 text-cream/60'
                      }`}
                    >
                      {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className={`font-display text-lg md:text-xl ${current ? 'text-cream' : 'text-cream/55'}`}>{s.title}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {current && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden pl-11 text-sm leading-relaxed text-cream/75"
                      >
                        <span className="block pt-2">{s.text}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-cream/10">
            <motion.div className="h-full origin-left bg-vi" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ wear test */

function WearTest() {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[620px] grid-cols-[110px_repeat(5,1fr)] items-start gap-y-2 text-center text-xs text-ink/60">
        <span />
        {WEAR_TEST.map((w) => (
          <span key={w.time} className="font-medium text-ink/70">
            {w.time}
          </span>
        ))}

        <span className="self-center text-left text-sm font-medium text-maroon">Other brands</span>
        {WEAR_TEST.map((w, i) => (
          <Reveal key={w.time} delay={i * 0.12} className="px-1">
            <svg viewBox="0 0 80 44" className="mx-auto h-11 w-20" aria-hidden="true">
              <rect x="8" y={14 + i * 1.5} width="64" height={16 - i * 2.6} rx="4" fill="#b5483a" fillOpacity=".85" />
              {i > 0 && (
                <path d={`M8 ${33 + i}q8 -${2 + i} 16 0t16 0 16 0 16 0`} stroke="#b5483a" strokeWidth="2" fill="none" />
              )}
            </svg>
            <span className="block leading-snug text-[#9b3a2c]">{w.other}</span>
          </Reveal>
        ))}

        <span className="self-center pt-4 text-left text-sm font-medium text-sraz">SRAZVI</span>
        {WEAR_TEST.map((w, i) => (
          <Reveal key={w.time} delay={0.3 + i * 0.12} className="px-1 pt-4">
            <svg viewBox="0 0 80 44" className="mx-auto h-11 w-20" aria-hidden="true">
              <rect x="8" y="12" width="64" height="20" rx="4" fill="#1a6b4a" />
              <path d="M12 19H68M12 26H68" stroke="#c8922a" strokeDasharray="4 3" />
            </svg>
            <span className="block text-sraz">Holds</span>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Construction() {
  return (
    <>
      <PageIntro patternId="cmp-intro" eyebrow="Construction" title="See what happens under the saree.">
        Drag between SRAZVI and typical shapewear, then scroll to see how SRAZVI is built, layer by
        layer.
      </PageIntro>

      <FitCompare />
      <ModelStory />
      <BuildSection />

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <TextReveal
            as="h2"
            inView
            text="One day, two very different evenings."
            className="max-w-xl font-display text-3xl text-sraz md:text-4xl"
          />
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/70">
            The waistband, hour by hour, from a 6 am pooja to a 10 pm reception.
          </p>
          <div className="mt-8 rounded-3xl bg-cream p-6 md:p-8">
            <WearTest />
          </div>
        </div>
      </section>
    </>
  )
}