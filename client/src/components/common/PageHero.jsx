import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * PageHero — High-impact athletic subpage header.
 * Maintains cohesive visual identity with the reference hero:
 * - Bold display typography (Bebas Neue)
 * - Yellow slash accents & speed lines
 * - Charcoal & warm background rhythm
 * - Clean breadcrumbs
 */
function PageHero({
  badge,
  title,
  highlight,
  description,
  breadcrumbs = [],
  watermark,
  accentNumber,
}) {
  const shouldReduce = useReducedMotion();

  return (
    <section
      aria-label={`${title || ''} ${highlight || ''}`}
      style={{
        paddingTop: 'calc(var(--navbar-height, 72px) + clamp(2rem, 5vw, 4rem))',
        paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
        backgroundColor: 'var(--color-warm-bg, #F7F5EF)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Background Ghost Watermark */}
      {watermark && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-1%',
            bottom: '-15%',
            fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(7rem, 20vw, 18rem)',
            color: 'rgba(37, 42, 46, 0.04)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 0.8,
            letterSpacing: '0.04em',
            zIndex: 0,
          }}
        >
          {watermark}
        </span>
      )}

      {/* Speed Stripe Accent on the right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '5%',
          top: 0,
          bottom: 0,
          display: 'flex',
          gap: '12px',
          transform: 'skewX(-24deg)',
          pointerEvents: 'none',
          opacity: 0.35,
          zIndex: 0,
        }}
      >
        <div style={{ width: '12px', height: '100%', backgroundColor: 'var(--color-yellow, #F4C400)' }} />
        <div style={{ width: '24px', height: '100%', backgroundColor: 'var(--color-yellow, #F4C400)' }} />
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
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.8rem',
            color: 'var(--color-slate, #4B555D)',
          }}
        >
          <Link
            to="/"
            style={{
              color: 'var(--color-charcoal, #252A2E)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-yellow, #F4C400)', fontWeight: 800 }}>/</span>
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  style={{
                    color: 'var(--color-charcoal, #252A2E)',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: 'var(--color-charcoal, #252A2E)', fontWeight: 700 }}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Eyebrow Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, x: shouldReduce ? 0 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
            }}
          >
            <span
              style={{
                width: '24px',
                height: '3.5px',
                backgroundColor: 'var(--color-yellow, #F4C400)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-charcoal, #252A2E)',
              }}
            >
              {badge}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.div
          initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
              lineHeight: 0.92,
              letterSpacing: '0.02em',
              margin: '0 0 1rem 0',
              color: 'var(--color-charcoal, #252A2E)',
            }}
          >
            {title}{' '}
            {highlight && (
              <span style={{ color: 'var(--color-yellow, #F4C400)' }}>
                {highlight}
              </span>
            )}
          </h1>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
              lineHeight: 1.6,
              color: 'var(--color-slate, #4B555D)',
              maxWidth: '680px',
              margin: 0,
            }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default PageHero;
