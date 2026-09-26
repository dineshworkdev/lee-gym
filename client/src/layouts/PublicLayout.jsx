import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * PublicLayout — wrapper for all public-facing pages.
 * Renders Navbar + page content via <Outlet /> + Footer.
 * Smooth, athletic page reveal on route change.
 */
function PublicLayout() {
  const { pathname } = useLocation();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-warm-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <main id="main-content" role="main" style={{ flex: 1, overflow: 'hidden' }}>
        <motion.div
          key={pathname}
          initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
