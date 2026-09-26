import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';

/**
 * VisualCTASection — High-Energy Closing Banner
 * Pure athletic closing call to action without fake trial codes or promotional generators.
 */
function VisualCTASection() {
  const shouldReduce = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <section
      style={{
        backgroundColor: 'var(--color-yellow, #F4C400)',
        color: 'var(--color-charcoal, #252A2E)',
        padding: 'clamp(4rem, 8vw, 6.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Graphic Watermark */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: shouldReduce ? 0.06 : 0, x: shouldReduce ? 0 : 30 }}
        whileInView={{ opacity: 0.06, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          fontSize: 'clamp(10rem, 25vw, 24rem)',
          fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
          fontWeight: 900,
          color: 'rgba(37, 42, 46, 0.06)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        STRONG
      </motion.div>

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : '100%' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '0.01em',
                color: '#1A1D20',
                margin: '0 0 1rem 0',
              }}
            >
              TRAIN HARD. LIVE STRONG.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: shouldReduce ? 0 : 0.1 }}
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              fontWeight: 600,
              color: '#252A2E',
              margin: '0 auto 2.25rem auto',
              maxWidth: '560px',
              lineHeight: 1.6,
            }}
          >
            Our floor is built for athletes who prioritize discipline, focused coaching, and measurable progress.
          </motion.p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Primary JOIN NOW CTA */}
            <motion.div
              whileHover={shouldReduce ? {} : { y: -2 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setBtnHover(true)}
              onHoverEnd={() => setBtnHover(false)}
            >
              <Link
                to="/membership"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#1A1D20',
                  color: '#FFFFFF',
                  padding: '0.9rem 1.8rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: btnHover ? '0 8px 24px rgba(0, 0, 0, 0.25)' : '0 4px 14px rgba(0, 0, 0, 0.15)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <span>JOIN NOW</span>
                <motion.span
                  animate={btnHover ? { x: 3 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-flex' }}
                >
                  <AnimatedArrow size={16} color="var(--color-yellow, #F4C400)" />
                </motion.span>
              </Link>
            </motion.div>

            {/* Secondary Contact Link */}
            <motion.div
              whileHover={shouldReduce ? {} : { y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  color: '#1A1D20',
                  border: '2px solid #1A1D20',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                }}
              >
                <span>Visit the Gym</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisualCTASection;
