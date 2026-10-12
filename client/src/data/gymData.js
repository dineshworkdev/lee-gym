/**
 * Lee Gym — Verified Public Website Data
 * Authentic local gym identity:
 * - Gym Name: LEE GYM
 * - Location: 1st floor, Nikki Towers, Pappampatti Rd, Pallapalayam, Coimbatore, 641402
 * - Phone & WhatsApp: +91 62387 69097
 * - Email: leegym.website@gmail.com
 * - Instagram: @leegympallapalayam
 * - Yellow accents (#F4C400)
 * - Charcoal & slate (#252A2E / #4B555D)
 * - Warm background (#F7F5EF)
 */

export const GYM_INFO = {
  name: 'LEE GYM',
  tagline: 'Train Hard. Live Strong.',
  description: 'Gym located in Pappampatti Rd Pallapalayam.',
  shortDescription: 'Gym located in Pappampatti Rd Pallapalayam.',
  address: '1st floor, Nikki Towers, Pappampatti Rd, Pallapalayam, Coimbatore, 641402',
  phone: '+91 62387 69097',
  whatsapp: '+91 62387 69097',
  whatsappLink: 'https://wa.me/916238769097',
  email: 'leegym.website@gmail.com',
  instagram: '@leegympallapalayam',
  googleMaps: 'https://maps.app.goo.gl/iina11oynzzfMLvQ8?g_st=ac',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1956.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDA!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin',
  hours: [
    {
      days: 'Monday – Saturday',
      sessions: [
        { label: 'Morning', open: '05:30 AM', close: '11:00 AM' },
        { label: 'Evening', open: '04:30 PM', close: '10:00 PM' },
      ],
      closed: false,
    },
    {
      days: 'Sunday',
      sessions: [],
      closed: true,
    },
  ],
  socials: [
    { name: 'Instagram', handle: '@leegympallapalayam', url: 'https://instagram.com/leegympallapalayam' },
  ],
};

export const BRAND_VALUES = [
  {
    number: '01',
    title: 'Structured Training',
    description: 'Free weights, barbells, and machines arranged for disciplined daily workouts.',
  },
  {
    number: '02',
    title: 'Focused Environment',
    description: 'A clean, organized space dedicated to consistent athletic effort and personal fitness goals.',
  },
  {
    number: '03',
    title: 'Active Guidance',
    description: 'Practical exercise instruction and support to help members train safely and build strength.',
  },
];

export const FACILITY_SPECS = [
  {
    title: 'Free Weight Training Area',
    tag: 'Strength',
    description: 'Dumbbells, barbells, and adjustable benches for compound and isolation lifting.',
  },
  {
    title: 'Conditioning Floor',
    tag: 'Fitness',
    description: 'Open workout floor dedicated to cardio, core conditioning, and functional movement.',
  },
  {
    title: 'Machine & Cable Stations',
    tag: 'Resistance',
    description: 'Resistance machines and cable equipment supporting balanced muscular training.',
  },
  {
    title: 'Floor Training Space',
    tag: 'Workout Space',
    description: 'Spacious workout layout designed for focused, uninterrupted training sessions.',
  },
];

export const PROGRAMS = [
  {
    id: 'strength-training',
    name: 'Strength Training',
    category: 'Strength',
    shortDesc: 'Barbell and dumbbell exercises focused on building fundamental muscular strength and progressive overload.',
  },
  {
    id: 'general-fitness',
    name: 'General Fitness & Conditioning',
    category: 'Conditioning',
    shortDesc: 'Full-body conditioning and circuit workouts designed to improve overall stamina, endurance, and health.',
  },
  {
    id: 'weight-training',
    name: 'Free Weight Training',
    category: 'Weights',
    shortDesc: 'Self-paced or guided dumbbell, barbell, and bench training for muscle building and physical tone.',
  },
  {
    id: 'functional-movement',
    name: 'Movement & Flexibility',
    category: 'Movement',
    shortDesc: 'Warm-up routines, core stabilization, and stretching exercises to support healthy daily movement.',
  },
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 1000,
    admissionFee: 500,
    durationDays: 30,
    duration: '1 Month',
    description: 'Monthly gym membership. Admission fee: ₹500 (applicable only to Monthly plan).',
    admissionNote: 'Admission fee: ₹500',
  },
  {
    id: '3-plus-1',
    name: '3+1',
    price: 3500,
    admissionFee: 0,
    durationDays: 120,
    duration: '4 Months (3+1)',
    description: '3+1 months membership plan. ₹0 admission fee.',
    admissionNote: '₹0 admission fee',
  },
  {
    id: '6-months',
    name: '6 Months',
    price: 5000,
    admissionFee: 0,
    durationDays: 180,
    duration: '6 Months',
    description: '6 months membership plan. ₹0 admission fee.',
    admissionNote: '₹0 admission fee',
  },
  {
    id: '1-year',
    name: '1 Year',
    price: 8500,
    admissionFee: 0,
    durationDays: 365,
    duration: '1 Year',
    description: '1 year membership plan. ₹0 admission fee.',
    admissionNote: '₹0 admission fee',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Battle Ropes & Turf Lane',
    category: 'Conditioning',
    tag: 'Conditioning',
    src: '/images/battle-ropes-turf-area.jpg',
    alt: 'Lee Gym indoor functional turf track equipped with heavy battle ropes and colorful fitness mural',
    caption: 'High-intensity functional turf track with conditioning battle ropes and dedicated agility space.',
    aspect: 'wide',
    colorAccent: '#2F7D4A',
    stats: 'Turf & Agility Zone',
  },
  {
    id: 2,
    title: 'Strength & Workout Benches',
    category: 'Strength',
    tag: 'Strength',
    src: '/images/workout-benches-strength-zone.jpg',
    alt: 'Row of adjustable workout benches under the Lee Gym motivational banner in the strength area',
    caption: 'Adjustable workout benches and barbell stations for pressing, core, and free-weight movements.',
    aspect: 'standard',
    colorAccent: '#F4C400',
    stats: 'Free Weights & Press',
  },
  {
    id: 3,
    title: 'Free Weights & Dumbbells',
    category: 'Strength',
    tag: 'Strength',
    src: '/images/free-weights-dumbbell-rack.jpg',
    alt: 'Lee Gym free weights section featuring tiered dumbbell racks, mirrors, and barbell plates',
    caption: 'Comprehensive dumbbell selection on two-tier racks, mirrored lifting stations, and Olympic plate trees.',
    aspect: 'standard',
    colorAccent: '#F4C400',
    stats: 'Dumbbells & Plates',
  },
  {
    id: 4,
    title: 'Cable Crossover Station',
    category: 'Conditioning',
    tag: 'Conditioning',
    src: '/images/cable-crossover-station.jpg',
    alt: 'Dual adjustable pulley cable crossover station with multi-grip pull-up bar and workout benches',
    caption: 'Dual adjustable pulley system with pull-up bar for cable flies, pulldowns, and upper body conditioning.',
    aspect: 'wide',
    colorAccent: '#2F7D4A',
    stats: 'Dual Cable Pulley',
  },
  {
    id: 5,
    title: 'Main Floor & Yellow Pillars',
    category: 'Facility',
    tag: 'Facility',
    src: '/images/gym-floor-yellow-pillars.jpg',
    alt: 'Panoramic view of Lee Gym main training floor featuring signature yellow structural pillars and barbell stations',
    caption: 'Signature Lee Gym interior with bright yellow structural columns, open layout, and dedicated barbell zones.',
    aspect: 'wide',
    colorAccent: '#F4C400',
    stats: 'Signature Interior',
  },
  {
    id: 6,
    title: 'Strength Training Circuit',
    category: 'Facility',
    tag: 'Facility',
    src: '/images/strength-machines-circuit.jpeg',
    alt: 'Selectorized resistance machines including lat pulldown and chest press in the Lee Gym strength circuit',
    caption: 'Pin-selected resistance machines and cable stations designed for targeted muscle building and safe training.',
    aspect: 'standard',
    colorAccent: '#4B555D',
    stats: 'Resistance Circuit',
  },
];

