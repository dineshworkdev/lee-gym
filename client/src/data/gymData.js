/**
 * Lee Gym — Verified Public Website Data
 * Authentic local gym identity:
 * - Yellow columns & accents (#F4C400)
 * - Charcoal/slate walls (#252A2E / #4B555D)
 * - Red & black equipment
 * - Green turf conditioning track
 * - Free weights & barbell platforms
 */

export const GYM_INFO = {
  name: 'LEE GYM',
  tagline: 'Train Hard. Live Strong.',
  shortDescription: 'Gym located in Pappampatti Rd, Pallapalayam, Coimbatore — a serious training facility for focused athletes.',
  address: '1st floor, Nikki Towers, Pappampatti Rd, Pallapalayam, Coimbatore, 641402',
  phone: '+91 62387 69097',
  whatsapp: '+91 62387 69097',
  whatsappLink: 'https://wa.me/916238769097',
  email: 'leegym.website@gmail.com',
  googleMaps: 'https://maps.app.goo.gl/iina11oynzzfMLvQ8?g_st=ac',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1956.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDA!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin',
  // Each entry: days, sessions (array of {open, close}), closed flag
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
    title: 'Relentless Standards',
    description: 'Precision barbells, competition bumper plates, and a floor maintained for serious training.',
  },
  {
    number: '02',
    title: 'Focused Environment',
    description: 'Zero clutter and zero distraction. Athletes and coaches working side-by-side with pure discipline.',
  },
  {
    number: '03',
    title: 'Coaching First',
    description: 'Movement instruction and technical guidance designed to build sustainable, lifelong strength.',
  },
];

export const FACILITY_SPECS = [
  {
    title: 'Olympic Lifting Platforms',
    tag: 'Barbell Zone',
    description: 'Dedicated hardwood lifting platforms with calibrated bumper plates and competition collars.',
  },
  {
    title: 'Indoor Athletic Turf',
    tag: 'Conditioning Area',
    description: 'High-density green turf track for weighted sled pushes, sprints, and functional athletic conditioning.',
  },
  {
    title: 'Free Weight Deck',
    tag: 'Strength',
    description: 'Solid urethane dumbbells paired with heavy-duty multi-angle benches and power racks.',
  },
  {
    title: 'Recovery Bay',
    tag: 'Mobility',
    description: 'Dedicated space for mobility work, active recovery, and post-session restoration.',
  },
];

export const PROGRAMS = [
  {
    id: 'strength-power',
    name: 'Strength & Powerbuilding',
    category: 'Strength',
    shortDesc: 'Structured barbell progression centered on squat, bench press, deadlift, and targeted muscular development.',
  },
  {
    id: 'conditioning-turf',
    name: 'Turf & Metabolic Conditioning',
    category: 'Conditioning',
    shortDesc: 'High-output intervals combining weighted sled pushes, ergs, and functional movement.',
  },
  {
    id: 'olympic-lifting',
    name: 'Olympic Weightlifting',
    category: 'Lifting',
    shortDesc: 'Technical instruction and programming for snatch, clean, and jerk mechanics.',
  },
  {
    id: 'mobility-durability',
    name: 'Mobility & Durability',
    category: 'Mobility',
    shortDesc: 'Joint health, rotational control, and movement restoration to keep you lifting pain-free.',
  },
];

export const TRAINERS = [
  {
    id: 'marcus-lee',
    name: 'Marcus Lee',
    role: 'Head Strength Coach',
    shortDesc: 'Specializes in barbell mechanics, progressive overload, and athletic development.',
  },
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'Conditioning Coach',
    shortDesc: 'Focuses on pacing, cardiovascular endurance, and high-intensity interval conditioning.',
  },
  {
    id: 'david-miller',
    name: 'David Miller',
    role: 'Weightlifting Specialist',
    shortDesc: 'Coaches snatch and clean & jerk technique, bar trajectory, and explosive power.',
  },
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    role: 'Mobility & Longevity Coach',
    shortDesc: 'Guides movement restoration, active range of motion, and injury-prevention protocols.',
  },
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'day-pass',
    name: 'Day Pass',
    badge: 'Drop-In',
    description: 'Full-day access to the lifting floor, turf track, and recovery area.',
  },
  {
    id: 'monthly-access',
    name: 'Full Facility Access',
    badge: 'Most Popular',
    description: 'Complete unrestricted access to all open floor zones and equipment.',
  },
  {
    id: 'coaching-access',
    name: 'Coach-Led Training',
    badge: 'Coaching',
    description: 'Full facility access paired with structured programming and coach guidance.',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Olympic Barbell Platforms',
    category: 'Facility',
    caption: 'Hardwood lifting platforms fitted with calibrated bumper plates and competition collars.',
    aspect: 'wide',
    colorAccent: '#F4C400',
  },
  {
    id: 2,
    title: 'High-Density Turf Track',
    category: 'Conditioning',
    caption: 'Indoor green athletic turf designed for weighted sled pushes and sprint drills.',
    aspect: 'tall',
    colorAccent: '#2F7D4A',
  },
  {
    id: 3,
    title: 'Heavy Free Weight Wall',
    category: 'Strength',
    caption: 'Solid urethane dumbbells paired with heavy-duty adjustable benches.',
    aspect: 'standard',
    colorAccent: '#252A2E',
  },
  {
    id: 4,
    title: 'Barbell Technique in Motion',
    category: 'Lifting',
    caption: 'Athletes refining bar speed and positioning on the platform.',
    aspect: 'wide',
    colorAccent: '#A83D3D',
  },
  {
    id: 5,
    title: 'Community Interval Training',
    category: 'Community',
    caption: 'Members pushing through high-effort conditioning intervals together.',
    aspect: 'tall',
    colorAccent: '#F4C400',
  },
  {
    id: 6,
    title: 'Architectural Yellow Columns',
    category: 'Facility',
    caption: 'Signature visual identity: charcoal walls accented with bright yellow structural pillars.',
    aspect: 'standard',
    colorAccent: '#4B555D',
  },
];
