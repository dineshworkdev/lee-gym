import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useCountUp } from '../../hooks/useCountUp';

/**
 * Stats data — static UI-only placeholder values.
 * numeric: the count-up target
 * suffix:  symbol after the number ("+", "×", etc.)
 * label:   two-line description
 */
const STATS = [
  { id: 'stat-years',    numeric: 10,  suffix: '+', label: ['Years of', 'Training']   },
  { id: 'stat-members',  numeric: 500, suffix: '+', label: ['Active', 'Members']       },
  { id: 'stat-programs', numeric: 15,  suffix: '+', label: ['Expert', 'Programs']      },
  { id: 'stat-days',     numeric: 6,   suffix: '',  label: ['Days', 'A Week']          },
];

/* ── Individual stat card ────────────────────────────────────────────── */
function StatCard({ stat, index, shouldReduce }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count  = useCountUp(stat.numeric, 1500, inView);

  return (
    <motion.div
      ref={ref}
      id={stat.id}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        flex: '1 1 160px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(1.75rem, 3.5vw, 3rem) clamp(0.75rem, 1.5vw, 1.5rem)',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* Vertical separator — shown between cards, not before the first */}
      {index > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: '18%',
            height: '64%',
            width: '1px',
            backgroundColor: 'rgba(75,85,93,0.14)',
          }}
        />
      )}

      {/* Animated number + suffix */}
      <div
        aria-label={`${stat.numeric}${stat.suffix}`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1,
        }}
      >
        {/* Count-up number — yellow digits */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 6.5vw, 6rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            color: 'var(--color-charcoal)',
          }}
        >
          {/* Each digit gets yellow; non-digit characters stay charcoal */}
          {String(shouldReduce ? stat.numeric : count)
            .split('')
            .map((char, ci) =>
              /\d/.test(char) ? (
                <span key={ci} style={{ color: 'var(--color-yellow-dark)' }}>
                  {char}
                </span>
              ) : (
                <span key={ci}>{char}</span>
              )
            )}
        </span>

        {/* Suffix ("+") in a smaller weight */}
        {stat.suffix && (
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.8rem)',
              lineHeight: 1,
              color: 'var(--color-yellow-dark)',
              marginTop: '0.2em',
            }}
          >
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Yellow pip */}
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-yellow)',
          margin: '0.65rem auto 0.55rem',
        }}
      />

      {/* Two-line label */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.05rem',
        }}
      >
        {stat.label.map((line, li) => (
          <span
            key={li}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.82rem)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-slate)',
              lineHeight: 1.4,
            }}
          >
            {line}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── StatsSection ────────────────────────────────────────────────────── */
function StatsSection() {
  const sectionRef  = useRef(null);
  const inView      = useInView(sectionRef, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="stats-section"
      ref={sectionRef}
      aria-label="Lee Gym — at a glance"
      style={{
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid rgba(75,85,93,0.1)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        {/* ── Section eyebrow ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            paddingTop: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--color-yellow)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.67rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-slate)',
            }}
          >
            Lee Gym at a Glance
          </span>
        </motion.div>

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div
          id="stats-row"
          role="list"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingBottom: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          }}
        >
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={i}
              shouldReduce={shouldReduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
