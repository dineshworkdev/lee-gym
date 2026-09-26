import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { AnimatedArrow, AnimatedDumbbell } from '../../components/icons/AnimatedGymIcons';
import { TRAINERS } from '../../data/gymData';

function Trainers() {
  const shouldReduce = useReducedMotion();

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="COACHING STAFF"
        title="DEDICATED COACHES."
        highlight="PROVEN METHODOLOGY."
        description="Our coaches prioritize barbell mechanics, progressive overload, and movement execution to guide your athletic progress."
        breadcrumbs={[{ label: 'Trainers' }]}
      />

      {/* Coaches Showcase */}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {TRAINERS.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: shouldReduce ? 0 : index * 0.08 }}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <AnimatedDumbbell size={16} color="var(--color-charcoal)" />
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-slate)',
                      }}
                    >
                      {trainer.role}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                      lineHeight: 0.96,
                      color: 'var(--color-charcoal)',
                      margin: '0 0 0.75rem 0',
                    }}
                  >
                    {trainer.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: 'var(--color-slate)',
                      margin: 0,
                    }}
                  >
                    {trainer.shortDesc}
                  </p>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
                  <Link
                    to="/contact"
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
                    <span>Inquire for coaching</span>
                    <AnimatedArrow size={14} color="var(--color-charcoal)" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Trainers;
