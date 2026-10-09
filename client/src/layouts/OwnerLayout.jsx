import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  Dumbbell,
  User,
  ChevronRight,
  Receipt,
  Bell,
  Settings,
} from 'lucide-react';
import { useOwnerGym } from '../context/OwnerGymContext.jsx';

export default function OwnerLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { logout, ownerProfile, isAuthenticated, authLoading } = useOwnerGym();
  const navigate = useNavigate();
  const location = useLocation();

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F7F5EF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body, "Inter", sans-serif)',
          color: '#252A2E',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            backgroundColor: '#252A2E',
            color: '#F4C400',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(37, 42, 46, 0.15)',
          }}
        >
          <Dumbbell size={28} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
            fontSize: '1.6rem',
            letterSpacing: '0.04em',
          }}
        >
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate('/owner/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard',     path: '/owner/dashboard',     icon: LayoutDashboard },
    { label: 'Members',       path: '/owner/members',       icon: Users },
    { label: 'Payments',      path: '/owner/payments',      icon: Receipt },
    { label: 'Plans',         path: '/owner/plans',         icon: CreditCard },
    { label: 'Notifications', path: '/owner/notifications', icon: Bell },
    { label: 'Settings',      path: '/owner/settings',      icon: Settings },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F7F5EF',
        color: '#252A2E',
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
      }}
    >
      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
      <aside
        id="owner-desktop-sidebar"
        className="hidden md:flex"
        style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#252A2E',
          color: '#FFFFFF',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '2px solid #1A1E22',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Top Brand Block */}
        <div>
          <div
            style={{
              padding: '1.5rem 1.5rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'rgba(244, 196, 0, 0.15)',
                color: '#F4C400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Dumbbell size={20} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", "Impact", sans-serif)',
                  fontSize: '1.6rem',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: '#FFFFFF',
                }}
              >
                LEE <span style={{ color: '#F4C400' }}>GYM</span>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  marginTop: '0.2rem',
                }}
              >
                Management Portal
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.35)',
                padding: '0 0.65rem 0.5rem',
              }}
            >
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  id={`nav-${item.label.toLowerCase()}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    backgroundColor: isActive ? 'rgba(244, 196, 0, 0.12)' : 'transparent',
                    color: isActive ? '#F4C400' : 'rgba(255, 255, 255, 0.75)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.88rem',
                    transition: 'all 150ms ease',
                    borderLeft: isActive ? '3px solid #F4C400' : '3px solid transparent',
                  })}
                >
                  <Icon size={18} style={{ opacity: 0.9 }} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Owner info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.4rem 0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <User size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {ownerProfile.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#F4C400', opacity: 0.9 }}>
                {ownerProfile.role || 'Gym Owner'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            id="owner-logout-btn"
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(168, 61, 61, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 61, 61, 0.4)';
              e.currentTarget.style.color = '#FCA5A5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER & DRAWER ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col w-full">
        {/* Sticky Mobile Header */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#252A2E',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(244, 196, 0, 0.15)',
                color: '#F4C400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Dumbbell size={16} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", "Impact", sans-serif)',
                  fontSize: '1.35rem',
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                }}
              >
                LEE <span style={{ color: '#F4C400' }}>GYM</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginLeft: '0.4rem',
                  textTransform: 'uppercase',
                }}
              >
                Portal
              </span>
            </div>
          </div>

          <button
            id="mobile-drawer-toggle"
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Mobile Drawer Backdrop & Drawer */}
        {mobileDrawerOpen && (
          <div
            id="mobile-drawer-backdrop"
            onClick={() => setMobileDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              top: '60px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 95,
              display: 'flex',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '270px',
                height: '100%',
                backgroundColor: '#252A2E',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem 1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
            >
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.85rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        backgroundColor: isActive ? 'rgba(244, 196, 0, 0.15)' : 'transparent',
                        color: isActive ? '#F4C400' : 'rgba(255, 255, 255, 0.8)',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '0.9rem',
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={15} style={{ opacity: 0.5 }} />
                    </NavLink>
                  );
                })}
              </nav>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.15rem' }}>
                  {ownerProfile.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1rem' }}>
                  {ownerProfile.email}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(168, 61, 61, 0.15)',
                    border: '1px solid rgba(168, 61, 61, 0.3)',
                    color: '#FCA5A5',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Main Content */}
        <main style={{ flex: 1, padding: '1.25rem 1rem 3rem' }}>
          <Outlet />
        </main>
      </div>

      {/* ── DESKTOP MAIN CONTENT ───────────────────────────────────── */}
      <main
        className="hidden md:block"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 2.5rem 3.5rem',
          maxWidth: '1440px',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
