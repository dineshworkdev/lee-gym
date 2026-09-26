import { Link } from 'react-router-dom';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';

/**
 * VisualCTASection — High-Energy Closing Banner
 * Pure athletic closing call to action without fake trial codes or promotional generators.
 */
function VisualCTASection() {
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
      <div
        aria-hidden="true"
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
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2
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
          </h2>

          <p
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
          </p>

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
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              }}
            >
              <span>JOIN NOW</span>
              <AnimatedArrow size={16} color="var(--color-yellow, #F4C400)" />
            </Link>

            {/* Secondary Contact Link */}
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
              }}
            >
              <span>Visit the Gym</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisualCTASection;
