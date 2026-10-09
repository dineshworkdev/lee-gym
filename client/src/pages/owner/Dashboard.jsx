import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Calendar,
  Snowflake,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  X,
  CreditCard,
  Receipt,
  UserCheck,
} from 'lucide-react';
import { useOwnerGym, formatDate, CURRENT_DATE_STR } from '../../context/OwnerGymContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { dashboardMetrics, members, payments, memberEvaluator } = useOwnerGym();
  const [showManageModal, setShowManageModal] = useState(false);

  // Current formatted date banner
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Actionable Members for "Needs Attention / Follow-ups"
  const attentionMembers = members
    .filter((m) => {
      const evalStatus = memberEvaluator(m);
      if (evalStatus.isArchived) return false;
      return (
        evalStatus.isExpiringToday ||
        evalStatus.isExpiringSoon ||
        evalStatus.isDue ||
        evalStatus.isExpired ||
        evalStatus.isFrozen
      );
    })
    .slice(0, 6);

  // Recent Activity derived from verified real payments and members
  const recentTransactions = payments.slice(0, 5);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* ── A. PAGE HEADER ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                letterSpacing: '0.04em',
                color: 'var(--color-charcoal, #252A2E)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              DASHBOARD
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-slate, #4B555D)',
                backgroundColor: 'rgba(37, 42, 46, 0.05)',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
              }}
            >
              {todayFormatted}
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.88rem',
              color: 'var(--color-slate, #4B555D)',
              margin: '0.35rem 0 0',
            }}
          >
            Your gym operations, cash flow, and membership standing at a glance.
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            id="dashboard-manage-btn"
            type="button"
            onClick={() => setShowManageModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-charcoal, #252A2E)',
              border: '1px solid rgba(37, 42, 46, 0.15)',
              padding: '0.65rem 1.15rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.3)';
              e.currentTarget.style.backgroundColor = '#FAF8F4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.15)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <SlidersHorizontal size={16} />
            <span>Manage Portal</span>
          </button>

          <Link
            to="/owner/members"
            id="dashboard-view-members-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-charcoal, #252A2E)',
              border: '1px solid rgba(37, 42, 46, 0.15)',
              padding: '0.65rem 1.15rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.3)';
              e.currentTarget.style.backgroundColor = '#FAF8F4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.15)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Users size={16} />
            <span>Members List</span>
          </Link>

          <Link
            to="/owner/members/new"
            id="dashboard-add-member-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--color-yellow, #F4C400)',
              color: 'var(--color-charcoal, #252A2E)',
              border: '1px solid rgba(212, 169, 0, 0.8)',
              padding: '0.65rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(244, 196, 0, 0.3)',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5B800';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F4C400';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <UserPlus size={16} />
            <span>Add Member</span>
          </Link>
        </div>
      </div>

      {/* ── B. FINANCIAL OVERVIEW ────────────────────────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.45rem',
                letterSpacing: '0.04em',
                color: 'var(--color-charcoal, #252A2E)',
                margin: 0,
              }}
            >
              FINANCIAL PERFORMANCE
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-slate, #4B555D)', margin: '0.15rem 0 0' }}>
              Real-time revenue collections and dues recorded in Firestore
            </p>
          </div>
          <Link
            to="/owner/payments"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-charcoal, #252A2E)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>Open Ledger</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* 1. Collected Today */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.25rem 1.4rem',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
                Collected Today
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(47, 125, 74, 0.08)',
                  color: '#2F7D4A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={17} />
              </div>
            </div>
            <div style={{ margin: '0.75rem 0 0.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: 'var(--color-charcoal, #252A2E)',
                }}
              >
                ₹{Number(dashboardMetrics.collectionsToday || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#2F7D4A', fontWeight: 500 }}>
              Active business day collections
            </span>
          </div>

          {/* 2. Collected This Month */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.25rem 1.4rem',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
                This Month (MTD)
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(244, 196, 0, 0.15)',
                  color: '#D4A900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={17} />
              </div>
            </div>
            <div style={{ margin: '0.75rem 0 0.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: 'var(--color-charcoal, #252A2E)',
                }}
              >
                ₹{Number(dashboardMetrics.collectionsThisMonth || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)', fontWeight: 500 }}>
              Month-to-date collections
            </span>
          </div>

          {/* 3. Total Lifetime Revenue */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.25rem 1.4rem',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
                Total Revenue
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(37, 42, 46, 0.08)',
                  color: 'var(--color-charcoal, #252A2E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IndianRupee size={17} />
              </div>
            </div>
            <div style={{ margin: '0.75rem 0 0.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: 'var(--color-charcoal, #252A2E)',
                }}
              >
                ₹{Number(dashboardMetrics.totalRevenueCollected || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)', fontWeight: 500 }}>
              All verified receipts combined
            </span>
          </div>

          {/* 4. Outstanding Dues */}
          <div
            onClick={() => navigate('/owner/payments')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(168, 61, 61, 0.15)',
              borderRadius: '8px',
              padding: '1.25rem 1.4rem',
              boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 61, 61, 0.35)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 61, 61, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 61, 61, 0.15)';
              e.currentTarget.style.boxShadow = 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#A83D3D' }}>
                Outstanding Dues
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(168, 61, 61, 0.08)',
                  color: '#A83D3D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={17} />
              </div>
            </div>
            <div style={{ margin: '0.75rem 0 0.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: '#A83D3D',
                }}
              >
                ₹{Number(dashboardMetrics.totalOutstandingDues || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#A83D3D', fontWeight: 600 }}>
              {dashboardMetrics.dueMembers} member{dashboardMetrics.dueMembers === 1 ? '' : 's'} with due balance
            </span>
          </div>
        </div>
      </section>

      {/* ── C. MEMBERSHIP OVERVIEW ───────────────────────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.45rem',
                letterSpacing: '0.04em',
                color: 'var(--color-charcoal, #252A2E)',
                margin: 0,
              }}
            >
              MEMBERSHIP STATUS
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-slate, #4B555D)', margin: '0.15rem 0 0' }}>
              Active athletes, upcoming expirations, and status breakdown
            </p>
          </div>
          <Link
            to="/owner/members?filter=all"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-charcoal, #252A2E)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>All Members ({dashboardMetrics.totalMembers})</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Active Members */}
          <div
            onClick={() => navigate('/owner/members?filter=active')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(47, 125, 74, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2F7D4A' }}>Active Members</span>
              <CheckCircle2 size={16} color="#2F7D4A" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#252A2E', margin: '0.4rem 0 0.1rem', lineHeight: 1 }}>
              {dashboardMetrics.activeMembers}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>Valid subscriptions</span>
          </div>

          {/* Expiring Today */}
          <div
            onClick={() => navigate('/owner/members?filter=today')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 196, 0, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#D4A900' }}>Expiring Today</span>
              <Clock size={16} color="#D4A900" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#252A2E', margin: '0.4rem 0 0.1rem', lineHeight: 1 }}>
              {dashboardMetrics.expiringToday}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>Renewal due today</span>
          </div>

          {/* Expiring Soon (1-3 Days) */}
          <div
            onClick={() => navigate('/owner/members?filter=soon')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 196, 0, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#B38E00' }}>Expiring 1–3 Days</span>
              <Clock size={16} color="#B38E00" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#252A2E', margin: '0.4rem 0 0.1rem', lineHeight: 1 }}>
              {dashboardMetrics.expiringSoon}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>Upcoming renewals</span>
          </div>

          {/* Expired Members */}
          <div
            onClick={() => navigate('/owner/members?filter=expired')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 61, 61, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#A83D3D' }}>Expired Members</span>
              <AlertTriangle size={16} color="#A83D3D" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#252A2E', margin: '0.4rem 0 0.1rem', lineHeight: 1 }}>
              {dashboardMetrics.expiredMembers}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>Pending re-activation</span>
          </div>

          {/* Frozen Members */}
          <div
            onClick={() => navigate('/owner/members?filter=frozen')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(75, 85, 93, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B555D' }}>Frozen</span>
              <Snowflake size={16} color="#4B555D" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#252A2E', margin: '0.4rem 0 0.1rem', lineHeight: 1 }}>
              {dashboardMetrics.frozenMembers}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>Temporarily on pause</span>
          </div>
        </div>
      </section>

      {/* ── D & E. SPLIT SECTION: ATTENTION REQUIRED + RECENT TRANSACTIONS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* D. Member Follow-ups / Needs Attention */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.35rem',
                  letterSpacing: '0.04em',
                  color: 'var(--color-charcoal, #252A2E)',
                  margin: 0,
                }}
              >
                NEEDS ATTENTION
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-slate, #4B555D)', margin: '0.1rem 0 0' }}>
                Urgent dues, expirations, and renewal follow-ups
              </p>
            </div>
            <Link
              to="/owner/members?filter=due"
              style={{ fontSize: '0.8rem', color: 'var(--color-charcoal, #252A2E)', fontWeight: 600, textDecoration: 'none' }}
            >
              View all
            </Link>
          </div>

          {attentionMembers.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-slate, #4B555D)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={28} color="#2F7D4A" style={{ margin: '0 auto 0.5rem' }} />
              All memberships and dues are fully settled.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {attentionMembers.map((m) => {
                const evalStatus = memberEvaluator(m);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(37, 42, 46, 0.02)',
                      border: '1px solid rgba(37, 42, 46, 0.05)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#252A2E' }}>
                          {m.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)' }}>
                          ({m.memberId || m.id})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)', marginTop: '0.2rem' }}>
                        {m.planName} • Exp: {formatDate(m.expiryDate)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {evalStatus.isDue ? (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#A83D3D',
                            backgroundColor: 'rgba(168, 61, 61, 0.08)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          Due: ₹{m.dueAmount || m.amountDue || 0}
                        </span>
                      ) : evalStatus.isExpiringToday ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#997A00',
                            backgroundColor: 'rgba(244, 196, 0, 0.15)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          Expires Today
                        </span>
                      ) : evalStatus.isExpiringSoon ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#997A00',
                            backgroundColor: 'rgba(244, 196, 0, 0.12)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          Expires in {evalStatus.diff}d
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#4B555D',
                            backgroundColor: 'rgba(75, 85, 93, 0.08)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                          }}
                        >
                          {evalStatus.badgeLabel}
                        </span>
                      )}

                      <Link
                        to={`/owner/members/${m.id}`}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#252A2E',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(37, 42, 46, 0.15)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          textDecoration: 'none',
                        }}
                      >
                        Action
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* E. Recent Activity: Verified Collections */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.35rem',
                  letterSpacing: '0.04em',
                  color: 'var(--color-charcoal, #252A2E)',
                  margin: 0,
                }}
              >
                RECENT TRANSACTIONS
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-slate, #4B555D)', margin: '0.1rem 0 0' }}>
                Latest verified payment collections
              </p>
            </div>
            <Link
              to="/owner/payments"
              style={{ fontSize: '0.8rem', color: 'var(--color-charcoal, #252A2E)', fontWeight: 600, textDecoration: 'none' }}
            >
              All payments
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-slate, #4B555D)', fontSize: '0.85rem' }}>
              <Receipt size={28} color="#4B555D" style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              No transaction history recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentTransactions.map((p) => (
                <div
                  key={p.id || p.receiptNumber}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(37, 42, 46, 0.02)',
                    border: '1px solid rgba(37, 42, 46, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(47, 125, 74, 0.08)',
                        color: '#2F7D4A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      ₹
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#252A2E' }}>
                        {p.memberName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>
                        {p.receiptNumber} • {p.paymentMode} • {formatDate(p.paymentDateStr || p.paymentDate)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2F7D4A' }}>
                      +₹{Number(p.amountPaid || 0).toLocaleString('en-IN')}
                    </div>
                    {p.remainingDueAmount > 0 && (
                      <div style={{ fontSize: '0.7rem', color: '#A83D3D' }}>
                        Due: ₹{p.remainingDueAmount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── MANAGE MODAL / ACTION DRAWER ────────────────────────────── */}
      {showManageModal && (
        <div
          id="manage-modal-backdrop"
          onClick={() => setShowManageModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.1)',
              borderRadius: '8px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    fontSize: '1.6rem',
                    letterSpacing: '0.04em',
                    color: 'var(--color-charcoal, #252A2E)',
                    margin: 0,
                  }}
                >
                  MANAGE GYM
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-slate, #4B555D)', margin: '0.15rem 0 0' }}>
                  Quick shortcuts to primary management areas
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-slate, #4B555D)',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/members');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(37, 42, 46, 0.08)',
                  backgroundColor: '#FAF8F4',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.25)';
                  e.currentTarget.style.backgroundColor = '#F5EFE4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(37, 42, 46, 0.08)',
                      color: 'var(--color-charcoal, #252A2E)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#252A2E' }}>
                      Members Directory
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>
                      Search, edit, freeze, renew, or archive
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-slate, #4B555D)" />
              </div>

              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/plans');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(37, 42, 46, 0.08)',
                  backgroundColor: '#FAF8F4',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.25)';
                  e.currentTarget.style.backgroundColor = '#F5EFE4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(37, 42, 46, 0.08)',
                      color: 'var(--color-charcoal, #252A2E)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#252A2E' }}>
                      Membership Plans
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>
                      Manage pricing, terms, and active plans
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-slate, #4B555D)" />
              </div>

              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/payments');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(37, 42, 46, 0.08)',
                  backgroundColor: '#FAF8F4',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.25)';
                  e.currentTarget.style.backgroundColor = '#F5EFE4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(37, 42, 46, 0.08)';
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(37, 42, 46, 0.08)',
                      color: 'var(--color-charcoal, #252A2E)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#252A2E' }}>
                      Payments Ledger
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>
                      View collections, print receipts, and manage dues
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-slate, #4B555D)" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
