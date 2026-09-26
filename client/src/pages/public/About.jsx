import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { AnimatedArrow } from '../../components/icons/AnimatedGymIcons';
import { BRAND_VALUES } from '../../data/gymData';

function About() {
  const shouldReduce = useReducedMotion();

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="ABOUT LEE GYM"
        title="BUILT WITH PURPOSE &"
        highlight="DISCIPLINED EFFORT."
        description="Lee Gym is an authentic training facility where lifters and athletes build strength through consistent, coach-guided progression."
        breadcrumbs={[{ label: 'About' }]}
      />

      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) 0' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          }}
        >
          {/* Main Statement Box */}
          <div
            style={{
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-white)',
              borderRadius: '4px',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              borderLeft: '6px solid var(--color-yellow)',
              marginBottom: '3.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ maxWidth: '800px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: 0.94,
                  letterSpacing: '0.01em',
                  color: 'var(--color-white)',
                  margin: '0 0 1.25rem 0',
                }}
              >
                A FACILITY DEDICATED TO{' '}
                <span style={{ color: 'var(--color-yellow)' }}>REAL TRAINING.</span>
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                  lineHeight: 1.65,
                  color: '#C2CBD1',
                  margin: '0 0 2rem 0',
                }}
              >
                Lee Gym is built around the essentials of athletic progression: hardwood lifting platforms, calibrated steel plates, heavy dumbbells, and high-density turf for conditioning. Our space is organized to support focused, uninterrupted effort.
              </p>

              <Link
                to="/membership"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-yellow)',
                  color: '#1A1D20',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Join the Floor</span>
                <AnimatedArrow size={16} />
              </Link>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-charcoal)',
                marginBottom: '1.5rem',
              }}
            >
              CORE STANDARDS
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {BRAND_VALUES.map((val, idx) => (
                <motion.div
                  key={val.number}
                  initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: shouldReduce ? 0 : idx * 0.08 }}
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid rgba(37,42,46,0.1)',
                    borderRadius: '4px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                    borderTop: '3px solid var(--color-yellow)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.8rem',
                      color: 'var(--color-yellow)',
                      display: 'block',
                      lineHeight: 1,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {val.number}
                  </span>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      color: 'var(--color-charcoal)',
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    {val.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      color: 'var(--color-slate)',
                      margin: 0,
                    }}
                  >
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
