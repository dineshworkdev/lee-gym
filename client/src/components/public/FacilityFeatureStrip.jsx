import { motion, useReducedMotion } from 'motion/react';
import { Dumbbell, ShieldCheck, Flame, Compass } from 'lucide-react';
import { FACILITY_SPECS } from '../../data/gymData';

function FacilityFeatureStrip() {
  const shouldReduce = useReducedMotion();

  const ICONS = [Compass, Dumbbell, Flame, ShieldCheck];

  return (
    <section
      id="facility-features"
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '2px solid rgba(244, 196, 0, 0.4)',
        borderBottom: '2px solid rgba(244, 196, 0, 0.4)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: '300px',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(244, 196, 0, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {FACILITY_SPECS.map((spec, index) => {
            const IconComponent = ICONS[index % ICONS.length];
            return (
              <motion.div
                key={spec.title}
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: shouldReduce ? 0 : index * 0.1 }}
                style={{
                  borderLeft: '3px solid var(--color-yellow)',
                  paddingLeft: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-yellow)',
                      }}
                    >
                      {spec.tag}
                    </span>
                    <IconComponent size={18} color="rgba(255,255,255,0.4)" />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.8rem',
                      letterSpacing: '0.02em',
                      color: 'var(--color-white)',
                      marginBottom: '0.5rem',
                      lineHeight: 1.05,
                    }}
                  >
                    {spec.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      color: '#A0AAB2',
                      margin: 0,
                    }}
                  >
                    {spec.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      color: 'var(--color-yellow)',
                    }}
                  >
                    {spec.stat}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: '#7E8B95',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    · {spec.sub}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FacilityFeatureStrip;
