import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * Hero — Clean, High-Impact Athletic Hero Section.
 * Strictly focused on:
 * 1. Real uncropped hero artwork (hero-main.png & hero-mobile.png).
 * 2. Bold core headline: "TRAIN HARD. LIVE STRONG."
 * 3. Single primary "JOIN NOW [→]" CTA.
 * No tickers, fake statistics, unverified badges, or video placeholders.
 */
function Hero() {
  const shouldReduce = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <section
      id="hero"
      aria-label="Lee Gym — Train Hard. Live Strong."
      style={{
        paddingTop: 'var(--navbar-height, 72px)',
        width: '100%',
        backgroundColor: '#F8F6F0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP HERO (≥1024px)
          Uncropped artwork anchored right + Left-hand bold headline & single CTA
      ═══════════════════════════════════════════════════════════════ */}
      <div
        id="hero-desktop"
        className="hidden lg:block"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - var(--navbar-height, 72px))',
          maxHeight: '920px',
        }}
      >
        {/* Full uncropped artwork anchored to the right half */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            id="hero-desktop-image"
            src="/images/hero/hero-main.png"
            alt="Lee Gym athlete — Train Hard. Live Strong."
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'right center',
              userSelect: 'none',
            }}
            loading="eager"
            fetchpriority="high"
          />
        </div>

        {/* Content Overlay strictly positioned over the left negative space */}
        <div
          id="hero-desktop-content"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            paddingLeft: 'clamp(2.5rem, 6vw, 6.5rem)',
            paddingRight: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: 'min(46vw, 580px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.25rem, 2vw, 2rem)',
            }}
          >
            {/* Core Headline: TRAIN HARD. LIVE STRONG. */}
            <motion.div
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(4.5rem, 8.5vw, 8.5rem)',
                  lineHeight: 0.86,
                  letterSpacing: '0.01em',
                  margin: 0,
                  color: '#1A1D20',
                  userSelect: 'none',
                }}
              >
                <span style={{ display: 'block' }}>TRAIN HARD.</span>
                <span style={{ display: 'block', color: 'var(--color-yellow, #F4C400)' }}>
                  LIVE STRONG.
                </span>
              </h1>
            </motion.div>

            {/* Single Primary "JOIN NOW [→]" CTA Button */}
            <motion.div
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Link
                to="/membership"
                id="hero-cta-join"
                style={{
                  display: 'inline-flex',
                  alignItems: 'stretch',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: btnHover
                    ? '0 6px 20px rgba(244, 196, 0, 0.45)'
                    : '0 2px 10px rgba(0,0,0,0.1)',
                  transform: btnHover ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                }}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                <span
                  style={{
                    backgroundColor: 'var(--color-yellow, #F4C400)',
                    color: '#1A1D20',
                    fontFamily: 'var(--font-body, "Inter", sans-serif)',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '1rem 1.8rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  JOIN NOW
                </span>
                <span
                  style={{
                    backgroundColor: '#1A1D20',
                    color: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 8H13.5M8.5 3L13.5 8L8.5 13"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE / TABLET HERO (<1024px)
          Clean stacked flow with uncropped mobile artwork & single CTA
      ═══════════════════════════════════════════════════════════════ */}
      <div
        id="hero-mobile"
        className="block lg:hidden"
        style={{
          width: '100%',
          backgroundColor: '#F8F6F0',
        }}
      >
        <div
          style={{
            padding: 'clamp(2rem, 7vw, 3.5rem) clamp(1.25rem, 5vw, 2rem) 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(4rem, 16vw, 6rem)',
              lineHeight: 0.88,
              letterSpacing: '0.01em',
              margin: 0,
              color: '#1A1D20',
            }}
          >
            <span style={{ display: 'block' }}>TRAIN HARD.</span>
            <span style={{ display: 'block', color: 'var(--color-yellow, #F4C400)' }}>
              LIVE STRONG.
            </span>
          </h1>

          {/* Single Primary CTA */}
          <div>
            <Link
              to="/membership"
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                textDecoration: 'none',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <span
                style={{
                  backgroundColor: 'var(--color-yellow, #F4C400)',
                  color: '#1A1D20',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.85rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                JOIN NOW
              </span>
              <span
                style={{
                  backgroundColor: '#1A1D20',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 8H13.5M8.5 3L13.5 8L8.5 13"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Artwork — 100% natural, uncropped */}
        <div style={{ width: '100%', position: 'relative' }}>
          <img
            id="hero-mobile-image"
            src="/images/hero/hero-mobile.png"
            alt="Lee Gym athlete — Train Hard. Live Strong."
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
            }}
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
