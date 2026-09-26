import { motion, useReducedMotion } from 'motion/react';
import { Star, Trophy, Quote } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { TESTIMONIALS } from '../../data/gymData';

function HomeTestimonialsSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="member-stories"
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
          tag="REAL GAINS · REAL PEOPLE"
          title="MEASURED IN PRs,"
          highlight="NOT EMPTY PROMISES."
          description="Hear from everyday members who walk through our doors and consistently shatter their personal limits."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(1.5rem, 2.5vw, 2rem)',
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: shouldReduce ? 0 : idx * 0.1 }}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.08)',
                borderRadius: '3px',
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                {/* Metric / Achievement Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: 'rgba(244, 196, 0, 0.2)',
                    border: '1px solid rgba(244, 196, 0, 0.4)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '2px',
                    marginBottom: '1rem',
                  }}
                >
                  <Trophy size={14} color="var(--color-charcoal)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-charcoal)',
                    }}
                  >
                    {t.achievement}
                  </span>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--color-yellow)" color="var(--color-yellow)" />
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--color-slate)',
                    marginBottom: '1.5rem',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div
                style={{
                  borderTop: '1px solid rgba(37,42,46,0.08)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      color: 'var(--color-charcoal)',
                      lineHeight: 1,
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-slate)', marginTop: '0.2rem' }}>
                    {t.role}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#7E8B95',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t.tenure}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTestimonialsSection;
