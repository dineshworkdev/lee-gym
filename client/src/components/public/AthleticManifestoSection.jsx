import { motion, useReducedMotion } from 'motion/react';
import { useCountUp } from '../../hooks/useCountUp';
import { useRef } from 'react';
import { useInView } from 'motion/react';
import { AnimatedFlame } from '../icons/AnimatedGymIcons';

/**
 * AthleticManifestoSection — Big visual statement + verified operational stats.
 * Real, verifiable facts only: sessions/day, plans, operating days, years open.
 */
function AthleticManifestoSection() {
  const shouldReduce = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // Real, verified operational facts for Lee Gym
  const count1 = useCountUp(2, 1200, isInView && !shouldReduce);   // 2 daily training sessions
  const count2 = useCountUp(4, 1400, isInView && !shouldReduce);   // 4 membership plans
  const count3 = useCountUp(6, 1600, isInView && !shouldReduce);   // 6 days per week (Mon–Sat)
  const count4 = useCountUp(10, 1100, isInView && !shouldReduce);  // 10+ years local gym

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '3px solid var(--color-yellow)',
        borderBottom: '3px solid var(--color-yellow)',
      }}
    >
      {/* Background architectural watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(14rem, 28vw, 32rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.02)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        LEE GYM
      </div>

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <AnimatedFlame size={20} color="var(--color-yellow)" />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-yellow)',
            }}
          >
            The Iron Standard
          </span>
        </div>

        {/* Oversized Typographic Manifesto */}
        <div style={{ maxWidth: '960px', marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6.8vw, 6.2rem)',
              lineHeight: 0.92,
              letterSpacing: '0.01em',
              color: 'var(--color-white)',
              margin: '0 0 1rem 0',
            }}
          >
            WE DO NOT TRAIN FOR MIRRORS.{' '}
            <span style={{ color: 'var(--color-yellow)' }}>
              WE BUILD UNSTOPPABLE HUMANS.
            </span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              color: '#A0AAB2',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Free weights · Open floor · Disciplined effort, every session
          </p>
        </div>

        {/* 4 Stat Blocks — Real, Verified Operational Facts Only */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2.5rem',
          }}
        >
          {/* Stat 1: 2 Daily Training Sessions */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.8rem, 7vw, 6rem)',
                lineHeight: 0.88,
                color: 'var(--color-yellow)',
                marginBottom: '0.35rem',
              }}
            >
              {shouldReduce ? 2 : count1}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: 'var(--color-white)',
                lineHeight: 1,
              }}
            >
              DAILY SESSIONS
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Morning &amp; Evening
            </div>
          </div>

          {/* Stat 2: 4 Membership Plans */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.8rem, 7vw, 6rem)',
                lineHeight: 0.88,
                color: 'var(--color-white)',
                marginBottom: '0.35rem',
              }}
            >
              {shouldReduce ? 4 : count2}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: 'var(--color-yellow)',
                lineHeight: 1,
              }}
            >
              MEMBERSHIP PLANS
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Monthly to Annual
            </div>
          </div>

          {/* Stat 3: 6 Days/Week (Mon–Sat) */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.8rem, 7vw, 6rem)',
                lineHeight: 0.88,
                color: 'var(--color-yellow)',
                marginBottom: '0.35rem',
              }}
            >
              {shouldReduce ? 6 : count3}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: 'var(--color-white)',
                lineHeight: 1,
              }}
            >
              DAYS PER WEEK
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Mon – Sat
            </div>
          </div>

          {/* Stat 4: 10+ Years Established */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.8rem, 7vw, 6rem)',
                lineHeight: 0.88,
                color: 'var(--color-white)',
                marginBottom: '0.35rem',
              }}
            >
              {shouldReduce ? 10 : count4}+
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: 'var(--color-yellow)',
                lineHeight: 1,
              }}
            >
              YEARS ESTABLISHED
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Independent &amp; Local
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AthleticManifestoSection;
