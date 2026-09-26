import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow, AnimatedDumbbell } from '../icons/AnimatedGymIcons';
import { TRAINERS } from '../../data/gymData';

/**
 * VisualCoachesSection — Clean Coaches Overview
 * Simple: Coach Name, Role/Specialization, Short Description.
 * No aggressive slogans ("NOT INFLUENCERS"), no fake stats.
 */
function VisualCoachesSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="coaches-preview"
      style={{
        padding: 'clamp(3.5rem, 7vw, 6rem) 0',
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        borderTop: '2px solid var(--color-yellow)',
        borderBottom: '2px solid var(--color-yellow)',
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
              <AnimatedDumbbell size={18} color="var(--color-yellow)" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-yellow)',
                }}
              >
                Coaching Staff
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                lineHeight: 0.92,
                color: 'var(--color-white)',
                margin: 0,
              }}
            >
              OUR COACHES.
            </h2>
          </div>

          <Link
            to="/trainers"
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
              backgroundColor: 'var(--color-yellow)',
              borderRadius: '2px',
            }}
          >
            <span>Meet All Coaches</span>
            <AnimatedArrow size={16} />
          </Link>
        </div>

        {/* 4 Coaches Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {TRAINERS.map((coach, idx) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: shouldReduce ? 0 : idx * 0.08 }}
              style={{
                backgroundColor: '#1E2327',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '3px solid var(--color-yellow)',
                minHeight: '220px',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-yellow)',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  {coach.role}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    letterSpacing: '0.02em',
                    color: 'var(--color-white)',
                    margin: '0 0 0.75rem 0',
                    lineHeight: 1,
                  }}
                >
                  {coach.name}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    color: '#A0AAB2',
                    margin: 0,
                  }}
                >
                  {coach.shortDesc}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Link
                  to="/trainers"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-yellow)',
                    textDecoration: 'none',
                  }}
                >
                  <span>Coach profile</span>
                  <AnimatedArrow size={14} color="var(--color-yellow)" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisualCoachesSection;
