import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { BRAND_VALUES } from '../../data/gymData';

/**
 * HomeAboutSection — Clean Gym Introduction
 * Visual, focused, and free of manifesto hype or unverified claims.
 */
function HomeAboutSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="about-preview"
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
        <SectionHeader
          tag="ABOUT LEE GYM"
          title="BUILT FOR DISCIPLINED"
          highlight="TRAINING."
          description="Lee Gym is an authentic local facility where raw effort meets structured coaching. Designed for lifters and athletes seeking measurable progress."
          linkTo="/about"
          linkText="Learn More"
        />

        {/* 2-Column Split: Visual Card + Values */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 3rem)',
            alignItems: 'stretch',
          }}
        >
          {/* Left: Graphic Identity Card */}
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-white)',
              padding: 'clamp(2rem, 4vw, 2.75rem)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)',
              borderLeft: '5px solid var(--color-yellow)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(244, 196, 0, 0.15)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '2px',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: 'var(--color-yellow)',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-yellow)',
                  }}
                >
                  Authentic Training Floor
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  color: 'var(--color-white)',
                  marginBottom: '1rem',
                }}
              >
                REAL EQUIPMENT.{' '}
                <span style={{ color: 'var(--color-yellow)' }}>DEDICATED COACHING.</span>
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: '#C2CBD1',
                  margin: 0,
                }}
              >
                We maintain our lifting platforms, calibrated steel plates, and indoor athletic turf for athletes who value focus and consistency. No distractions, just honest progress.
              </p>
            </div>

            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  letterSpacing: '0.06em',
                  color: 'var(--color-yellow)',
                }}
              >
                LEE GYM
              </span>
              <Link
                to="/about"
                style={{
                  color: 'var(--color-yellow)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Read More</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Right: Brand Values Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            {BRAND_VALUES.map((val) => (
              <div
                key={val.number}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid rgba(37,42,46,0.1)',
                  borderRadius: '4px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    color: 'var(--color-yellow)',
                    lineHeight: 1,
                  }}
                >
                  {val.number}
                </span>
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      letterSpacing: '0.02em',
                      color: 'var(--color-charcoal)',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    {val.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      color: 'var(--color-slate)',
                      margin: 0,
                    }}
                  >
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeAboutSection;
