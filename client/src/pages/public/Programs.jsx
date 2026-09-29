import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { AnimatedArrow, AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell } from '../../components/icons/AnimatedGymIcons';
import { PROGRAMS } from '../../data/gymData';

const ICONS = [AnimatedBarbell, AnimatedFlame, AnimatedWeightPlate, AnimatedDumbbell];

function ProgramCard({ prog, index, shouldReduce }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICONS[index % ICONS.length];

  return (
    <motion.div
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: shouldReduce ? 0 : index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduce ? {} : { y: -6, borderColor: 'rgba(37,42,46,0.22)', boxShadow: '0 12px 28px rgba(37,42,46,0.08)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid rgba(37,42,46,0.1)',
        borderRadius: '3px',
        padding: 'clamp(1.75rem, 3vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        borderTop: '4px solid var(--color-yellow)',
        minHeight: '280px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <IconComponent size={32} color="var(--color-charcoal)" isHovered={isHovered} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
            lineHeight: 0.96,
            color: 'var(--color-charcoal)',
            margin: '0 0 0.75rem 0',
          }}
        >
          {prog.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: 'var(--color-slate)',
            margin: 0,
          }}
        >
          {prog.shortDesc}
        </p>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            to="/membership"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: isHovered ? '0.75rem' : '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)',
              textDecoration: 'none',
              padding: '0.75rem 1.4rem',
              backgroundColor: 'var(--color-yellow)',
              borderRadius: '2px',
              width: '100%',
              justifyContent: 'center',
              boxSizing: 'border-box',
              transition: 'gap 0.2s ease',
            }}
          >
            <span>Get Started</span>
            <AnimatedArrow size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Programs() {
  const [filter, setFilter] = useState('All');
  const shouldReduce = useReducedMotion();

  const categories = ['All', 'Strength', 'Conditioning', 'Weights', 'Movement'];

  const filteredPrograms = filter === 'All'
    ? PROGRAMS
    : PROGRAMS.filter((p) => p.category === filter);

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="TRAINING DISCIPLINES"
        title="STRUCTURED TRAINING."
        highlight="CONSISTENT PROGRESS."
        description="Strength training, conditioning, free weights, and movement routines for members focused on health and fitness."
        breadcrumbs={[{ label: 'Programs' }]}
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          }}
        >
          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              marginBottom: '2.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={shouldReduce ? {} : { y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: active ? '2px solid var(--color-charcoal)' : '1px solid rgba(37,42,46,0.12)',
                    backgroundColor: active ? 'var(--color-charcoal)' : 'var(--color-white)',
                    color: active ? 'var(--color-white)' : 'var(--color-charcoal)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {cat === 'All' ? 'All Programs' : cat}
                </motion.button>
              );
            })}
          </div>

          {/* Clean Visual Program Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {filteredPrograms.map((prog, index) => (
              <ProgramCard
                key={prog.id}
                prog={prog}
                index={index}
                shouldReduce={shouldReduce}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Programs;
