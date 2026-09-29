import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedDumbbell, AnimatedArrow } from '../icons/AnimatedGymIcons';

/**
 * HeroCampaignPoster — High-impact athletic campaign typography block.
 * Uses solid architectural contrast framing and athletic poster styling
 * so typography NEVER visually mixes or clashes with the artwork.
 */
function HeroCampaignPoster({ isMobile = false }) {
  const shouldReduce = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(0.75rem, 1.8vw, 1.5rem)',
        maxWidth: isMobile ? '100%' : '560px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* ── 1. Athletic Campaign Badge ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, x: shouldReduce ? 0 : -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.68rem, 1vw, 0.78rem)',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-charcoal)',
            backgroundColor: 'var(--color-yellow)',
            padding: '0.35rem 0.85rem',
            borderRadius: '2px',
            boxShadow: '0 2px 8px rgba(244, 196, 0, 0.3)',
          }}
        >
          <AnimatedDumbbell size={16} color="var(--color-charcoal)" isHovered={btnHover} />
          <span>Metro City Strength Sanctuary · Est. 2014</span>
        </span>
      </motion.div>

      {/* ── 2. Massive Poster Headline ────────────────────────────── */}
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 30, scale: shouldReduce ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.2 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.25rem, 0.6vw, 0.5rem)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 'clamp(3.8rem, 15vw, 5.5rem)' : 'clamp(4.8rem, 9.5vw, 9.2rem)',
            lineHeight: 0.84,
            letterSpacing: '0.01em',
            margin: 0,
            color: 'var(--color-charcoal)',
            userSelect: 'none',
          }}
        >
          <span style={{ display: 'block', textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            TRAIN HARD.
          </span>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-yellow)',
              color: 'var(--color-charcoal)',
              padding: '0.02em 0.22em',
              borderRadius: '2px',
              boxShadow: '0 4px 20px rgba(244, 196, 0, 0.4)',
              marginTop: '0.08em',
            }}
          >
            LIVE STRONG.
          </span>
        </h1>
      </motion.div>

      {/* ── 3. High-Contrast Athletic Sub-bar ─────────────────────── */}
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.35 }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-charcoal)',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            padding: '0.65rem 1rem',
            borderLeft: '4px solid var(--color-charcoal)',
            borderRadius: '2px',
            margin: 0,
            boxShadow: 'var(--shadow-sm)',
            display: 'inline-block',
          }}
        >
          Free Weights · Barbells · Dedicated Workout Space
        </p>
      </motion.div>

      {/* ── 4. High-Energy Action CTAs ────────────────────────────── */}
      <motion.div
        initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26, delay: 0.45 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(0.85rem, 1.8vw, 1.5rem)',
          marginTop: '0.25rem',
        }}
      >
        <Link
          to="/membership"
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'var(--color-white)',
            backgroundColor: 'var(--color-charcoal)',
            padding: '1.05rem 2.2rem',
            borderRadius: '2px',
            border: '2px solid var(--color-charcoal)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 180ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Claim 1-Day Trial Pass</span>
          <AnimatedArrow size={16} color="var(--color-yellow)" isHovered={btnHover} />
        </Link>

        <Link
          to="/programs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'var(--color-charcoal)',
            padding: '1rem 1.6rem',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '2px solid rgba(37, 42, 46, 0.3)',
            borderRadius: '2px',
            transition: 'all 180ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-charcoal)';
            e.currentTarget.style.backgroundColor = 'var(--color-white)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.3)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
          }}
        >
          <span>Explore Programs</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default HeroCampaignPoster;
