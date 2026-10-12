import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import { GALLERY_ITEMS } from '../../data/gymData';

function Gallery() {
  const [filter, setFilter] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const shouldReduce = useReducedMotion();

  const categories = ['All', 'Facility', 'Strength', 'Conditioning'];

  const filteredItems = filter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === filter);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModalItem) return;
      if (e.key === 'Escape') setActiveModalItem(null);
      if (e.key === 'ArrowRight') {
        const currIdx = GALLERY_ITEMS.findIndex((it) => it.id === activeModalItem.id);
        const nextIdx = (currIdx + 1) % GALLERY_ITEMS.length;
        setActiveModalItem(GALLERY_ITEMS[nextIdx]);
      }
      if (e.key === 'ArrowLeft') {
        const currIdx = GALLERY_ITEMS.findIndex((it) => it.id === activeModalItem.id);
        const prevIdx = (currIdx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
        setActiveModalItem(GALLERY_ITEMS[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem]);

  return (
    <div style={{ backgroundColor: 'var(--color-warm-bg)', minHeight: '100vh' }}>
      <PageHero
        badge="FACILITY & COMMUNITY"
        title="THE VISUAL HEARTBEAT OF"
        highlight="LEE GYM."
        description="Inside Lee Gym: dedicated training areas, signature yellow accents, free weights, and a focused workout environment."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) 0' }}>
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 clamp(1.25rem, 4vw, 2.5rem)',
          }}
        >
          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              marginBottom: '2.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={shouldReduce ? {} : { y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: active ? '1.5px solid var(--color-charcoal)' : '1px solid rgba(37,42,46,0.12)',
                    backgroundColor: active ? 'var(--color-charcoal)' : 'var(--color-white)',
                    color: active ? 'var(--color-white)' : 'var(--color-charcoal)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>

          {/* Dynamic Editorial Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: shouldReduce ? 1 : 0, scale: shouldReduce ? 1 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: shouldReduce ? 0 : idx * 0.05 }}
                whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 16px 36px rgba(0,0,0,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModalItem(item)}
                style={{
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-white)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${item.colorAccent}`,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              >
                {/* Photo Display with overlay */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    overflow: 'hidden',
                    backgroundColor: '#1b1e22',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 350ms ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(37,42,46,0.85) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      right: '1rem',
                      zIndex: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-charcoal)',
                        backgroundColor: item.colorAccent,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '2px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      {item.category}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(37, 42, 46, 0.75)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.35rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-white)',
                      }}
                    >
                      <Eye size={15} />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)',
                        lineHeight: 1.1,
                        letterSpacing: '0.02em',
                        color: 'var(--color-white)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        lineHeight: 1.55,
                        color: '#C2CBD1',
                        margin: 0,
                      }}
                    >
                      {item.caption}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '0.85rem',
                      marginTop: '1.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: 'var(--color-yellow)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.stats || item.tag}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#7E8B95',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                      }}
                    >
                      View Photo →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeModalItem && (
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
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-white)',
                borderRadius: '6px',
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                position: 'relative',
                borderLeft: `6px solid ${activeModalItem.colorAccent}`,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
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

              {/* Photo Display */}
              <div
                style={{
                  width: '100%',
                  maxHeight: '52vh',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#151719',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={activeModalItem.src}
                  alt={activeModalItem.alt}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '52vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: activeModalItem.colorAccent,
                    color: 'var(--color-charcoal)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '2px',
                    display: 'inline-block',
                  }}
                >
                  {activeModalItem.category}
                </span>
                {activeModalItem.stats && (
                  <span
                    style={{
                      color: 'var(--color-yellow)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    • {activeModalItem.stats}
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.05,
                  color: 'var(--color-white)',
                  marginBottom: '0.75rem',
                }}
              >
                {activeModalItem.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: '#C2CBD1',
                  marginBottom: '1.75rem',
                }}
              >
                {activeModalItem.caption}
              </p>

              {/* Prev / Next controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    const currIdx = GALLERY_ITEMS.findIndex((it) => it.id === activeModalItem.id);
                    const prevIdx = (currIdx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
                    setActiveModalItem(GALLERY_ITEMS[prevIdx]);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--color-white)',
                    padding: '0.5rem 1rem',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const currIdx = GALLERY_ITEMS.findIndex((it) => it.id === activeModalItem.id);
                    const nextIdx = (currIdx + 1) % GALLERY_ITEMS.length;
                    setActiveModalItem(GALLERY_ITEMS[nextIdx]);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--color-white)',
                    padding: '0.5rem 1rem',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
