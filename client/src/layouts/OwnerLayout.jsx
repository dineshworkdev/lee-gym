import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useOwnerGym } from '../context/OwnerGymContext.jsx';

export default function OwnerLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { logout, ownerProfile } = useOwnerGym();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/owner/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Members',   path: '/owner/members',   icon: Users },
    { label: 'Plans',     path: '/owner/plans',     icon: CreditCard },
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
              padding: '1.75rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Dumbbell size={24} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.75rem',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: '#FFFFFF',
                }}
              >
                LEE <span style={{ color: '#F4C400' }}>GYM</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#F4C400',
                  textTransform: 'uppercase',
                  marginTop: '0.15rem',
                }}
              >
                OWNER WORKSPACE
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#F4C400' : 'transparent',
                    color: isActive ? '#252A2E' : '#FFFFFF',
                    fontWeight: isActive ? 800 : 500,
                    fontSize: '0.92rem',
                    letterSpacing: '0.02em',
                    transition: 'all 120ms ease',
                  })}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#1E2225',
          }}
        >
          {/* Owner info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.65rem',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#4B555D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <User size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {ownerProfile.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#F4C400', letterSpacing: '0.05em' }}>
                GYM OWNER
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
              gap: '0.65rem',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background-color 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#A83D3D';
              e.currentTarget.style.borderColor = '#A83D3D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER & DRAWER ─────────────────────────────────── */}
      <div className="flex md:hidden flex-col w-full">
        {/* Sticky Mobile Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#252A2E',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            borderBottom: '2px solid #F4C400',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Dumbbell size={18} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                }}
              >
                LEE <span style={{ color: '#F4C400' }}>GYM</span>
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#F4C400',
                  marginLeft: '0.4rem',
                  textTransform: 'uppercase',
                }}
              >
                OWNER
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
            {mobileDrawerOpen ? <X size={26} /> : <Menu size={26} />}
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
              top: '64px',
              backgroundColor: 'rgba(37, 42, 46, 0.75)',
              zIndex: 95,
              display: 'flex',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '280px',
                height: '100%',
                backgroundColor: '#252A2E',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem 1rem',
                boxShadow: '4px 0 16px rgba(0,0,0,0.3)',
              }}
            >
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                        padding: '0.9rem 1rem',
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#F4C400' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#252A2E' : '#FFFFFF',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.95rem',
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} />
                    </NavLink>
                  );
                })}
              </nav>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                  {ownerProfile.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#F4C400', marginBottom: '1.25rem' }}>
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
                    gap: '0.65rem',
                    padding: '0.8rem',
                    backgroundColor: '#A83D3D',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
          padding: '2.5rem 3rem 4rem',
          maxWidth: '1500px',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
