import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import PageHero from '../../components/common/PageHero';
import { GALLERY_ITEMS } from '../../data/gymData';

function Gallery() {
  const [filter, setFilter] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const shouldReduce = useReducedMotion();

  const categories = ['All', 'Facility', 'Strength', 'Conditioning', 'Community'];

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

          {/* Masonry / Dynamic Editorial Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
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
                whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 14px 32px rgba(0,0,0,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModalItem(item)}
                style={{
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-white)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  padding: '2rem',
                  borderTop: `4px solid ${item.colorAccent}`,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              >
                {/* Background decorative texture pattern */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    opacity: 0.08,
                    pointerEvents: 'none',
                    backgroundImage:
                      'radial-gradient(circle, var(--color-yellow) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Top Badge & Category */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: item.colorAccent,
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '2px',
                    }}
                  >
                    {item.category}
                  </span>
                  <Eye size={16} color="rgba(255,255,255,0.4)" />
                </div>

                {/* Center Content */}
                <div style={{ position: 'relative', zIndex: 1, margin: '2rem 0' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)',
                      lineHeight: 1.02,
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

                {/* Bottom Meta */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '0.85rem',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#7E8B95', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Click to Inspect
                  </span>
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
              backgroundColor: 'rgba(37, 42, 46, 0.88)',
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
                maxWidth: '680px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                position: 'relative',
                borderLeft: `6px solid ${activeModalItem.colorAccent}`,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
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
                  marginBottom: '1rem',
                }}
              >
                {activeModalItem.category}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  color: 'var(--color-white)',
                  marginBottom: '1rem',
                }}
              >
                {activeModalItem.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#C2CBD1',
                  marginBottom: '1.5rem',
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
