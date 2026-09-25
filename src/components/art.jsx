/** Generated SVG artwork: background patterns and product-detail tiles. */

/** Jacquard-style diamond motif, used as a subtle background. */
export function PatternBg({ id, color = '#c8922a', opacity = 0.14, className = '' }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M28 4 52 28 28 52 4 28Z" fill="none" stroke={color} strokeWidth="1" />
          <path d="M28 16 40 28 28 40 16 28Z" fill={color} fillOpacity=".55" />
          <circle cx="0" cy="0" r="2.4" fill={color} />
          <circle cx="56" cy="0" r="2.4" fill={color} />
          <circle cx="0" cy="56" r="2.4" fill={color} />
          <circle cx="56" cy="56" r="2.4" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  )
}

/** Small tile illustrations for the home page. */
export function PleatTile() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: 13 }, (_, i) => (
        <path
          key={i}
          d={`M${120} 8L${16 + i * 17} 132`}
          stroke="#1a6b4a"
          strokeWidth={i % 2 ? 1 : 2.4}
          strokeOpacity={i % 2 ? 0.4 : 0.85}
        />
      ))}
      <rect x="10" y="132" width="220" height="10" rx="2" fill="#c8922a" />
    </svg>
  )
}

export function RollTile() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      {/* left: a typical band, rolled */}
      <path d="M20 44h84" stroke="#b5483a" strokeWidth="14" strokeLinecap="round" />
      <path d="M26 66q10-9 20 0t20 0 20 0" stroke="#b5483a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M26 92h72" stroke="#b5483a" strokeOpacity=".3" strokeWidth="10" strokeLinecap="round" />
      <path d="M62 128 62 110m0 0-6 6m6-6 6 6" stroke="#b5483a" strokeWidth="2" fill="none" />
      {/* right: SRAZVI band, flat */}
      <rect x="136" y="34" width="84" height="40" rx="6" fill="#1a6b4a" />
      <path d="M144 46h68M144 62h68" stroke="#c8922a" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="136" y="84" width="84" height="8" rx="3" fill="#1a6b4a" fillOpacity=".35" />
      <path d="m170 116 6 6 12-12" stroke="#1a6b4a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 20V140" stroke="#c8922a" strokeOpacity=".5" strokeDasharray="3 4" />
    </svg>
  )
}

/** Saree shapewear (mermaid silhouette) geometry, viewBox 0 0 300 470. */
export const SKIRT = {
  outline: 'M108 60H192Q226 120 218 200Q212 290 198 350Q214 400 236 450H64Q86 400 102 350Q88 290 82 200Q74 120 108 60Z',
  band: 'M106 60H194L199 98H101Z',
  bandStitch: 'M108 72H192M106 86H194',
  panels: Array.from({ length: 8 }, (_, i) => `M${110 + i * 11.4} 100V${196 + Math.abs(3.5 - i) * 2}`).join(''),
  panelEdge: 'M84 200Q150 214 216 200',
  grip: 'M92 300Q150 312 208 300L206 318Q150 330 94 318Z',
  slit: 'M204 372L226 450H212Z',
}

/** Skin-tone shade range shown on the About page's shade picker. */
export const SHADES = [
  { name: 'Beige', color: '#e6c8a1' },
  { name: 'Skin', color: '#c9925f' },
  { name: 'Maroon', color: '#7a2e33' },
  { name: 'Black', color: '#2b241f' },
]

/** Filled silhouette of the shapewear, tinted to the selected shade. Uses SKIRT.outline. */
export function SkirtArt({ color = '#c9925f', className = '' }) {
  return (
    <svg viewBox="0 0 300 470" className={className} aria-hidden="true">
      <path d={SKIRT.outline} fill={color} stroke="#00000022" strokeWidth="1.5" />
      <path d={SKIRT.band} fill="#00000014" />
      <path d={SKIRT.grip} fill="#00000010" />
    </svg>
  )
}