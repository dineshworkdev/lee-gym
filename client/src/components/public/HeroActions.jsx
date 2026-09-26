import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';

/**
 * HeroActions — Kinetic CTA buttons with animated arrow and magnetic feel.
 */
function HeroActions() {
  const shouldReduce = useReducedMotion();
  const [joinHover, setJoinHover] = useState(false);
  const [expHover, setExpHover] = useState(false);

  return (
    <motion.div
      id="hero-actions"
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: shouldReduce ? 0 : 0.75,
        ease: 'easeOut',
      }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'clamp(1rem, 2vw, 1.75rem)',
        marginTop: 'clamp(0.75rem, 2vw, 1.5rem)',
      }}
    >
      {/* ── Primary CTA ─────────────────────────────────────── */}
      <a
        href="/membership"
        id="hero-cta-primary"
        onMouseEnter={() => setJoinHover(true)}
        onMouseLeave={() => setJoinHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'var(--color-charcoal)',
          backgroundColor: 'var(--color-yellow)',
          padding: '1rem 2rem',
          borderRadius: '2px',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 180ms ease',
        }}
      >
        <span>Join the Gym</span>
        <AnimatedArrow size={16} color="var(--color-charcoal)" isHovered={joinHover} />
      </a>

      {/* ── Secondary CTA ───────────────────────────────────── */}
      <a
        href="/programs"
        id="hero-cta-secondary"
        onMouseEnter={() => setExpHover(true)}
        onMouseLeave={() => setExpHover(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: 'var(--color-charcoal)',
          paddingBottom: '6px',
        }}
      >
        Explore Programs

        {/* Animated yellow underline */}
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: expHover && !shouldReduce ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2.5px',
            backgroundColor: 'var(--color-yellow)',
            transformOrigin: 'left center',
          }}
        />

        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'rgba(37,42,46,0.25)',
          }}
        />
      </a>
    </motion.div>
  );
}

export default HeroActions;
