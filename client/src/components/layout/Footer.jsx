import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GYM_INFO } from '../../data/gymData';

/**
 * Footer — Clean, Focused Footer
 * Retains: LEE GYM branding, navigation links, operating hours, and copyright.
 * Retains exact layout and visual design.
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  const shouldReduce = useReducedMotion();
  const [logoHover, setLogoHover] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Programs', to: '/programs' },
    { label: 'Membership', to: '/membership' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-charcoal, #252A2E)',
        color: 'var(--color-white)',
        paddingTop: 'clamp(3rem, 6vw, 4.5rem)',
        paddingBottom: '2.5rem',
        borderTop: '3px solid var(--color-yellow, #F4C400)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand & Tagline */}
          <div>
            <Link
              to="/"
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              {/* Dumbbell Icon */}
              <motion.svg
                animate={logoHover && !shouldReduce ? { rotate: -8, y: -1 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect x="2" y="8" width="3.5" height="12" rx="1" fill="#F4C400" />
                <rect x="6.5" y="6" width="2" height="16" rx="0.5" fill="#F4C400" />
                <rect x="8.5" y="12.5" width="11" height="3" fill="#F4C400" />
                <rect x="19.5" y="6" width="2" height="16" rx="0.5" fill="#F4C400" />
                <rect x="22.5" y="8" width="3.5" height="12" rx="1" fill="#F4C400" />
              </motion.svg>

              <span
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.8rem',
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                }}
              >
                LEE <span style={{ color: 'var(--color-yellow, #F4C400)' }}>GYM</span>
              </span>
            </Link>

            <p
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: '#A0AAB2',
                maxWidth: '300px',
                margin: '0 0 1rem 0',
              }}
            >
              Train Hard. Live Strong. An authentic facility built for focused athletic progression.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                color: 'var(--color-yellow, #F4C400)',
                margin: '0 0 1rem 0',
              }}
            >
              NAVIGATION
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {navLinks.map((link) => (
                <li key={link.to}>
                  <motion.div
                    whileHover={shouldReduce ? {} : { x: 4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link
                      to={link.to}
                      style={{
                        fontFamily: 'var(--font-body, "Inter", sans-serif)',
                        fontSize: '0.86rem',
                        color: '#C2CBD1',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-yellow, #F4C400)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#C2CBD1')}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hours */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                color: 'var(--color-yellow, #F4C400)',
                margin: '0 0 1rem 0',
              }}
            >
              HOURS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {GYM_INFO.hours.map((h) => (
                <div key={h.days} style={{ fontSize: '0.86rem', color: '#C2CBD1' }}>
                  <span style={{ fontWeight: 600, display: 'block', color: '#FFFFFF' }}>{h.days}</span>
                  <span style={{ color: '#A0AAB2' }}>{h.open} – {h.close}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#7E8B95',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
          }}
        >
          <span>&copy; {currentYear} Lee Gym. All rights reserved.</span>
          <span style={{ color: '#A0AAB2' }}>Train Hard. Live Strong.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
