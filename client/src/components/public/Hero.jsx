import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * Hero — Exact implementation matching the Lee Gym reference design.
 *
 * Artwork Asset Rule:
 * - Desktop / Laptop / Tablet Landscape: /images/hero/hero-main.png
 * - Mobile / Portrait: /images/hero/hero-mobile.png
 * Both images already contain the complete visual artwork (dumbbell, yellow diagonal shapes,
 * cream background, shadows, dot grids, curved lines, decorative geometry).
 * No CSS/SVG recreation of the artwork.
 *
 * Layering:
 * Hero
 * ├── Background artwork image (<picture>)
 * ├── HTML hero content (Headline, Subtext, CTA, Indicators)
 */
function Hero() {
  const shouldReduce = useReducedMotion();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.12,
        delayChildren: shouldReduce ? 0 : 0.05,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0.1 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Lee Gym — Train Hard. Live Strong."
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FBF8F2',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* ── 1. BACKGROUND ARTWORK IMAGE (Responsive <picture>) ─────── */}
      <picture
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Mobile & Portrait Tablet */}
        <source
          media="(max-width: 768px), (max-width: 920px) and (orientation: portrait)"
          srcSet="/images/hero/hero-mobile.png"
        />
        {/* Desktop / Laptop / Tablet Landscape */}
        <img
          src="/images/hero/hero-main.png"
          alt=""
          loading="eager"
          fetchPriority="high"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />
      </picture>

      {/* ── 2. DESKTOP LEFT VERTICAL INDEX (01 / 02 / 03) ──────────── */}
      <div
        className="hidden xl:flex"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'clamp(1.25rem, 2.8vw, 3rem)',
          top: '48%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          gap: '1.25rem',
          zIndex: 15,
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#F4C400',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#252A2E',
              letterSpacing: '0.05em',
            }}
          >
            01
          </span>
        </div>
        <div style={{ paddingLeft: '0.82rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#8A9299',
              letterSpacing: '0.05em',
            }}
          >
            02
          </span>
        </div>
        <div style={{ paddingLeft: '0.82rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#8A9299',
              letterSpacing: '0.05em',
            }}
          >
            03
          </span>
        </div>
      </div>

      {/* ── 3. HTML HERO CONTENT ─────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          paddingTop: 'calc(var(--navbar-height, 72px) + clamp(1.5rem, 3.5vw, 3.5rem))',
          paddingBottom: 'clamp(4.5rem, 7vw, 6.5rem)',
          paddingLeft: 'clamp(1.5rem, 7.5vw, 8.5rem)',
          paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: 'min(100%, 640px)',
          }}
        >
          {/* Main Headline: TRAIN / HARD. / LIVE STRONG. */}
          <h1
            aria-label="TRAIN HARD. LIVE STRONG."
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", "Impact", sans-serif)',
              fontSize: 'clamp(3.8rem, 8.6vw, 8.8rem)',
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Line 1: TRAIN */}
            <motion.span
              variants={lineVariants}
              style={{
                color: '#252A2E',
                display: 'block',
                WebkitTextStroke: '1.2px #252A2E',
              }}
            >
              TRAIN
            </motion.span>

            {/* Line 2: HARD. */}
            <motion.span
              variants={lineVariants}
              style={{
                color: '#252A2E',
                display: 'inline-flex',
                alignItems: 'baseline',
                WebkitTextStroke: '1.2px #252A2E',
              }}
            >
              HARD
              {/* Yellow square dot matching reference */}
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '0.13em',
                  height: '0.13em',
                  backgroundColor: '#F4C400',
                  marginLeft: '0.07em',
                  verticalAlign: 'baseline',
                  WebkitTextStroke: '0',
                }}
              />
            </motion.span>

            {/* Line 3: LIVE STRONG. */}
            <motion.span
              variants={lineVariants}
              style={{
                color: '#F4C400',
                display: 'inline-flex',
                alignItems: 'baseline',
                WebkitTextStroke: '1.2px #F4C400',
              }}
            >
              LIVE STRONG
              {/* Yellow square dot matching reference */}
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '0.13em',
                  height: '0.13em',
                  backgroundColor: '#F4C400',
                  marginLeft: '0.07em',
                  verticalAlign: 'baseline',
                  WebkitTextStroke: '0',
                }}
              />
            </motion.span>
          </h1>

          {/* Supporting Text */}
          <motion.p
            variants={lineVariants}
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: 'clamp(0.72rem, 1.05vw, 0.92rem)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#252A2E',
              margin: 'clamp(1.2rem, 2.2vw, 1.8rem) 0 0 0',
              lineHeight: 1.45,
              maxWidth: '520px',
            }}
          >
            BUILT FOR PEOPLE WHO TAKE TRAINING SERIOUSLY.
          </motion.p>

          {/* Reference CTA Button: Split Rectangular [ JOIN NOW ] [ → ] */}
          <motion.div
            variants={lineVariants}
            style={{
              marginTop: 'clamp(1.6rem, 2.8vw, 2.4rem)',
            }}
          >
            <Link
              to="/membership"
              id="hero-join-now-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                textDecoration: 'none',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(37, 42, 46, 0.12)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 196, 0, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 42, 46, 0.12)';
              }}
            >
              {/* Yellow Left Block */}
              <span
                style={{
                  backgroundColor: '#F4C400',
                  color: '#252A2E',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: 'clamp(0.85rem, 1.2vw, 1.05rem) clamp(1.6rem, 2.2vw, 2.4rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                JOIN NOW
              </span>

              {/* Dark Arrow Block */}
              <span
                style={{
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  padding: 'clamp(0.85rem, 1.2vw, 1.05rem) clamp(1.1rem, 1.5vw, 1.5rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── 4. BOTTOM BAR (Desktop / Tablet Landscape) ──────────────── */}
      <div
        className="hidden md:flex"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 'clamp(1.2rem, 2.5vh, 2rem)',
          left: 'clamp(1.5rem, 7.5vw, 8.5rem)',
          right: 'clamp(1.5rem, 5vw, 6rem)',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 15,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Bottom Left: Yellow Bar + STRENGTH / FITNESS / COMMUNITY */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              width: '22px',
              height: '5px',
              backgroundColor: '#F4C400',
              display: 'inline-block',
              borderRadius: '1px',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#4B555D',
              textTransform: 'uppercase',
            }}
          >
            STRENGTH &nbsp;/&nbsp; FITNESS &nbsp;/&nbsp; COMMUNITY
          </span>
        </div>

        {/* Bottom Center: SCROLL DOWN Mouse Icon */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '-0.25rem',
          }}
        >
          {/* Mouse outline */}
          <div
            style={{
              width: '18px',
              height: '28px',
              border: '1.5px solid #252A2E',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '5px',
            }}
          >
            <div
              style={{
                width: '2px',
                height: '6px',
                backgroundColor: '#252A2E',
                borderRadius: '1px',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#4B555D',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            SCROLL DOWN
          </span>
          {/* Vertical indicator line */}
          <div
            style={{
              width: '1.5px',
              height: '14px',
              backgroundColor: '#252A2E',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Bottom Right: DISCIPLINE / CONSISTENCY / PROGRESS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            lineHeight: 1.6,
            color: '#7B8288',
            textTransform: 'uppercase',
            textAlign: 'right',
          }}
        >
          <span>DISCIPLINE</span>
          <span>CONSISTENCY</span>
          <span>PROGRESS</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
