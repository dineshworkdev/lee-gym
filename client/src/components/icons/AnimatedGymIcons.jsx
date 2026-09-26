import { motion } from 'motion/react';

/**
 * AnimatedGymIcons — Bespoke animated SVG icons for Lee Gym.
 * Physical, energetic, athletic, and reactive to interaction.
 */

// 1. Animated Dumbbell (tilts and lifts on hover)
export function AnimatedDumbbell({ size = 24, color = 'var(--color-yellow)', isHovered, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={isHovered ? { rotate: [-10, 15, -5, 0], y: [0, -4, 0] } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Left heavy plate */}
      <rect x="2" y="8" width="3.5" height="8" rx="1" fill={color} />
      {/* Left inner plate */}
      <rect x="5.5" y="6" width="2.5" height="12" rx="0.75" fill={color} />
      {/* Center knurled bar */}
      <rect x="8" y="11" width="8" height="2" rx="0.5" fill={color} />
      {/* Center knurling grooves */}
      <line x1="11" y1="11" x2="11" y2="13" stroke="rgba(37,42,46,0.3)" strokeWidth="0.8" />
      <line x1="13" y1="11" x2="13" y2="13" stroke="rgba(37,42,46,0.3)" strokeWidth="0.8" />
      {/* Right inner plate */}
      <rect x="16" y="6" width="2.5" height="12" rx="0.75" fill={color} />
      {/* Right heavy plate */}
      <rect x="18.5" y="8" width="3.5" height="8" rx="1" fill={color} />
    </motion.svg>
  );
}

// 2. Animated Directional Arrow (spring thrusts forward)
export function AnimatedArrow({ size = 18, color = 'currentColor', isHovered, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={isHovered ? { x: [0, 6, 0] } : { x: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </motion.svg>
  );
}

// 3. Animated Olympic Barbell (loaded with calibrated bumper plates)
export function AnimatedBarbell({ size = 28, color = 'var(--color-yellow)', isHovered, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      animate={isHovered ? { x: [-2, 3, 0], scale: 1.06 } : { x: 0, scale: 1 }}
      whileHover={{ scale: 1.08, x: 2 }}
      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Bar */}
      <line x1="1" y1="14" x2="27" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Outer Plate */}
      <rect x="4" y="8" width="2" height="12" rx="0.5" fill={color} />
      {/* Left Main 20kg Plate */}
      <rect x="6.5" y="5" width="3" height="18" rx="1" fill="var(--color-red)" />
      {/* Left Collar */}
      <rect x="9.5" y="11" width="1.5" height="6" rx="0.5" fill={color} />
      {/* Right Collar */}
      <rect x="17" y="11" width="1.5" height="6" rx="0.5" fill={color} />
      {/* Right Main 20kg Plate */}
      <rect x="18.5" y="5" width="3" height="18" rx="1" fill="var(--color-red)" />
      {/* Right Outer Plate */}
      <rect x="22" y="8" width="2" height="12" rx="0.5" fill={color} />
    </motion.svg>
  );
}

// 4. Animated Flame / Energy (flame pulses with athletic vitality)
export function AnimatedFlame({ size = 22, color = 'var(--color-yellow)', isHovered, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={isHovered ? { scale: [1, 1.15, 1.08], y: -2 } : { scale: 1, y: 0 }}
      whileHover={{ scale: 1.15, y: -2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M12 2C9.5 6 7 8.5 7 13C7 16.866 10.134 20 14 20C17.866 20 21 16.866 21 13C21 10.5 19.5 8.5 18 6.5C18 9 16.5 10.5 15.5 11C15 8 13.5 4 12 2Z"
        fill={color}
      />
      <path
        d="M12 12C11 13.5 10 14.5 10 16.5C10 18.433 11.567 20 13.5 20C15.433 20 17 18.433 17 16.5C17 15 16 13.5 15 12.5C15 14 14 14.5 13.5 15C13 13.5 12.5 12.5 12 12Z"
        fill="var(--color-red)"
      />
    </motion.svg>
  );
}

// 5. Animated Checkmark (smooth SVG stroke draw)
export function AnimatedCheck({ size = 18, color = 'var(--color-yellow)', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', flexShrink: 0 }}>
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <motion.path
        d="M7 12.5L10.5 16L17 8.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

// 6. Animated Weight Plate (rotates slowly or spins on hover)
export function AnimatedWeightPlate({ size = 24, color = 'var(--color-yellow)', isHovered, className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={isHovered ? { rotate: 90 } : { rotate: 0 }}
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <line x1="12" y1="2" x2="12" y2="7.5" stroke={color} strokeWidth="1.5" />
      <line x1="12" y1="16.5" x2="12" y2="22" stroke={color} strokeWidth="1.5" />
      <line x1="2" y1="12" x2="7.5" y2="12" stroke={color} strokeWidth="1.5" />
      <line x1="16.5" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" />
    </motion.svg>
  );
}

// 7. Animated Lightning / Kinetic Spark
export function AnimatedLightning({ size = 20, color = 'var(--color-yellow)', className = '' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={color} />
    </motion.svg>
  );
}
