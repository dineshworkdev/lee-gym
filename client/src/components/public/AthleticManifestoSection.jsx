import { motion, useReducedMotion } from 'motion/react';
import { useCountUp } from '../../hooks/useCountUp';
import { useRef } from 'react';
import { useInView } from 'motion/react';
import { AnimatedDumbbell, AnimatedFlame, AnimatedBarbell } from '../icons/AnimatedGymIcons';

/**
 * AthleticManifestoSection — Big visual statement + massive athletic numbers.
 * Replaces generic SaaS cards with a bold, high-contrast, physical composition.
 */
function AthleticManifestoSection() {
  const shouldReduce = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // Numbers count up when scrolled into view
  const count1 = useCountUp(12, 1200, isInView && !shouldReduce);
  const count2 = useCountUp(30, 1400, isInView && !shouldReduce);
  const count3 = useCountUp(150, 1600, isInView && !shouldReduce);
  const count4 = useCountUp(10, 1100, isInView && !shouldReduce);

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
      {/* Background architectural watermarks */}
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
            Calibrated plates · Zero fluff · Real coaching on every platform
          </p>
        </div>

        {/* 4 Massive Numbers Embedded Into Composition (No Generic Cards!) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2.5rem',
          }}
        >
          {/* Stat 1 */}
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
              {shouldReduce ? 12 : count1}
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
              OLYMPIC PLATFORMS
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Eleiko Calibrated Steel
            </div>
          </div>

          {/* Stat 2 */}
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
              {shouldReduce ? 30 : count2}M
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
              HIGH-SPEED TURF
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Sleds & Sprints
            </div>
          </div>

          {/* Stat 3 */}
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
              {shouldReduce ? 150 : count3}
              <span style={{ fontSize: '0.5em', marginLeft: '0.1em' }}>LBS</span>
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
              HEAVY DUMBBELL WALL
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
              Solid Urethane
            </div>
          </div>

          {/* Stat 4 */}
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
              Independent & Local
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AthleticManifestoSection;
