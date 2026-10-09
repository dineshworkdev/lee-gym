import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { getActivePlans, DEFAULT_PLANS_SEED } from '../../services/planService.js';

function HomeMembershipSection() {
  const [plans, setPlans] = useState([]);
  const shouldReduce = useReducedMotion();

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
        padding: 'clamp(4rem, 8vw, 6.5rem) 0',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid rgba(37,42,46,0.06)',
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
          tag="TRANSPARENT PRICING"
          title="INVEST IN YOUR"
          highlight="PHYSICAL FREEDOM."
          description="Straightforward, contract-free memberships. Clear pricing, authentic training floor, and zero corporate gimmicks."
          linkTo="/membership"
          linkText="Compare All Perks"
          centered
        />

        {/* Dynamic Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            alignItems: 'stretch',
            marginTop: '2.5rem',
          }}
        >
          {plans.map((plan, index) => {
            const isPopular = plan.name === '3+1' || index === 1;
            const durationLabel = plan.durationDays
              ? (plan.durationDays >= 365
                  ? '1 Year Access'
                  : plan.durationDays >= 30
                  ? `${Math.round(plan.durationDays / 30)} Month${plan.durationDays >= 60 ? 's' : ''}`
                  : `${plan.durationDays} Days`)
              : 'Membership Plan';

            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                style={{
                  backgroundColor: isPopular ? 'var(--color-charcoal)' : 'var(--color-warm-bg)',
                  color: isPopular ? 'var(--color-white)' : 'var(--color-charcoal)',
                  borderRadius: '4px',
                  padding: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isPopular
                    ? '2px solid var(--color-yellow)'
                    : '1px solid rgba(37,42,46,0.1)',
                  position: 'relative',
                  transform: isPopular ? 'scale(1.02)' : 'none',
                  boxShadow: isPopular ? 'var(--shadow-yellow)' : 'var(--shadow-sm)',
                }}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-yellow)',
                      color: 'var(--color-charcoal)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.85rem',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: isPopular ? 'var(--color-yellow)' : 'var(--color-slate)',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {durationLabel}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.9rem, 2.8vw, 2.4rem)',
                      letterSpacing: '0.02em',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1,
                    }}
                  >
                    {plan.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: isPopular ? '#C2CBD1' : 'var(--color-slate)',
                      minHeight: '42px',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {plan.description || `${plan.name} membership plan at Lee Gym.`}
                  </p>

                  {/* Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.35rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1.25rem',
                      borderBottom: isPopular
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid rgba(37,42,46,0.1)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 4vw, 3.4rem)',
                        lineHeight: 1,
                        color: isPopular ? 'var(--color-yellow)' : 'var(--color-charcoal)',
                      }}
                    >
                      ₹{Number(plan.price || 0).toLocaleString('en-IN')}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        color: isPopular ? '#A0AAB2' : 'var(--color-slate)',
                      }}
                    >
                      / {plan.durationDays} days
                    </span>
                  </div>

                  {/* Admission fee notice */}
                  <div style={{ marginBottom: '1rem', fontSize: '0.78rem', fontWeight: 600 }}>
                    {plan.admissionFee > 0 ? (
                      <span style={{ color: isPopular ? '#F4C400' : '#A83D3D' }}>
                        Admission fee: ₹{Number(plan.admissionFee).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{ color: isPopular ? '#A0D8AF' : '#2F7D4A' }}>
                        ₹0 admission fee
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                          <Check
                            size={15}
                            color={isPopular ? 'var(--color-yellow)' : 'var(--color-success)'}
                            style={{ flexShrink: 0, marginTop: '3px' }}
                          />
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.82rem',
                              lineHeight: 1.45,
                              color: isPopular ? 'var(--color-white)' : 'var(--color-charcoal)',
                            }}
                          >
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to="/membership"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    backgroundColor: isPopular ? 'var(--color-yellow)' : 'var(--color-charcoal)',
                    color: isPopular ? 'var(--color-charcoal)' : 'var(--color-white)',
                    transition: 'opacity 150ms ease, transform 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Select Plan</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeMembershipSection;
