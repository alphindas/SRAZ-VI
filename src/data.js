// All editable copy lives here. Replace SAMPLE data with real results before launch.

// true  -> pages show a small "sample data" tag on survey numbers and reviews
// false -> tags disappear (flip once real survey results / reviews are in)
export const SAMPLE = true

export const CONTACT = {
  name: 'Sravani Reddy',
  phone: '9652151932',
  phoneDisplay: '+91 96521 51932',
  email: 'connect@srazvi.com',
  address: '', // TODO: client to provide
}

export const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/construction', label: 'Construction' },
  { path: '/opportunity', label: 'Opportunity' },
  { path: '/contact', label: 'Contact' },
]

// Old links keep working after the menu rename.
export const ROUTE_ALIASES = {
  '/features': '/about',
  '/compare': '/construction',
}

export const FEATURES = [
  {
    icon: 'antiride',
    title: 'Anti-ride-up design',
    text: 'Stays exactly where you want it, from the first pleat to the last photo.',
    more: 'An engineered grip band at the hem holds the thigh in place, so every step, stair and pheras round leaves it exactly where it started.',
  },
  {
    icon: 'breathe',
    title: 'Ultra-breathable',
    text: 'Advanced airflow fabric keeps you comfortable through long pujas and longer weddings.',
    more: 'A lightweight, breathable knit lets heat escape instead of trapping it under silk, so you stay fresh from the morning muhurtham to the late reception.',
  },
  {
    icon: 'move',
    title: 'Movement-friendly',
    text: 'Maximum stretch for effortless walking, sitting and dancing.',
    more: 'Four-way stretch follows every movement, from sitting cross-legged on the floor to the sangeet dance floor, without pulling or pinching.',
  },
  {
    icon: 'band',
    title: 'No-roll waistband',
    text: 'Wide and bonded, built for heavy-weight sarees. It does not roll down.',
    more: 'A wide, bonded waistband spreads the weight of heavy silk and brocade drapes evenly, so it stays flat and never folds over.',
  },
  {
    icon: 'slit',
    title: 'Movement free',
    text: 'Slit open designed for effortless walking, sitting and dancing.',
    more: 'An open side slit gives you a full, natural stride. Walk, sit and dance freely while the drape stays smooth over it.',
  },
  {
    icon: 'shades',
    title: 'Skin-tone range',
    text: 'Beige, skin, maroon and black, so it disappears under any saree.',
    more: 'Four shades chosen to vanish under chiffon, georgette and silk, so nothing shows through, whatever the colour of your drape.',
  },
]

export const FOUNDER = {
  quote:
    'Sarees look effortless. The shapewear underneath never was. After 39 trials and seven months of construction work, SRAZVI became the fix.',
  paragraphs: [
    'It started on an ordinary pooja morning. Saree draped, family waiting, and us tugging at the shapewear underneath every ten minutes. It rolled down at the waist. It rode up at the thigh. By noon we were thinking about the garment, not the festival.',
    'It began as a passing thought: why does the one thing meant to support a saree keep letting it down? So we started asking. Friends, cousins, colleagues, women at functions. The answer was the same almost every time.',
    'We turned those conversations into a survey, and the pattern was impossible to ignore. So we stopped adjusting existing products and started engineering one. Thirty-nine trials later, SRAZVI is the piece we wished we had that morning.',
  ],
  sign: 'Founder, SRAZVI',
}

// Size chart shown in the About page's size guide modal. Measurements in inches.
// TODO: replace with your confirmed real measurements before launch.
export const SIZE_GUIDE = [
  { size: 'S', waist: '26 - 28', hip: '36 - 38' },
  { size: 'M', waist: '28 - 30', hip: '38 - 40' },
  { size: 'L', waist: '30 - 32', hip: '40 - 42' },
  { size: 'XL', waist: '32 - 35', hip: '42 - 45' },
  { size: 'XXL', waist: '35 - 38', hip: '45 - 48' },
]

// Steps for the pinned "how it is built" section on the Construction page.
export const BUILD_STEPS = [
  {
    key: 'band',
    title: 'Wide bonded waistband',
    text: 'The foundation. A wide, bonded band carries the weight of a heavy silk drape and does not roll down.',
  },
  {
    key: 'panel',
    title: 'Compression panels',
    text: 'Vertical panels smooth the waist, hips and thighs for a clean line under the saree, without a corset feel.',
  },
  {
    key: 'grip',
    title: 'Anti-slide grip band',
    text: 'A silicone grip band sits at the thigh so the hem stays put, step after step.',
  },
  {
    key: 'slit',
    title: 'Open side slit',
    text: 'A discreet slit opens up your stride for walking, sitting and dancing, hidden under the pleats.',
  },
]

// Hour-by-hour wear test. `other` is what typical shapewear does at that hour.
export const WEAR_TEST = [
  { time: '6 am', other: 'Waistband Discomfort' },
  { time: '10 am', other: 'Restrictive Fit' },
  { time: '2 pm', other: 'Thigh Area Rides Up' },
  { time: '6 pm', other: 'Fabric Rolls During Wear' },
  { time: '10 pm', other: 'Edges Curl & Dig Into Skin' },
]

// Reference figures from the client's deck screenshot. Confirm before publishing.
export const MARKET = {
  saree: { label: 'Saree buyers', value: '$60B' },
  shapewear: { label: 'Shapewear buyers', value: '$3.8B' },
  gap: { label: 'Gap', value: '₹180Cr' },
  stats: [
    { value: '18%', label: 'CAGR, India shapewear market, 2024 to 2029' },
    { value: '450M+', label: 'Target women consumers across India' },
    { value: '₹3,000Cr', label: 'Shapewear imported into India from China each year' },
  ],
}

// Numbers shown with a count-up animation on the home page (all from the story above).
export const PROOF = [
  { value: '39', label: 'Product trials' },
  { value: '7', label: 'Months of construction R&D' },
  { value: '4', label: 'Skin-tone shades' },
  { value: '6', label: 'Engineered features' },
]

export const MARQUEE = ['Comfort', 'Fit', 'Movement', 'No roll', 'No ride-up', 'Breathable']

export const FAQ = [
  {
    q: 'Will it show under a thin chiffon or georgette saree?',
    a: 'No. The seams are flat and the fabric comes in four skin-tone shades (beige, skin, maroon and black), so it disappears under light drapes.',
  },
  {
    q: 'Does the waistband really not roll down?',
    a: 'The waistband is wide and bonded rather than a thin elastic, so it stays flat even under the weight of a heavy silk or brocade saree.',
  },
  {
    q: 'Can I sit on the floor or dance in it?',
    a: 'Yes. The open side slit and four-way stretch are there for exactly that: walking, sitting cross-legged and dancing.',
  },
  {
    q: 'Is it comfortable for a full wedding day?',
    a: 'SRAZVI uses a breathable airflow fabric and was tested through full-day wear, from early morning rituals to late receptions.',
  },
  {
    q: 'How do I pick my size?',
    a: 'Share your waist and hip measurements when you request early access and we will suggest your size. Between two sizes? Pick the larger one for all-day comfort.',
  },
]

// SAMPLE survey results. Replace with your real numbers.
export const SURVEY = {
  questions: [
    'Garment riding up?',
    'Waist band rolls down?',
    'Discomfort in long wear?',
    'Slips under heavy silk?',
    'What would you change about the one you own?',
  ],
  results: [
    { label: 'Waistband rolls down', pct: 82 },
    { label: 'Shapewear rides up under the saree', pct: 90 },
    { label: 'Cannot take a full stride', pct: 57 },
    { label: 'Slips under heavy silk', pct: 53 },
  ],
}

// SAMPLE reviews. Replace with real customer words.
export const REVIEWS = [
  {
    name: 'Reena',
    city: '',
    text: 'The shapewear felt fine initially, but after walking around for a while, it slowly started riding up.',
  },
  {
    name: 'Priya',
    city: '',
    text: 'The shapewear felt slightly restrictive when I had to sit on the floor or move around.',
  },
  {
    name: 'Akshaya',
    city: '',
    text: 'My biggest issue was the waistband. It kept folding down whenever I sat for a long time.',
  },
]