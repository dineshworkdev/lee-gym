import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About',      to: '/about' },
  { label: 'Programs',   to: '/programs' },
  { label: 'Membership', to: '/membership' },
  { label: 'Gallery',    to: '/gallery' },
  { label: 'Contact',    to: '/contact' },
];

/**
 * Navbar — Exact Match to Reference Design
 * Left: Bold Dumbbell icon + bold LEE (#252A2E) GYM (#F4C400)
 * Center (Desktop): Home (with yellow underline), About, Programs, Membership, Gallery, Contact
 * Right (Desktop): Divider line | Split "JOIN NOW [→]" button
 * Right (Mobile): Hamburger icon only (☰) — NO JOIN NOW button on mobile navbar
 * Clean cream/off-white background (#FBF8F2), no glassmorphism, no blur, no transparent floating navbar.
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
          boxShadow: isScrolled ? '0 4px 16px rgba(37, 42, 46, 0.06)' : 'none',
          transition: 'box-shadow 200ms ease',
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
                  <span
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
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </span>
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
            <Link
              to="/membership"
              id="navbar-join-btn"
              className="hidden lg:inline-flex"
              style={{
                alignItems: 'stretch',
                textDecoration: 'none',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(37, 42, 46, 0.08)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(244, 196, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 42, 46, 0.08)';
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

              {/* Dark Right Side with Arrow */}
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
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M2.5 7.5H12.5M8 3L12.5 7.5L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Hamburger Menu Toggle (Mobile only — clearly visible at top-right) */}
            <button
              id="navbar-hamburger-btn"
              type="button"
              className="flex lg:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem',
                cursor: 'pointer',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                width: '36px',
                height: '36px',
              }}
            >
              {isOpen ? (
                <X size={26} color="#252A2E" />
              ) : (
                <>
                  <span style={{ width: '24px', height: '2.5px', backgroundColor: '#252A2E', display: 'block', borderRadius: '1px' }} />
                  <span style={{ width: '24px', height: '2.5px', backgroundColor: '#252A2E', display: 'block', borderRadius: '1px' }} />
                  <span style={{ width: '24px', height: '2.5px', backgroundColor: '#252A2E', display: 'block', borderRadius: '1px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Dropdown ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 'var(--navbar-height, 72px)',
              left: 0,
              right: 0,
              backgroundColor: '#FBF8F2',
              borderBottom: '2px solid var(--color-yellow, #F4C400)',
              padding: '1.5rem',
              zIndex: 99,
              boxShadow: '0 10px 30px rgba(37, 42, 46, 0.12)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    fontSize: '1.75rem',
                    letterSpacing: '0.04em',
                    color: '#252A2E',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
