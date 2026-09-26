import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About',      to: '/about' },
  { label: 'Programs',   to: '/programs' },
  { label: 'Membership', to: '/membership' },
  { label: 'Gallery',    to: '/gallery' },
  { label: 'Contact',    to: '/contact' },
];

/**
 * Navbar — Exact Match to Reference Design + Premium Motion
 * Left: Bold Dumbbell icon + bold LEE (#252A2E) GYM (#F4C400)
 * Center (Desktop): Home (with sliding yellow underline), About, Programs, Membership, Gallery, Contact
 * Right (Desktop): Divider line | Split "JOIN NOW [→]" button with directional arrow thrust
 * Right (Mobile): Beautifully animated 3-bar hamburger-to-close morph
 * Mobile Drawer: Choreographed clip-path and staggered item reveals
 * Clean cream/off-white background (#FBF8F2).
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        id="navbar"
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--navbar-height, 72px)',
          backgroundColor: '#FBF8F2',
          borderBottom: '1px solid rgba(37, 42, 46, 0.07)',
          boxShadow: isScrolled ? '0 4px 18px rgba(37, 42, 46, 0.07)' : 'none',
          transition: 'box-shadow 220ms ease',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            height: '100%',
            padding: '0 clamp(1.25rem, 3.5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── 1. Logo (Bold Dumbbell + LEE GYM) ────────────────────── */}
          <Link
            to="/"
            id="navbar-logo"
            aria-label="Lee Gym — Home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
              whileHover={shouldReduce ? {} : { y: -1 }}
              whileTap={shouldReduce ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {/* Bold Dumbbell SVG matching reference */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                {/* Left Outer Plate */}
                <rect x="2" y="9" width="4" height="14" rx="1.5" fill="#252A2E" />
                {/* Left Inner Plate */}
                <rect x="7.5" y="7" width="3" height="18" rx="1" fill="#252A2E" />
                {/* Center Bar */}
                <rect x="10.5" y="14" width="11" height="4" rx="0.5" fill="#252A2E" />
                {/* Right Inner Plate */}
                <rect x="21.5" y="7" width="3" height="18" rx="1" fill="#252A2E" />
                {/* Right Outer Plate */}
                <rect x="26" y="9" width="4" height="14" rx="1.5" fill="#252A2E" />
              </svg>

              {/* Wordmark: Heavy & condensed */}
              <span
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", "Impact", sans-serif)',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  WebkitTextStroke: '0.4px currentColor',
                  lineHeight: 1,
                  letterSpacing: '0.04em',
                  color: '#252A2E',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span style={{ color: '#252A2E' }}>LEE</span>
                <span style={{ color: 'var(--color-yellow, #F4C400)' }}>GYM</span>
              </span>
            </motion.div>
          </Link>

          {/* ── 2. Navigation Links (Desktop Only) ─────────────────── */}
          <nav
            id="navbar-links"
            aria-label="Main Navigation"
            className="hidden lg:flex"
            style={{
              alignItems: 'center',
              gap: '2.1rem',
              margin: '0 auto',
            }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <motion.span
                    whileHover={shouldReduce ? {} : { y: -1.5 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      padding: '0.5rem 0',
                      fontFamily: 'var(--font-body, "Inter", sans-serif)',
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#252A2E' : '#4B555D',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-line"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          backgroundColor: 'var(--color-yellow, #F4C400)',
                          borderRadius: '1px',
                        }}
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── 3. Right Action Block ──────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            {/* Divider Line (Desktop only) */}
            <div
              className="hidden lg:block"
              style={{
                width: '1px',
                height: '30px',
                backgroundColor: 'rgba(37, 42, 46, 0.16)',
              }}
            />

            {/* Split "JOIN NOW [→]" CTA Button (Desktop only — removed on mobile) */}
            <motion.div
              className="hidden lg:inline-flex"
              whileHover={shouldReduce ? {} : { y: -2, boxShadow: '0 6px 20px rgba(244, 196, 0, 0.45)' }}
              whileTap={shouldReduce ? {} : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              onHoverStart={() => setBtnHover(true)}
              onHoverEnd={() => setBtnHover(false)}
              style={{
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(37, 42, 46, 0.08)',
              }}
            >
              <Link
                to="/membership"
                id="navbar-join-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'stretch',
                  textDecoration: 'none',
                }}
              >
                {/* Yellow Left Side */}
                <span
                  style={{
                    backgroundColor: 'var(--color-yellow, #F4C400)',
                    color: '#252A2E',
                    fontFamily: 'var(--font-body, "Inter", sans-serif)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.72rem 1.35rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  JOIN NOW
                </span>

                {/* Dark Right Side with Animated Arrow */}
                <span
                  style={{
                    backgroundColor: '#252A2E',
                    color: '#FFFFFF',
                    padding: '0.72rem 0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    aria-hidden="true"
                    animate={btnHover && !shouldReduce ? { x: 3.5 } : { x: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <path d="M2.5 7.5H12.5M8 3L12.5 7.5L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </span>
              </Link>
            </motion.div>

            {/* Hamburger Menu Toggle (Mobile only — smooth morph into close 'X') */}
            <button
              id="navbar-hamburger-btn"
              type="button"
              className="flex lg:hidden"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem',
                cursor: 'pointer',
                position: 'relative',
                width: '38px',
                height: '38px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Top Bar */}
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: shouldReduce ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: '#252A2E',
                  borderRadius: '1.5px',
                  marginBottom: '5px',
                  transformOrigin: 'center',
                  display: 'block',
                }}
              />
              {/* Middle Bar */}
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: shouldReduce ? 0.05 : 0.2, ease: 'easeInOut' }}
                style={{
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: '#252A2E',
                  borderRadius: '1.5px',
                  marginBottom: '5px',
                  transformOrigin: 'center',
                  display: 'block',
                }}
              />
              {/* Bottom Bar */}
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: shouldReduce ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '24px',
                  height: '2.5px',
                  backgroundColor: '#252A2E',
                  borderRadius: '1.5px',
                  transformOrigin: 'center',
                  display: 'block',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Dropdown (Choreographed Staggered Reveal) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, y: -10, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: shouldReduce ? 0.1 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 'var(--navbar-height, 72px)',
              left: 0,
              right: 0,
              backgroundColor: '#FBF8F2',
              borderBottom: '3px solid var(--color-yellow, #F4C400)',
              padding: '1.5rem 1.75rem 2rem',
              zIndex: 99,
              boxShadow: '0 16px 36px rgba(37, 42, 46, 0.12)',
            }}
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: shouldReduce ? 0 : 0.05, delayChildren: 0.03 } },
                closed: { transition: { staggerChildren: shouldReduce ? 0 : 0.02, staggerDirection: -1 } },
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{
                    open: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
                    closed: { opacity: 0, x: -14, transition: { duration: 0.18 } },
                  }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setIsOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ isActive }) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0',
                          borderBottom: '1px solid rgba(37, 42, 46, 0.06)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                            fontSize: '1.95rem',
                            letterSpacing: '0.04em',
                            color: isActive ? '#252A2E' : '#4B555D',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                          }}
                        >
                          {isActive && (
                            <span
                              style={{
                                width: '5px',
                                height: '22px',
                                backgroundColor: '#F4C400',
                                display: 'inline-block',
                                borderRadius: '1px',
                              }}
                            />
                          )}
                          {link.label}
                        </span>

                        {isActive && (
                          <span
                            style={{
                              fontFamily: 'var(--font-body, "Inter", sans-serif)',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              letterSpacing: '0.12em',
                              color: '#252A2E',
                              backgroundColor: 'var(--color-yellow, #F4C400)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '2px',
                              textTransform: 'uppercase',
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </motion.div>
              ))}

              {/* OWNER LOGIN — Discrete owner entry point */}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
                  closed: { opacity: 0, x: -14, transition: { duration: 0.18 } },
                }}
              >
                <NavLink
                  to="/owner/login"
                  onClick={() => setIsOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  {({ isActive }) => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0',
                        borderTop: '1px dashed rgba(37, 42, 46, 0.18)',
                        marginTop: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                          fontSize: '1.75rem',
                          letterSpacing: '0.04em',
                          color: isActive ? '#F4C400' : '#4B555D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        {isActive && (
                          <span
                            style={{
                              width: '5px',
                              height: '20px',
                              backgroundColor: '#F4C400',
                              display: 'inline-block',
                              borderRadius: '1px',
                            }}
                          />
                        )}
                        OWNER LOGIN
                      </span>

                      {isActive && (
                        <span
                          style={{
                            fontFamily: 'var(--font-body, "Inter", sans-serif)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            color: '#252A2E',
                            backgroundColor: 'var(--color-yellow, #F4C400)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '2px',
                            textTransform: 'uppercase',
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
