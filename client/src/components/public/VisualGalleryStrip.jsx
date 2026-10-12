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
            <motion.div
              initial={{ opacity: shouldReduce ? 1 : 0, x: shouldReduce ? 0 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}
            >
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
            </motion.div>

            <div style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : '100%' }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.8rem, 6vw, 4.6rem)',
                  lineHeight: 0.92,
                  color: 'var(--color-white)',
                  margin: 0,
                }}
              >
                INSIDE THE GYM.{' '}
                <span style={{ color: 'var(--color-yellow)' }}>SERIOUS TRAINING.</span>
              </motion.h2>
            </div>
          </div>

          <motion.div
            whileHover={shouldReduce ? {} : { y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
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
          </motion.div>
        </div>

        {/* Visual Wall Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {GALLERY_ITEMS.slice(0, 4).map((item, idx) => (
            <motion.div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: shouldReduce ? 0 : idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={shouldReduce ? {} : { y: -6, borderColor: 'rgba(255, 255, 255, 0.25)', boxShadow: '0 14px 32px rgba(0, 0, 0, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderTop: `4px solid ${item.colorAccent}`,
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#181b1e' }}>
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(37,42,46,0.2) 0%, rgba(37,42,46,0.85) 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', right: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-charcoal)',
                      backgroundColor: item.colorAccent,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '2px',
                    }}
                  >
                    {item.tag || item.category}
                  </span>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.3rem', borderRadius: '50%', display: 'flex' }}>
                    <Eye size={14} color="#ffffff" />
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)',
                      lineHeight: 1.05,
                      color: 'var(--color-white)',
                      margin: '0 0 0.4rem 0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#A0AAB2', margin: 0, lineHeight: 1.5 }}>
                    {item.caption}
                  </p>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: 'var(--color-yellow)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.stats}</span>
                  <span style={{ fontSize: '0.7rem', color: '#7E8B95' }}>Inspect →</span>
                </div>
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
              backgroundColor: 'rgba(25, 28, 31, 0.92)',
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
                borderRadius: '6px',
                padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                maxWidth: '720px',
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '100%',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: 'var(--color-white)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 3,
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  width: '100%',
                  maxHeight: '48vh',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#151719',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '48vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

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
                {selectedPhoto.tag || selectedPhoto.category}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                  lineHeight: 1.05,
                  margin: '0 0 0.75rem 0',
                }}
              >
                {selectedPhoto.title}
              </h3>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.6, color: '#C2CBD1', marginBottom: '1.25rem' }}>
                {selectedPhoto.caption}
              </p>

              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', fontSize: '0.85rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
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
