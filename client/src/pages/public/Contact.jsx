import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Clock, Send, Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import { GYM_INFO } from '../../data/gymData';

// Shared animation variant — fade + upward reveal, viewport-triggered
const REVEAL = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

// Shared viewport config — triggers when 15% of element is visible, fires once
const VIEWPORT = { once: true, amount: 0.15 };

// Reusable label style for form fields
const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-charcoal)',
  marginBottom: '0.4rem',
};

// Reusable input / select style
const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  border: '1px solid rgba(37,42,46,0.2)',
  borderRadius: '2px',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#FFFFFF',
  color: 'var(--color-charcoal)',
};

function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: 'Membership Inquiry',
    message: '',
  });

  const shouldReduce = useReducedMotion();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setFormSubmitted(true);
  };

  // Transition shorthand
  const tx = (delay = 0) => ({
    duration: shouldReduce ? 0 : 0.45,
    ease: [0.22, 1, 0.36, 1],
    delay: shouldReduce ? 0 : delay,
  });

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="GET IN TOUCH"
        title="VISIT OR CONNECT"
        highlight="WITH LEE GYM."
        description="Have questions about facility access, training programs, or coaching? Reach out directly or visit during open floor hours."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'start',
            }}
          >
            {/* ── LEFT: Hours & Contact Info ──────────────────────── */}
            <div>
              {/* Section heading */}
              <motion.h2
                variants={REVEAL}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                transition={tx(0)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  color: 'var(--color-charcoal)',
                  marginBottom: '1.25rem',
                }}
              >
                OPERATING HOURS
              </motion.h2>

              {/* Hours card */}
              <motion.div
                variants={REVEAL}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                transition={tx(0.08)}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid rgba(37,42,46,0.1)',
                  borderRadius: '4px',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                  boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(37,42,46,0.07))',
                  borderLeft: '4px solid var(--color-yellow)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {GYM_INFO.hours.map((slot, idx) => (
                    <div
                      key={slot.days}
                      style={{
                        paddingBottom: idx !== GYM_INFO.hours.length - 1 ? '1.5rem' : 0,
                        borderBottom:
                          idx !== GYM_INFO.hours.length - 1
                            ? '1px solid rgba(37,42,46,0.07)'
                            : 'none',
                      }}
                    >
                      {/* Day label */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          marginBottom: slot.closed ? 0 : '0.65rem',
                        }}
                      >
                        <Clock size={15} color="var(--color-slate)" />
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            color: 'var(--color-charcoal)',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {slot.days}
                        </span>
                      </div>

                      {slot.closed ? (
                        /* Sunday CLOSED */
                        <span
                          style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#A83D3D',
                            backgroundColor: 'rgba(168,61,61,0.08)',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '2px',
                          }}
                        >
                          Closed
                        </span>
                      ) : (
                        /* Session time pills */
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem',
                          }}
                        >
                          {slot.sessions.map((s) => (
                            <div
                              key={s.label}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  color: 'var(--color-slate)',
                                  minWidth: '58px',
                                }}
                              >
                                {s.label}
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '0.86rem',
                                  fontWeight: 800,
                                  color: 'var(--color-charcoal)',
                                  backgroundColor: 'var(--color-warm-bg)',
                                  padding: '0.22rem 0.65rem',
                                  borderRadius: '2px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {s.open} – {s.close}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Contact Detail Cards ─────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Location */}
                <motion.a
                  variants={REVEAL}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  transition={tx(0.10)}
                  href={GYM_INFO.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      backgroundColor: '#252A2E',
                      borderRadius: '4px',
                      padding: '1rem 1.25rem',
                      borderLeft: '4px solid #F4C400',
                      transition: 'opacity 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <MapPin size={18} color="#F4C400" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#F4C400', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Location</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.55, color: '#FFFFFF' }}>{GYM_INFO.address}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: '#A0AAB2', marginTop: '0.2rem' }}>View on Google Maps →</div>
                    </div>
                  </div>
                </motion.a>

                {/* Phone */}
                <motion.a
                  variants={REVEAL}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  transition={tx(0.14)}
                  href={`tel:${GYM_INFO.phone.replace(/\s/g, '')}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(37,42,46,0.12)',
                      borderRadius: '4px',
                      padding: '0.85rem 1.25rem',
                      borderLeft: '4px solid #F4C400',
                      transition: 'box-shadow 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,42,46,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <Phone size={18} color="#252A2E" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#4B555D', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Phone</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: '#252A2E' }}>{GYM_INFO.phone}</div>
                    </div>
                  </div>
                </motion.a>

                {/* WhatsApp — LEE GYM palette, NOT green */}
                <motion.a
                  variants={REVEAL}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  transition={tx(0.18)}
                  href={GYM_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(37,42,46,0.12)',
                      borderRadius: '4px',
                      padding: '0.85rem 1.25rem',
                      borderLeft: '4px solid #F4C400',
                      transition: 'box-shadow 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,42,46,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <MessageCircle size={18} color="#252A2E" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#4B555D', textTransform: 'uppercase', marginBottom: '0.1rem' }}>WhatsApp</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: '#252A2E' }}>{GYM_INFO.whatsapp}</div>
                    </div>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  variants={REVEAL}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  transition={tx(0.22)}
                  href={`mailto:${GYM_INFO.email}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(37,42,46,0.12)',
                      borderRadius: '4px',
                      padding: '0.85rem 1.25rem',
                      borderLeft: '4px solid #F4C400',
                      transition: 'box-shadow 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,42,46,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <Mail size={18} color="#252A2E" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#4B555D', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Email</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: '#252A2E' }}>{GYM_INFO.email}</div>
                    </div>
                  </div>
                </motion.a>

                {/* Instagram — LEE GYM palette, NO gradient */}
                <motion.a
                  variants={REVEAL}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  transition={tx(0.26)}
                  href={GYM_INFO.socials[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#252A2E',
                      borderRadius: '4px',
                      padding: '0.85rem 1.25rem',
                      borderLeft: '4px solid #F4C400',
                      transition: 'opacity 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <Instagram size={18} color="#F4C400" />
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: '#F4C400', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Instagram</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{GYM_INFO.socials[0].handle}</div>
                    </div>
                  </div>
                </motion.a>

              </div>
            </div>

            {/* ── RIGHT: Inquiry Form ───────────────────────────── */}
            <motion.div
              variants={REVEAL}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              transition={tx(0.12)}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.1)',
                borderRadius: '4px',
                padding: 'clamp(2rem, 4vw, 2.75rem)',
                boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(37,42,46,0.07))',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  color: 'var(--color-charcoal)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                SEND AN INQUIRY
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--color-slate)',
                  margin: '0 0 1.75rem 0',
                  lineHeight: 1.6,
                }}
              >
                Leave your name and number — we'll call you back shortly.
              </p>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    backgroundColor: 'rgba(244,196,0,0.08)',
                    border: '1px solid rgba(244,196,0,0.3)',
                    borderRadius: '4px',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#252A2E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <motion.path
                        d="M5 13L9.5 17.5L19 7"
                        stroke="#F4C400"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
                      />
                    </svg>
                  </motion.div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.6rem',
                      color: 'var(--color-charcoal)',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    INQUIRY RECEIVED
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-slate)', margin: 0 }}>
                    Thank you. We will get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      style={inputStyle}
                    />
                  </div>

                  {/* Phone Number — replaces email */}
                  <div>
                    <label htmlFor="contact-phone" style={labelStyle}>Phone Number *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      style={inputStyle}
                    />
                  </div>

                  {/* Inquiry Topic */}
                  <div>
                    <label htmlFor="contact-subject" style={labelStyle}>Inquiry Topic</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Membership Inquiry">Membership Inquiry</option>
                      <option value="Day Pass Drop-In">Day Pass Drop-In</option>
                      <option value="Coaching Programs">Coaching Programs</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" style={labelStyle}>Message</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={shouldReduce ? {} : { y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#F4C400',
                      color: '#1A1D20',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '0.85rem 1.5rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>SEND MESSAGE</span>
                    <Send size={15} />
                  </motion.button>

                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <a
                      href={GYM_INFO.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-slate)',
                        textDecoration: 'none',
                        transition: 'color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-charcoal)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-slate)')}
                    >
                      <MessageCircle size={14} color="#252A2E" />
                      <span>Or reach us instantly on <strong style={{ color: 'var(--color-charcoal)' }}>WhatsApp</strong> →</span>
                    </a>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
