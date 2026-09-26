import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'About',      to: '/about' },
  { label: 'Programs',   to: '/programs' },
  { label: 'Trainers',   to: '/trainers' },
  { label: 'Membership', to: '/membership' },
  { label: 'Gallery',    to: '/gallery' },
  { label: 'Contact',    to: '/contact' },
];

/**
 * Navbar — Exact Match to Reference Image
 * Left: Dumbbell icon + LEE (black) GYM (yellow)
 * Center: Home, About, Programs, Trainers, Membership, Gallery, Contact
 * Right: Divider line | Split "JOIN NOW [→]" button | Hamburger icon
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
    const onResize = () => { if (window.innerWidth >= 992) setIsOpen(false); };
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
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isScrolled ? '0 2px 14px rgba(0,0,0,0.06)' : 'none',
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
          {/* ── 1. Logo (Dumbbell + LEE GYM) ───────────────────────── */}
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
            {/* Dumbbell SVG matching reference */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              {/* Left Outer Plate */}
              <rect x="2" y="8" width="3.5" height="12" rx="1" fill="#1A1D20" />
              {/* Left Inner Plate */}
              <rect x="6.5" y="6" width="2" height="16" rx="0.5" fill="#1A1D20" />
              {/* Center Bar */}
              <rect x="8.5" y="12.5" width="11" height="3" fill="#1A1D20" />
              {/* Right Inner Plate */}
              <rect x="19.5" y="6" width="2" height="16" rx="0.5" fill="#1A1D20" />
              {/* Right Outer Plate */}
              <rect x="22.5" y="8" width="3.5" height="12" rx="1" fill="#1A1D20" />
            </svg>

            {/* Wordmark */}
            <span
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.9rem',
                lineHeight: 1,
                letterSpacing: '0.04em',
                color: '#1A1D20',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>LEE</span>
              <span style={{ color: 'var(--color-yellow, #F4C400)' }}>GYM</span>
            </span>
          </Link>

          {/* ── 2. Navigation Links ─────────────────────────────────── */}
          <nav
            id="navbar-links"
            aria-label="Main Navigation"
            className="hidden lg:flex"
            style={{
              alignItems: 'center',
              gap: '1.8rem',
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
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#1A1D20' : '#4B555D',
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
                          height: '2.5px',
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
            {/* Divider Line */}
            <div
              className="hidden lg:block"
              style={{
                width: '1px',
                height: '32px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              }}
            />

            {/* Split "JOIN NOW [→]" CTA Button (Exact Reference Match) */}
            <Link
              to="/membership"
              id="navbar-join-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                textDecoration: 'none',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(244, 196, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* Yellow Left Side */}
              <span
                style={{
                  backgroundColor: 'var(--color-yellow, #F4C400)',
                  color: '#1A1D20',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.7rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                JOIN NOW
              </span>

              {/* Black Right Side with White Arrow */}
              <span
                style={{
                  backgroundColor: '#1A1D20',
                  color: '#FFFFFF',
                  padding: '0.7rem 0.95rem',
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

            {/* Hamburger Menu Toggle (Three Horizontal Lines) */}
            <button
              id="navbar-hamburger-btn"
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                width: '36px',
                height: '36px',
              }}
            >
              {isOpen ? (
                <X size={24} color="#1A1D20" />
              ) : (
                <>
                  <span style={{ width: '22px', height: '2px', backgroundColor: '#1A1D20', display: 'block', borderRadius: '1px' }} />
                  <span style={{ width: '22px', height: '2px', backgroundColor: '#1A1D20', display: 'block', borderRadius: '1px' }} />
                  <span style={{ width: '22px', height: '2px', backgroundColor: '#1A1D20', display: 'block', borderRadius: '1px' }} />
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
              backgroundColor: '#FFFFFF',
              borderBottom: '2px solid var(--color-yellow, #F4C400)',
              padding: '1.5rem',
              zIndex: 99,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
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
                    color: '#1A1D20',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
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
