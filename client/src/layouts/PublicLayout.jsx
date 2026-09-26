import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * PublicLayout — wrapper for all public-facing pages.
 * Renders Navbar + page content via <Outlet /> + Footer.
 * Automatically scrolls to top on route navigation.
 */
function PublicLayout() {
  const { pathname } = useLocation();

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
      <main id="main-content" role="main" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
