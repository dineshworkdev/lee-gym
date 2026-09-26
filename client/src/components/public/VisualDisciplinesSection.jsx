import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow, AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell } from '../icons/AnimatedGymIcons';
import { PROGRAMS } from '../../data/gymData';

const ICONS = [AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell];

/**
 * VisualDisciplinesSection — Clean, High-Impact Programs Grid
 * Simple: Visual Icon, Program Name, Short Description, Direct CTA.
 */
function VisualDisciplinesSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="programs-preview"
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
                Disciplines
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
              TRAINING PROGRAMS.
            </h2>
          </div>

          <Link
            to="/programs"
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
            <span>View All Programs</span>
            <AnimatedArrow size={16} />
          </Link>
        </div>

        {/* 4 Clean Program Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {PROGRAMS.map((prog, idx) => {
            const IconComponent = ICONS[idx % ICONS.length];
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: shouldReduce ? 0 : idx * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid rgba(37,42,46,0.1)',
                  borderRadius: '3px',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: '4px solid var(--color-yellow)',
                  minHeight: '260px',
                }}
              >
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <IconComponent size={28} color="var(--color-charcoal)" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.8rem, 2.8vw, 2.3rem)',
                      lineHeight: 0.98,
                      color: 'var(--color-charcoal)',
                      margin: '0 0 0.75rem 0',
                    }}
                  >
                    {prog.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: 'var(--color-slate)',
                      margin: 0,
                    }}
                  >
                    {prog.shortDesc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(37,42,46,0.06)' }}>
                  <Link
                    to="/programs"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--color-charcoal)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Learn more</span>
                    <AnimatedArrow size={14} color="var(--color-charcoal)" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VisualDisciplinesSection;
