import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Clock, Check, Send } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import { GYM_INFO } from '../../data/gymData';

function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Membership Inquiry',
    message: '',
  });

  const shouldReduce = useReducedMotion();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setFormSubmitted(true);
  };

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
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
            }}
          >
            {/* Left: Hours & Information */}
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  color: 'var(--color-charcoal)',
                  marginBottom: '1.25rem',
                }}
              >
                OPERATING HOURS
              </h3>

              <div
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid rgba(37,42,46,0.1)',
                  borderRadius: '4px',
                  padding: '1.75rem',
                  marginBottom: '2rem',
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: '4px solid var(--color-yellow)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {GYM_INFO.hours.map((schedule, idx) => (
                    <div
                      key={schedule.days}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: idx !== GYM_INFO.hours.length - 1 ? '1rem' : 0,
                        borderBottom: idx !== GYM_INFO.hours.length - 1 ? '1px solid rgba(37,42,46,0.06)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Clock size={16} color="var(--color-slate)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                          {schedule.days}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          color: 'var(--color-charcoal)',
                          backgroundColor: 'var(--color-warm-bg)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '2px',
                        }}
                      >
                        {schedule.open} – {schedule.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-white)',
                  borderRadius: '4px',
                  padding: '1.75rem',
                  borderLeft: '4px solid var(--color-yellow)',
                }}
              >
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    color: 'var(--color-white)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  DIRECT VISITS
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#C2CBD1',
                    margin: 0,
                  }}
                >
                  Walk-ins for day passes and membership questions are welcome during standard hours. Speak directly with on-duty coaches.
                </p>
              </div>
            </div>

            {/* Right: Message Form */}
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.1)',
                borderRadius: '4px',
                padding: 'clamp(2rem, 4vw, 2.75rem)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  color: 'var(--color-charcoal)',
                  margin: '0 0 0.5rem 0',
                }}
              >
                SEND AN INQUIRY
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--color-slate)',
                  margin: '0 0 1.75rem 0',
                }}
              >
                Send a message and a team member will follow up with you.
              </p>

              {formSubmitted ? (
                <div
                  style={{
                    backgroundColor: 'rgba(47, 125, 74, 0.1)',
                    border: '1px solid rgba(47, 125, 74, 0.25)',
                    borderRadius: '4px',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto',
                      color: 'var(--color-white)',
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-charcoal)', margin: '0 0 0.5rem 0' }}>
                    MESSAGE RECEIVED
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-slate)', margin: 0 }}>
                    Thank you. We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label
                      htmlFor="contact-name"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-charcoal)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(37,42,46,0.2)',
                        borderRadius: '2px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-charcoal)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your.email@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(37,42,46,0.2)',
                        borderRadius: '2px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-charcoal)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Inquiry Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(37,42,46,0.2)',
                        borderRadius: '2px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--color-white)',
                      }}
                    >
                      <option value="Membership Inquiry">Membership Inquiry</option>
                      <option value="Day Pass Drop-In">Day Pass Drop-In</option>
                      <option value="Coaching Programs">Coaching Programs</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-charcoal)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(37,42,46,0.2)',
                        borderRadius: '2px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'var(--color-yellow)',
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
                    <span>Submit Inquiry</span>
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
