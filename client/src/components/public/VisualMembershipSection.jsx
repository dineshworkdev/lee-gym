import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';
import { MEMBERSHIP_PLANS } from '../../data/gymData';

/**
 * VisualMembershipSection — Clean Membership Overview
 * No invented pricing or fake benefit matrices.
 * Direct neutral information and primary JOIN NOW CTA.
 */
function VisualMembershipSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="membership-preview"
      style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) 0',
        backgroundColor: 'var(--color-warm-bg)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '20px', height: '3px', backgroundColor: 'var(--color-yellow)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-slate)',
                }}
              >
                Membership
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                lineHeight: 0.92,
                color: 'var(--color-charcoal)',
                margin: 0,
              }}
            >
              TRAINING ACCESS.
            </h2>
          </div>

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
                backgroundColor: 'var(--color-yellow)',
                color: '#1A1D20',
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.75rem 1.4rem',
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
                padding: '0.75rem 1rem',
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

        {/* 3 Clean Membership Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {MEMBERSHIP_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: shouldReduce ? 0 : idx * 0.08 }}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.1)',
                borderRadius: '4px',
                padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                borderTop: '4px solid var(--color-yellow)',
                minHeight: '260px',
              }}
            >
              <div>
                <span
                  style={{
                    backgroundColor: 'var(--color-warm-bg)',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '2px',
                    display: 'inline-block',
                    marginBottom: '0.75rem',
                  }}
                >
                  {plan.badge}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
                    lineHeight: 1,
                    color: 'var(--color-charcoal)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  {plan.name}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    color: 'var(--color-slate)',
                    margin: 0,
                  }}
                >
                  {plan.description}
                </p>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    color: 'var(--color-slate)',
                    margin: '0 0 1rem 0',
                    fontStyle: 'italic',
                  }}
                >
                  Contact the gym for membership options.
                </p>
                <Link
                  to="/membership"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--color-charcoal)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Inquire now</span>
                  <AnimatedArrow size={14} color="var(--color-charcoal)" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisualMembershipSection;
