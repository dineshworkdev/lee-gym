import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { GYM_INFO } from '../../data/gymData';

function HomeCTASection() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="home-cta"
      style={{
        backgroundColor: 'var(--color-yellow)',
        color: 'var(--color-charcoal)',
        padding: 'clamp(4rem, 8vw, 6.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background graphic motif */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-5%',
          fontSize: 'clamp(14rem, 30vw, 28rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: 'rgba(37, 42, 46, 0.05)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        LEE
      </div>

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '820px',
            margin: '0 auto',
          }}
        >
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, scale: shouldReduce ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-yellow)',
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} />
            <span>First Workout Complimentary</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 5.8rem)',
              lineHeight: 0.92,
              letterSpacing: '0.01em',
              color: 'var(--color-charcoal)',
              margin: '0 0 1.25rem 0',
            }}
          >
            YOUR STRONGEST SELF IS WAITING ON OUR TURF.
          </motion.h2>

          <motion.p
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              lineHeight: 1.65,
              color: 'var(--color-charcoal)',
              marginBottom: '2.5rem',
              maxWidth: '640px',
              opacity: 0.9,
            }}
          >
            Stop waiting for Monday. Come in, meet our coaches, test out the calibrated barbells,
            and experience what a real strength community feels like.
          </motion.p>

          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              width: '100%',
            }}
          >
            <Link
              to="/membership"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-white)',
                padding: '1.05rem 2.2rem',
                borderRadius: '2px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Get Your 1-Day Trial Pass</span>
              <ArrowRight size={16} color="var(--color-yellow)" />
            </Link>

            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                color: 'var(--color-charcoal)',
                padding: '1rem 1.75rem',
                borderRadius: '2px',
                border: '2px solid var(--color-charcoal)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
                e.currentTarget.style.color = 'var(--color-yellow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-charcoal)';
              }}
            >
              <MapPin size={16} />
              <span>Visit & Tour Gym</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomeCTASection;
