import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { GYM_INFO } from '../../data/gymData';

// Fade-up reveal — used for footer columns
const REVEAL = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};
const VIEWPORT = { once: true, amount: 0.15 };

/**
 * Footer — Clean, Focused Footer
 * Retains: LEE GYM branding, navigation links, operating hours, contact info.
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

  const tx = (delay = 0) => ({
    duration: shouldReduce ? 0 : 0.45,
    ease: [0.22, 1, 0.36, 1],
    delay: shouldReduce ? 0 : delay,
  });

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand & Tagline */}
          <motion.div
            variants={REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={tx(0)}
          >
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
              <motion.svg
                animate={logoHover && !shouldReduce ? { rotate: -8, y: -1 } : { rotate: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect x="2"    y="8"    width="3.5" height="12" rx="1"   fill="#F4C400" />
                <rect x="6.5"  y="6"    width="2"   height="16" rx="0.5" fill="#F4C400" />
                <rect x="8.5"  y="12.5" width="11"  height="3"           fill="#F4C400" />
                <rect x="19.5" y="6"    width="2"   height="16" rx="0.5" fill="#F4C400" />
                <rect x="22.5" y="8"    width="3.5" height="12" rx="1"   fill="#F4C400" />
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
                maxWidth: '280px',
                margin: 0,
              }}
            >
              Train Hard. Live Strong. A serious training facility in Pallapalayam, Coimbatore.
            </p>
          </motion.div>

          {/* Col 2: Navigation */}
          <motion.div
            variants={REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={tx(0.07)}
          >
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
          </motion.div>

          {/* Col 3: Hours */}
          <motion.div
            variants={REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={tx(0.14)}
          >
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {GYM_INFO.hours.map((slot) => (
                <div key={slot.days}>
                  <span
                    style={{
                      fontWeight: 700,
                      display: 'block',
                      color: '#FFFFFF',
                      fontSize: '0.84rem',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {slot.days}
                  </span>
                  {slot.closed ? (
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#A83D3D',
                      }}
                    >
                      Closed
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {slot.sessions.map((s) => (
                        <span key={s.label} style={{ color: '#A0AAB2', fontSize: '0.82rem' }}>
                          {s.open} – {s.close}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 4: Contact — all icons in LEE GYM palette, no brand colors */}
          <motion.div
            variants={REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={tx(0.21)}
          >
            <h4
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                color: 'var(--color-yellow, #F4C400)',
                margin: '0 0 1rem 0',
              }}
            >
              CONTACT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

              <a href={GYM_INFO.googleMaps} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                  <MapPin size={14} color="#F4C400" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#C2CBD1', lineHeight: 1.5 }}>{GYM_INFO.address}</span>
                </div>
              </a>

              <a href={`tel:${GYM_INFO.phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Phone size={14} color="#F4C400" />
                  <span style={{ fontSize: '0.82rem', color: '#C2CBD1' }}>{GYM_INFO.phone}</span>
                </div>
              </a>

              <a href={GYM_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <MessageCircle size={14} color="#F4C400" />
                  <span style={{ fontSize: '0.82rem', color: '#C2CBD1' }}>{GYM_INFO.whatsapp} (WhatsApp)</span>
                </div>
              </a>

              <a href={`mailto:${GYM_INFO.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Mail size={14} color="#F4C400" />
                  <span style={{ fontSize: '0.82rem', color: '#C2CBD1' }}>{GYM_INFO.email}</span>
                </div>
              </a>

              <a href={GYM_INFO.socials[0].url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Instagram size={14} color="#F4C400" />
                  <span style={{ fontSize: '0.82rem', color: '#C2CBD1' }}>{GYM_INFO.socials[0].handle}</span>
                </div>
              </a>

            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
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
          <span>&copy; {currentYear} LEE GYM. All rights reserved.</span>
          <span style={{ color: '#A0AAB2' }}>Train Hard. Live Strong.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
