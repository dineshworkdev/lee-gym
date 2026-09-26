import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { MEMBERSHIP_PLANS } from '../../data/gymData';

function HomeMembershipSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const shouldReduce = useReducedMotion();

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
          description="Straightforward, contract-free memberships. No initiation surcharges, no cancellation penalties, and zero corporate gimmicks."
          linkTo="/membership"
          linkText="Compare All Perks"
          centered
        />

        {/* Billing Toggle (Monthly / Annual) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: !isAnnual ? 700 : 500,
              color: !isAnnual ? 'var(--color-charcoal)' : 'var(--color-slate)',
              cursor: 'pointer',
            }}
            onClick={() => setIsAnnual(false)}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: '54px',
              height: '28px',
              backgroundColor: isAnnual ? 'var(--color-yellow)' : 'var(--color-slate)',
              borderRadius: '999px',
              border: 'none',
              padding: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 200ms ease',
            }}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-white)',
                boxShadow: 'var(--shadow-sm)',
                marginLeft: isAnnual ? 'auto' : 0,
              }}
            />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
            onClick={() => setIsAnnual(true)}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: isAnnual ? 700 : 500,
                color: isAnnual ? 'var(--color-charcoal)' : 'var(--color-slate)',
              }}
            >
              Annual Billing
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: 'var(--color-yellow)',
                color: 'var(--color-charcoal)',
                padding: '0.15rem 0.45rem',
                borderRadius: '2px',
              }}
            >
              Save 15%
            </span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            alignItems: 'stretch',
          }}
        >
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                style={{
                  backgroundColor: plan.popular ? 'var(--color-charcoal)' : 'var(--color-warm-bg)',
                  color: plan.popular ? 'var(--color-white)' : 'var(--color-charcoal)',
                  borderRadius: '4px',
                  padding: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: plan.popular
                    ? '2px solid var(--color-yellow)'
                    : '1px solid rgba(37,42,46,0.1)',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  boxShadow: plan.popular ? 'var(--shadow-yellow)' : 'var(--shadow-sm)',
                }}
              >
                {/* Popular Pill */}
                {plan.popular && (
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
                    Most Recommended
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
                      color: plan.popular ? 'var(--color-yellow)' : 'var(--color-slate)',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {plan.badge}
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
                      color: plan.popular ? '#C2CBD1' : 'var(--color-slate)',
                      minHeight: '42px',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.35rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1.25rem',
                      borderBottom: plan.popular
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid rgba(37,42,46,0.1)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 4vw, 3.4rem)',
                        lineHeight: 1,
                        color: plan.popular ? 'var(--color-yellow)' : 'var(--color-charcoal)',
                      }}
                    >
                      ${price}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        color: plan.popular ? '#A0AAB2' : 'var(--color-slate)',
                      }}
                    >
                      {plan.interval}
                    </span>
                  </div>

                  {/* Features List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                        <Check
                          size={15}
                          color={plan.popular ? 'var(--color-yellow)' : 'var(--color-success)'}
                          style={{ flexShrink: 0, marginTop: '3px' }}
                        />
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.82rem',
                            lineHeight: 1.45,
                            color: plan.popular ? 'var(--color-white)' : 'var(--color-charcoal)',
                          }}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
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
                    backgroundColor: plan.popular ? 'var(--color-yellow)' : 'var(--color-charcoal)',
                    color: plan.popular ? 'var(--color-charcoal)' : 'var(--color-white)',
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
                  <span>{plan.ctaText}</span>
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
