import { motion } from 'motion/react';

/**
 * MarqueeStrip — High-energy kinetic athletic text ticker.
 * Provides instant visual momentum, raw gym attitude, and architectural rhythm.
 */
function MarqueeStrip({
  items = [
    'TRAIN HARD',
    'FREE WEIGHTS',
    'BARBELLS & DUMBBELLS',
    'LIVE STRONG',
    'OPEN WORKOUT FLOOR',
    'MON – SAT',
    'ZERO GIMMICKS',
    'PALLAPALAYAM COIMBATORE',
  ],
  bg = 'var(--color-yellow)',
  color = 'var(--color-charcoal)',
  reverse = false,
  speed = 28,
  separator = '★',
}) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        backgroundColor: bg,
        color: color,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        padding: '0.85rem 0',
        display: 'flex',
        alignItems: 'center',
        borderTop: '2px solid var(--color-charcoal)',
        borderBottom: '2px solid var(--color-charcoal)',
      }}
    >
      <motion.div
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          flexShrink: 0,
        }}
      >
        {repeated.map((text, idx) => (
          <div
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                letterSpacing: '0.06em',
                lineHeight: 1,
                display: 'inline-block',
              }}
            >
              {text}
            </span>
            <span
              aria-hidden="true"
              style={{
                fontSize: '0.85rem',
                opacity: 0.6,
                display: 'inline-block',
              }}
            >
              {separator}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default MarqueeStrip;
