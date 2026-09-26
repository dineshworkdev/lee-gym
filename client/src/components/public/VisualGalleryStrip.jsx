import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { X, Eye, ArrowRight } from 'lucide-react';
import { AnimatedArrow } from '../icons/AnimatedGymIcons';
import { GALLERY_ITEMS } from '../../data/gymData';

function VisualGalleryStrip() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const shouldReduce = useReducedMotion();

  return (
    <section
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        borderTop: '2px solid var(--color-yellow)',
        borderBottom: '2px solid var(--color-yellow)',
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
            marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ width: '22px', height: '3px', backgroundColor: 'var(--color-yellow)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-yellow)',
                }}
              >
                Visual Chronicle
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 4.6rem)',
                lineHeight: 0.92,
                color: 'var(--color-white)',
                margin: 0,
              }}
            >
              INSIDE THE WAREHOUSE.{' '}
              <span style={{ color: 'var(--color-yellow)' }}>NO BULLSHIT.</span>
            </h2>
          </div>

          <Link
            to="/gallery"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)',
              textDecoration: 'none',
              padding: '0.75rem 1.4rem',
              backgroundColor: 'var(--color-yellow)',
              borderRadius: '2px',
            }}
          >
            <span>Explore All Photos</span>
            <AnimatedArrow size={16} />
          </Link>
        </div>

        {/* Visual Wall Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {GALLERY_ITEMS.slice(0, 4).map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              whileHover={{ y: -4 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderTop: `4px solid ${item.colorAccent}`,
                borderRadius: '3px',
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 200ms ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: item.colorAccent,
                  }}
                >
                  {item.tag}
                </span>
                <Eye size={16} color="rgba(255,255,255,0.4)" />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 2.8vw, 2.3rem)',
                    lineHeight: 1,
                    color: 'var(--color-white)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#A0AAB2', margin: 0 }}>
                  {item.caption}
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-yellow)', fontWeight: 700, textTransform: 'uppercase' }}>
                {item.stats}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(37, 42, 46, 0.92)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-white)',
                borderLeft: `6px solid ${selectedPhoto.colorAccent}`,
                borderRadius: '4px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '600px',
                width: '100%',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'var(--color-white)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: selectedPhoto.colorAccent,
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                {selectedPhoto.tag}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.2rem)',
                  lineHeight: 1,
                  margin: '0 0 1rem 0',
                }}
              >
                {selectedPhoto.title}
              </h3>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.6, color: '#C2CBD1', marginBottom: '1.5rem' }}>
                {selectedPhoto.caption}
              </p>

              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', fontSize: '0.85rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
                {selectedPhoto.stats}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default VisualGalleryStrip;
