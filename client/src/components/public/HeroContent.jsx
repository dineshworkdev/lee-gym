import { motion, useReducedMotion } from 'motion/react';
import { AnimatedDumbbell } from '../icons/AnimatedGymIcons';

/**
 * LineReveal — wraps a text line in an overflow:hidden clip container
 * so the text slides up from beneath with kinetic spring physics.
 */
function LineReveal({ children, delay, style = {}, shouldReduce }) {
  return (
    <div style={{ overflow: 'hidden', display: 'block', lineHeight: 0.84 }}>
      <motion.span
        initial={{ y: shouldReduce ? '0%' : '110%' }}
        animate={{ y: '0%' }}
        transition={{
          duration: 0.72,
          delay: shouldReduce ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ display: 'block', ...style }}
      >
        {children}
      </motion.span>
    </div>
  );
}

/**
 * HeroContent — Bold kinetic headline block for desktop hero.
 * Oversized typography, tight line-height, zero paragraph fluff.
 */
function HeroContent() {
  const shouldReduce = useReducedMotion();

  const BASE = 0.2;
  const LAG = 0.15;

  return (
    <div
      id="hero-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* ── Eyebrow Badge ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, x: shouldReduce ? 0 : -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: shouldReduce ? 0 : BASE - 0.08 }}
        style={{ marginBottom: 'clamp(0.6rem, 1.4vw, 1.1rem)' }}
      >
        <span
          id="hero-pre-title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-charcoal)',
            backgroundColor: 'rgba(244, 196, 0, 0.25)',
            padding: '0.3rem 0.75rem',
            borderRadius: '2px',
          }}
        >
          <AnimatedDumbbell size={16} color="var(--color-charcoal)" />
          Industrial Strength · Est. 2014
        </span>
      </motion.div>

      {/* ── Main Headline: TRAIN HARD. / LIVE STRONG. ─────────── */}
      <div
        id="hero-headline"
        style={{ marginBottom: 'clamp(0.75rem, 1.8vw, 1.5rem)' }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4.6rem, 9.8vw, 9.8rem)',
            lineHeight: 0.84,
            letterSpacing: '0.01em',
            margin: 0,
            userSelect: 'none',
          }}
        >
          <LineReveal delay={BASE} shouldReduce={shouldReduce}>
            <span style={{ color: 'var(--color-charcoal)' }}>TRAIN HARD.</span>
          </LineReveal>

          <div style={{ height: 'clamp(0.2rem, 0.5vw, 0.4rem)' }} />

          <LineReveal delay={BASE + LAG} shouldReduce={shouldReduce}>
            <span
              style={{
                color: 'var(--color-yellow)',
                display: 'block',
              }}
            >
              LIVE STRONG.
            </span>
          </LineReveal>
        </h1>
      </div>

      {/* ── Short Punchy Athletic Statement (Zero Fluff Copy) ──── */}
      <motion.p
        id="hero-body-text"
        initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: shouldReduce ? 0 : BASE + LAG * 2 + 0.1,
        }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.88rem, 1.2vw, 1.02rem)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--color-slate)',
          maxWidth: '420px',
          margin: 0,
        }}
      >
        12 Olympic Platforms · 30m Sled Turf · Calibrated Rogue Iron
      </motion.p>
    </div>
  );
}

export default HeroContent;
