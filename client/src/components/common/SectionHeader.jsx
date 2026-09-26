import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * SectionHeader — Reusable athletic editorial header.
 *
 * @param {string} tag - Small uppercase category/eyebrow (e.g., 'OUR PROGRAMS')
 * @param {string} title - Primary headline (Bebas Neue)
 * @param {string} highlight - Highlighted word in yellow (optional)
 * @param {string} description - Subtitle/paragraph below headline
 * @param {string} linkTo - Optional route to link to
 * @param {string} linkText - Optional label for link
 * @param {boolean} centered - Whether text should be centered
 * @param {string} className - Optional container className
 */
function SectionHeader({
  tag,
  title,
  highlight,
  description,
  linkTo,
  linkText,
  centered = false,
  className = '',
}) {
  const shouldReduce = useReducedMotion();

  return (
    <div
      className={`section-header ${className}`}
      style={{
        display: 'flex',
        flexDirection: centered ? 'column' : 'row',
        alignItems: centered ? 'center' : 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
        textAlign: centered ? 'center' : 'left',
      }}
    >
      <div style={{ maxWidth: centered ? '720px' : '640px' }}>
        {tag && (
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                width: '18px',
                height: '2px',
                backgroundColor: 'var(--color-yellow)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-slate)',
              }}
            >
              {tag}
            </span>
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.08 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            color: 'var(--color-charcoal)',
            margin: 0,
          }}
        >
          {title}{' '}
          {highlight && (
            <span
              style={{
                color: 'var(--color-yellow)',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              {highlight}
            </span>
          )}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: shouldReduce ? 0 : 0.15 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: 1.65,
              color: 'var(--color-slate)',
              marginTop: '1rem',
              marginBottom: 0,
            }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {linkTo && linkText && (
        <motion.div
          initial={{ opacity: shouldReduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            to={linkTo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)',
              textDecoration: 'none',
              padding: '0.75rem 1.25rem',
              border: '1.5px solid rgba(37,42,46,0.18)',
              borderRadius: '2px',
              backgroundColor: 'var(--color-white)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-yellow)';
              e.currentTarget.style.borderColor = 'var(--color-yellow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-white)';
              e.currentTarget.style.borderColor = 'rgba(37,42,46,0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>{linkText}</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default SectionHeader;
