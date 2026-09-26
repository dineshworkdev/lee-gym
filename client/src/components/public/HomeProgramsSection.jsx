import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Clock, Calendar, Check } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { PROGRAMS } from '../../data/gymData';

function HomeProgramsSection() {
  const [activeId, setActiveId] = useState(PROGRAMS[0].id);
  const shouldReduce = useReducedMotion();

  const activeProgram = PROGRAMS.find((p) => p.id === activeId) || PROGRAMS[0];

  return (
    <section
      id="programs-preview"
      style={{
        padding: 'clamp(4rem, 8vw, 6.5rem) 0',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid rgba(37,42,46,0.06)',
        borderBottom: '1px solid rgba(37,42,46,0.06)',
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
          tag="DISCIPLINES & COACHING"
          title="ENGINEERED TO BUILD"
          highlight="REAL CAPACITY."
          description="Every program at Lee Gym is scientifically designed for tangible performance. No random fluff workouts — pure periodized progress."
          linkTo="/programs"
          linkText="View Complete Timetable"
        />

        {/* Desktop Interactive Layout: Left Program Selector list + Right Detailed Showcase Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            alignItems: 'start',
          }}
        >
          {/* Program Selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {PROGRAMS.slice(0, 4).map((program) => {
              const isSelected = program.id === activeId;
              return (
                <button
                  key={program.id}
                  onClick={() => setActiveId(program.id)}
                  style={{
                    textAlign: 'left',
                    padding: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                    backgroundColor: isSelected ? 'var(--color-charcoal)' : 'var(--color-warm-bg)',
                    color: isSelected ? 'var(--color-white)' : 'var(--color-charcoal)',
                    border: isSelected ? '2px solid var(--color-yellow)' : '1px solid rgba(37,42,46,0.08)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 196, 0, 0.12)';
                      e.currentTarget.style.borderColor = 'var(--color-yellow)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--color-warm-bg)';
                      e.currentTarget.style.borderColor = 'rgba(37,42,46,0.08)';
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: isSelected ? 'var(--color-yellow)' : 'var(--color-slate)',
                      }}
                    >
                      {program.category}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2px',
                        backgroundColor: isSelected ? 'rgba(244, 196, 0, 0.2)' : 'rgba(37,42,46,0.06)',
                        color: isSelected ? 'var(--color-yellow)' : 'var(--color-slate)',
                      }}
                    >
                      {program.duration}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.05,
                      margin: 0,
                    }}
                  >
                    {program.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: isSelected ? '#C2CBD1' : 'var(--color-slate)',
                      marginTop: '0.5rem',
                      marginBottom: 0,
                    }}
                  >
                    {program.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Program Showcase Preview Box */}
          <motion.div
            key={activeProgram.id}
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              backgroundColor: 'var(--color-warm-bg)',
              border: '2px solid rgba(37,42,46,0.12)',
              borderRadius: '4px',
              padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '440px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'var(--color-yellow)',
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '2px',
                  }}
                >
                  {activeProgram.tag}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-slate)',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="var(--color-slate)" />
                    {activeProgram.schedule}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Flame size={14} color="var(--color-red)" />
                    Intensity: {activeProgram.intensity}
                  </span>
                </div>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                  lineHeight: 0.98,
                  color: 'var(--color-charcoal)',
                  marginBottom: '1rem',
                  letterSpacing: '0.01em',
                }}
              >
                {activeProgram.name}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: 'var(--color-slate)',
                  marginBottom: '1.5rem',
                }}
              >
                {activeProgram.longDesc}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-charcoal)',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  Program Architecture:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeProgram.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <Check size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-charcoal)' }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(37,42,46,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Target Level
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {activeProgram.target}
                </div>
              </div>

              <Link
                to="/programs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-white)',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-slate)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-charcoal)')}
              >
                <span>Program Details</span>
                <ArrowRight size={15} color="var(--color-yellow)" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeProgramsSection;
