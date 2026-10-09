import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import { AnimatedArrow } from '../../components/icons/AnimatedGymIcons';
import { getActivePlans } from '../../services/planService.js';

function MembershipPlanCard({ plan, index, shouldReduce }) {
  const [isHovered, setIsHovered] = useState(false);

  // Derive duration display if not explicitly provided
  const durationLabel = plan.durationDays
    ? (plan.durationDays >= 365
        ? `${Math.round(plan.durationDays / 365)} Year`
        : plan.durationDays >= 30
        ? `${Math.round(plan.durationDays / 30)} Month${plan.durationDays >= 60 ? 's' : ''}`
        : `${plan.durationDays} Days`)
    : 'Custom';

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
        minHeight: '300px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
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
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.6rem',
              borderRadius: '2px',
            }}
          >
            {durationLabel}
          </span>
        </div>

        {/* Real Live Price Display */}
        <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.2rem)',
              lineHeight: 1,
              fontWeight: 900,
              color: 'var(--color-charcoal)',
            }}
          >
            ₹{Number(plan.price || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Admission fee notice */}
        {plan.admissionFee > 0 ? (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#A83D3D',
              backgroundColor: 'rgba(168, 61, 61, 0.08)',
              padding: '0.25rem 0.55rem',
              borderRadius: '2px',
              marginBottom: '0.75rem',
            }}
          >
            Admission fee: ₹{Number(plan.admissionFee).toLocaleString('en-IN')}
          </div>
        ) : (
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#2F7D4A',
              backgroundColor: 'rgba(47, 125, 74, 0.08)',
              padding: '0.25rem 0.55rem',
              borderRadius: '2px',
              marginBottom: '0.75rem',
            }}
          >
            ₹0 admission fee
          </div>
        )}

        {plan.description && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--color-slate)',
              margin: '0.5rem 0 0 0',
            }}
          >
            {plan.description}
          </p>
        )}

        {/* Features list if present */}
        {Array.isArray(plan.features) && plan.features.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {plan.features.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-charcoal)' }}>
                <CheckCircle2 size={14} color="#2F7D4A" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,42,46,0.08)' }}>
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
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const livePlans = await getActivePlans();
      setPlans(livePlans);
    } catch (err) {
      console.error('Failed to load membership plans from Firestore:', err);
      setError('Unable to load current membership plans. Please check your connection or contact the gym directly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="TRAINING ACCESS"
        title="MEMBERSHIP PLANS."
        highlight="CLEAR & DIRECT."
        description="Straightforward membership options for training at Lee Gym in Pappampatti Rd, Pallapalayam. Visit or contact us to join."
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
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <RefreshCw
                size={36}
                className="animate-spin"
                style={{ margin: '0 auto 1rem auto', color: 'var(--color-charcoal)' }}
              />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>
                LOADING ACTIVE PLANS...
              </div>
              <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem' }}>Fetching live rates from gym database</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div
              style={{
                backgroundColor: '#FDF2F2',
                border: '2px solid #A83D3D',
                borderRadius: '4px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              <AlertCircle size={32} color="#A83D3D" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#A83D3D', margin: '0 0 0.5rem 0' }}>
                COULD NOT LOAD PLANS
              </h3>
              <p style={{ color: 'var(--color-slate)', maxWidth: '500px', margin: '0 auto 1.25rem auto', fontSize: '0.92rem' }}>
                {error}
              </p>
              <button
                type="button"
                onClick={fetchPlans}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-white)',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && plans.length === 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid rgba(37,42,46,0.1)',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                borderRadius: '4px',
                marginBottom: '3rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-charcoal)', margin: '0 0 0.5rem 0' }}>
                NO ACTIVE PLANS CURRENTLY LISTED
              </h3>
              <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
                Please visit Lee Gym at Nikki Towers, Pallapalayam or reach out directly for current admissions.
              </p>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-yellow)',
                  color: 'var(--color-charcoal)',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <span>Contact Gym</span>
                <AnimatedArrow size={16} />
              </Link>
            </div>
          )}

          {/* Active Plan Cards */}
          {!loading && !error && plans.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem',
              }}
            >
              {plans.map((plan, index) => (
                <MembershipPlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  shouldReduce={shouldReduce}
                />
              ))}
            </div>
          )}

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
              Visit our gym located on Pappampatti Rd, Pallapalayam to view the training floor and join a membership plan.
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
