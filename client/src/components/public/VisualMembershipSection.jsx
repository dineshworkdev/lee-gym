import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';
import { getActivePlans, DEFAULT_PLANS_SEED } from '../../services/planService.js';

function PlanCard({ plan, idx, shouldReduce }) {
  const [isHovered, setIsHovered] = useState(false);

  const durationLabel = plan.durationDays
    ? (plan.durationDays >= 365
        ? `${Math.round(plan.durationDays / 365)} Year`
        : plan.durationDays >= 30
        ? `${Math.round(plan.durationDays / 30)} Month${plan.durationDays >= 60 ? 's' : ''}`
        : `${plan.durationDays} Days`)
    : 'Custom';

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
        borderRadius: '4px',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.3rem)',
              lineHeight: 1,
              color: 'var(--color-charcoal)',
              margin: 0,
            }}
          >
            {plan.name}
          </h3>
          <span
            style={{
              backgroundColor: 'var(--color-warm-bg)',
              color: 'var(--color-charcoal)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
            }}
          >
            {durationLabel}
          </span>
        </div>

        {/* Real Live Price */}
        <div style={{ margin: '0.6rem 0', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 3.8vw, 2.8rem)',
              lineHeight: 1,
              fontWeight: 900,
              color: 'var(--color-charcoal)',
            }}
          >
            ₹{Number(plan.price || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Admission fee tag */}
        {plan.admissionFee > 0 ? (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#A83D3D',
              backgroundColor: 'rgba(168, 61, 61, 0.08)',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              marginBottom: '0.6rem',
            }}
          >
            Admission fee: ₹{Number(plan.admissionFee).toLocaleString('en-IN')}
          </div>
        ) : (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#4B555D',
              backgroundColor: 'rgba(75, 85, 93, 0.08)',
              padding: '0.2rem 0.5rem',
              borderRadius: '2px',
              marginBottom: '0.6rem',
            }}
          >
            ₹0 admission fee
          </div>
        )}

        {plan.description && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.86rem',
              lineHeight: 1.5,
              color: 'var(--color-slate)',
              margin: '0.35rem 0 0 0',
            }}
          >
            {plan.description}
          </p>
        )}
      </div>

      <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
        <Link
          to="/membership"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: isHovered ? '0.65rem' : '0.45rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--color-charcoal)',
            textDecoration: 'none',
            transition: 'gap 0.2s ease',
          }}
        >
          <span>View Plan Details</span>
          <AnimatedArrow size={14} color="var(--color-charcoal)" />
        </Link>
      </div>
    </motion.div>
  );
}

function VisualMembershipSection() {
  const shouldReduce = useReducedMotion();
  const [btnHover, setBtnHover] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getActivePlans()
      .then((data) => {
        if (data && data.length > 0) setPlans(data);
        else setPlans(DEFAULT_PLANS_SEED);
      })
      .catch(() => {
        setPlans(DEFAULT_PLANS_SEED);
      });
  }, []);

  return (
    <section
      id="membership-preview"
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
                Membership
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
                TRAINING ACCESS.
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
              to="/membership"
              style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                textDecoration: 'none',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: btnHover ? '0 6px 18px rgba(0,0,0,0.18)' : '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <span
                style={{
                  backgroundColor: 'var(--color-yellow)',
                  color: '#1A1D20',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.75rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                JOIN NOW
              </span>
              <motion.span
                animate={btnHover ? { x: 2 } : { x: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  backgroundColor: '#1A1D20',
                  color: '#FFFFFF',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 8H13.5M8.5 3L13.5 8L8.5 13"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Membership Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {plans.map((plan, idx) => (
            <PlanCard
              key={plan.id || idx}
              plan={plan}
              idx={idx}
              shouldReduce={shouldReduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisualMembershipSection;
