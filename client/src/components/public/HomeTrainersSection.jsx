import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Quote } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { TRAINERS } from '../../data/gymData';

function HomeTrainersSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="trainers-preview"
      style={{
        padding: 'clamp(4rem, 8vw, 6.5rem) 0',
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
        <SectionHeader
          tag="COACHING MASTERY"
          title="MEET THE COACHES WHO HOLD"
          highlight="THE STANDARD."
          description="Every coach at Lee Gym is a seasoned athlete and accredited movement specialist. We teach, spot, analyze, and demand your personal best."
          linkTo="/trainers"
          linkText="Meet All Coaches"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 'clamp(1.5rem, 2.5vw, 2rem)',
          }}
        >
          {TRAINERS.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: shouldReduce ? 0 : index * 0.1 }}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.08)',
                borderRadius: '3px',
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 250ms ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--color-yellow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(37,42,46,0.08)';
              }}
            >
              <div>
                {/* Header Tag & Credentials */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-charcoal)',
                      backgroundColor: 'rgba(244, 196, 0, 0.25)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '2px',
                    }}
                  >
                    {trainer.tag}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: 'var(--color-slate)',
                      fontWeight: 600,
                    }}
                  >
                    {trainer.experience}
                  </span>
                </div>

                {/* Name & Role */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)',
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                    color: 'var(--color-charcoal)',
                    margin: '0 0 0.4rem 0',
                  }}
                >
                  {trainer.name}
                </h3>

                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    color: 'var(--color-slate)',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}
                >
                  {trainer.role}
                </div>

                {/* Credential pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.74rem',
                    color: 'var(--color-charcoal)',
                    backgroundColor: 'var(--color-warm-bg)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '2px',
                    marginBottom: '1.25rem',
                    width: '100%',
                  }}
                >
                  <Award size={14} color="var(--color-yellow)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{trainer.credentials}</span>
                </div>

                {/* Quote */}
                <div
                  style={{
                    position: 'relative',
                    paddingLeft: '1rem',
                    borderLeft: '2px solid var(--color-yellow)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      fontStyle: 'italic',
                      color: 'var(--color-slate)',
                      margin: 0,
                    }}
                  >
                    &ldquo;{trainer.quote}&rdquo;
                  </p>
                </div>

                {/* Specialties Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {trainer.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        color: 'var(--color-slate)',
                        backgroundColor: 'var(--color-warm-bg)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2px',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div
                style={{
                  borderTop: '1px solid rgba(37,42,46,0.06)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--color-slate)',
                    fontWeight: 600,
                  }}
                >
                  {trainer.instagram}
                </span>

                <Link
                  to="/trainers"
                  style={{
                    color: 'var(--color-charcoal)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>Profile</span>
                  <ArrowRight size={13} color="var(--color-yellow)" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTrainersSection;
