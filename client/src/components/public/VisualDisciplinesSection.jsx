import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow, AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell } from '../icons/AnimatedGymIcons';
import { PROGRAMS } from '../../data/gymData';

const ICONS = [AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell];

function DisciplineCard({ prog, idx, shouldReduce }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICONS[idx % ICONS.length];

  return (
    <motion.div
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: shouldReduce ? 0 : idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduce ? {} : { y: -6, borderColor: 'rgba(37,42,46,0.22)', boxShadow: '0 12px 28px rgba(37,42,46,0.08)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <IconComponent size={28} color="var(--color-charcoal)" isHovered={isHovered} />
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
            gap: isHovered ? '0.65rem' : '0.4rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-charcoal)',
            textDecoration: 'none',
            transition: 'gap 0.2s ease',
          }}
        >
          <span>Learn more</span>
          <AnimatedArrow size={14} color="var(--color-charcoal)" />
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * VisualDisciplinesSection — Clean, High-Impact Programs Grid
 * Simple: Visual Icon, Program Name, Short Description, Direct CTA.
 */
function VisualDisciplinesSection() {
  const shouldReduce = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);

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
            <motion.div
              initial={{ opacity: shouldReduce ? 1 : 0, x: shouldReduce ? 0 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
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
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : '100%' }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                  lineHeight: 0.92,
                  color: 'var(--color-charcoal)',
                  margin: 0,
                }}
              >
                TRAINING PROGRAMS.
              </motion.h2>
            </div>
          </div>

          <motion.div
            whileHover={shouldReduce ? {} : { y: -2 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setBtnHover(true)}
            onHoverEnd={() => setBtnHover(false)}
          >
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
                boxShadow: btnHover ? '0 4px 12px rgba(244, 196, 0, 0.4)' : 'none',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <span>View All Programs</span>
              <motion.span
                animate={btnHover ? { x: 3 } : { x: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-flex' }}
              >
                <AnimatedArrow size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* 4 Clean Program Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {PROGRAMS.map((prog, idx) => (
            <DisciplineCard
              key={prog.id}
              prog={prog}
              idx={idx}
              shouldReduce={shouldReduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisualDisciplinesSection;
