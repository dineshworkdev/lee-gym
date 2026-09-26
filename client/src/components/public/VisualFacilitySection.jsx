import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';
import { FACILITY_SPECS } from '../../data/gymData';

/**
 * VisualFacilitySection — Clean Facility Architecture Overview
 * Visual-first presentation of the real gym interior without exaggerated specs.
 */
function VisualFacilitySection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="facility-preview"
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
                Facility Floor
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
              TRAINING FACILITY.
            </h2>
          </div>

          <Link
            to="/gallery"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)',
              textDecoration: 'none',
              padding: '0.7rem 1.35rem',
              border: '2px solid var(--color-charcoal)',
              borderRadius: '2px',
              backgroundColor: 'var(--color-white)',
            }}
          >
            <span>Facility Gallery</span>
            <AnimatedArrow size={16} />
          </Link>
        </div>

        {/* 4 Clean Facility Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FACILITY_SPECS.map((spec, idx) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: shouldReduce ? 0 : idx * 0.08 }}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.1)',
                borderRadius: '3px',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                borderLeft: '4px solid var(--color-yellow)',
                minHeight: '200px',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-slate)',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {spec.tag}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 2.6vw, 2.2rem)',
                    lineHeight: 1,
                    color: 'var(--color-charcoal)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  {spec.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    color: 'var(--color-slate)',
                    margin: 0,
                  }}
                >
                  {spec.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisualFacilitySection;
