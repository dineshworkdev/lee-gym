import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { AnimatedArrow } from '../../components/icons/AnimatedGymIcons';
import { MEMBERSHIP_PLANS } from '../../data/gymData';

function MembershipPlanCard({ plan, index, shouldReduce }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: shouldReduce ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduce ? {} : { y: -6, borderColor: 'rgba(37,42,46,0.22)', boxShadow: '0 12px 28px rgba(37,42,46,0.08)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid rgba(37,42,46,0.1)',
        borderRadius: '4px',
        padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
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
        <span
          style={{
            backgroundColor: 'var(--color-warm-bg)',
            color: 'var(--color-charcoal)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.6rem',
            borderRadius: '2px',
            display: 'inline-block',
            marginBottom: '0.75rem',
          }}
        >
          {plan.badge}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
            lineHeight: 1,
            color: 'var(--color-charcoal)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {plan.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--color-slate)',
            margin: 0,
          }}
        >
          {plan.description}
        </p>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.86rem',
            color: 'var(--color-slate)',
            margin: '0 0 1.25rem 0',
            fontStyle: 'italic',
          }}
        >
          Contact the gym for membership options.
        </p>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: isHovered ? '0.7rem' : '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)',
              textDecoration: 'none',
              padding: '0.8rem 1.4rem',
              backgroundColor: 'var(--color-yellow)',
              borderRadius: '2px',
              width: '100%',
              justifyContent: 'center',
              boxSizing: 'border-box',
              transition: 'gap 0.2s ease',
            }}
          >
            <span>Inquire at Gym</span>
            <AnimatedArrow size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Membership() {
  const shouldReduce = useReducedMotion();

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="TRAINING ACCESS"
        title="JOIN THE FLOOR."
        highlight="TRAIN WITH PURPOSE."
        description="Whether you are dropping in for a single session or looking for ongoing facility access and coaching, our floor is open for serious athletes."
        breadcrumbs={[{ label: 'Membership' }]}
      />

      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          }}
        >
          {/* Plan Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {MEMBERSHIP_PLANS.map((plan, index) => (
              <MembershipPlanCard
                key={plan.id}
                plan={plan}
                index={index}
                shouldReduce={shouldReduce}
              />
            ))}
          </div>

          {/* Clean Neutral Support Box */}
          <motion.div
            initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backgroundColor: 'var(--color-charcoal)',
              color: 'var(--color-white)',
              borderRadius: '4px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              textAlign: 'center',
              borderLeft: '5px solid var(--color-yellow)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                margin: '0 0 0.5rem 0',
              }}
            >
              READY TO TRAIN?
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: '#C2CBD1',
                maxWidth: '540px',
                margin: '0 auto 1.5rem auto',
                lineHeight: 1.6,
              }}
            >
              Visit our facility to tour the lifting platforms, meet the coaches, and discuss the best training access for your goals.
            </p>
            <motion.div
              whileHover={shouldReduce ? {} : { y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-block' }}
            >
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-yellow)',
                  color: '#1A1D20',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Contact the Gym</span>
                <AnimatedArrow size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Membership;
