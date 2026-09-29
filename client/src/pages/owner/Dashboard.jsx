import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  SlidersHorizontal,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  ChevronRight,
  X,
} from 'lucide-react';
import { useOwnerGym, formatDate } from '../../context/OwnerGymContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { dashboardMetrics, members, memberEvaluator } = useOwnerGym();
  const [showManageModal, setShowManageModal] = useState(false);

  // Quick Action Triage: get members needing immediate attention (Due or Expiring Today / Soon)
  const priorityMembers = members
    .filter((m) => {
      const { isDue, isExpiringToday, isExpiring1To3 } = memberEvaluator(m);
      return isDue || isExpiringToday || isExpiring1To3;
    })
    .slice(0, 5);

  const metricsConfig = [
    {
      id: 'due',
      label: 'DUE MEMBERS',
      value: dashboardMetrics.dueMembers,
      sublabel: 'Payment or renewal required',
      filter: 'due',
      color: '#A83D3D',
      borderColor: '#A83D3D',
      bgLight: '#FFF5F5',
      icon: AlertTriangle,
    },
    {
      id: 'today',
      label: 'EXPIRING TODAY',
      value: dashboardMetrics.expiringToday,
      sublabel: 'Renewal required today',
      filter: 'today',
      color: '#B38E00',
      borderColor: '#F4C400',
      bgLight: '#FFFAEB',
      icon: Clock,
    },
    {
      id: 'soon',
      label: 'EXPIRING IN 1–3 DAYS',
      value: dashboardMetrics.expiringSoon,
      sublabel: 'Immediate renewal window',
      filter: 'soon',
      color: '#D4A900',
      borderColor: '#FFE866',
      bgLight: '#FFFDF5',
      icon: Clock,
    },
    {
      id: 'active',
      label: 'ACTIVE MEMBERS',
      value: dashboardMetrics.activeMembers,
      sublabel: 'In good membership standing',
      filter: 'active',
      color: '#2F7D4A',
      borderColor: '#2F7D4A',
      bgLight: '#F2F9F4',
      icon: CheckCircle2,
    },
    {
      id: 'total',
      label: 'TOTAL MEMBERS',
      value: dashboardMetrics.totalMembers,
      sublabel: 'All registered gym athletes',
      filter: 'all',
      color: '#252A2E',
      borderColor: '#252A2E',
      bgLight: '#FFFFFF',
      icon: Users,
    },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── HEADER & TOP ACTIONS ────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid rgba(37, 42, 46, 0.1)',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
              letterSpacing: '0.04em',
              color: '#252A2E',
              margin: 0,
              lineHeight: 1,
            }}
          >
            DASHBOARD
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.9rem',
              color: '#4B555D',
              margin: '0.4rem 0 0',
            }}
          >
            Live member operations &amp; subscription status
          </p>
        </div>

        {/* Action Buttons: Strong + ADD MEMBER and MANAGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* MANAGE Button */}
          <button
            id="dashboard-manage-btn"
            type="button"
            onClick={() => setShowManageModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFFFF',
              color: '#252A2E',
              border: '2px solid #252A2E',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #252A2E',
              transition: 'transform 100ms ease, box-shadow 100ms ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px #252A2E';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '3px 3px 0px #252A2E';
            }}
          >
            <SlidersHorizontal size={17} />
            <span>MANAGE</span>
          </button>

          {/* + ADD MEMBER Button (Visually Prominent) */}
          <Link
            to="/owner/members/new"
            id="dashboard-add-member-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              backgroundColor: '#F4C400',
              color: '#252A2E',
              border: '2px solid #252A2E',
              padding: '0.75rem 1.5rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.92rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px #252A2E',
              transition: 'transform 100ms ease, box-shadow 100ms ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px #252A2E';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '4px 4px 0px #252A2E';
            }}
          >
            <UserPlus size={19} />
            <span>+ ADD MEMBER</span>
          </Link>
        </div>
      </div>

      {/* ── KEY MEMBERSHIP METRICS ──────────────────────────────────── */}
      <section style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {metricsConfig.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                id={`metric-${metric.id}`}
                onClick={() => navigate(`/owner/members?filter=${metric.filter}`)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #252A2E',
                  borderLeft: `6px solid ${metric.borderColor}`,
                  boxShadow: '4px 4px 0px #252A2E',
                  padding: '1.4rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0px #252A2E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #252A2E';
                }}
              >
                {/* Top Row: Label and Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body, "Inter", sans-serif)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: metric.color,
                      textTransform: 'uppercase',
                    }}
                  >
                    {metric.label}
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      backgroundColor: metric.bgLight,
                      color: metric.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={17} />
                  </div>
                </div>

                {/* Main Metric Value */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.2rem 0 0.4rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                      fontSize: 'clamp(3rem, 5vw, 3.8rem)',
                      lineHeight: 0.95,
                      color: '#252A2E',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {metric.value}
                  </span>
                </div>

                {/* Subtitle & View Arrow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.6rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px dashed rgba(37, 42, 46, 0.12)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#4B555D' }}>{metric.sublabel}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#252A2E',
                    }}
                  >
                    View <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PRIORITY ATTENTION TABLE (QUICK ACTION) ────────────────── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.75rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: 0,
              }}
            >
              MEMBERS REQUIRING ATTENTION
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#4B555D', margin: '0.2rem 0 0' }}>
              Pending payment balance or memberships expiring in 0–3 days
            </p>
          </div>
          <Link
            to="/owner/members?filter=due"
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#252A2E',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>View All Due / Expiring</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Priority Members List Container */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '4px 4px 0px #252A2E',
            overflow: 'hidden',
          }}
        >
          {priorityMembers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#4B555D' }}>
              All members are fully up to date. No pending due balances or urgent expirations.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#252A2E', color: '#FFFFFF' }}>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Member ID
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Name &amp; Mobile
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Plan
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Expiry Date
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Due Balance
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priorityMembers.map((member, idx) => {
                    const { isDue, isExpiringToday, isExpiring1To3, diff } = memberEvaluator(member);
                    return (
                      <tr
                        key={member.id}
                        style={{
                          borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                        }}
                      >
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: '#252A2E' }}>
                          {member.id}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#252A2E' }}>{member.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#4B555D' }}>{member.mobile}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#252A2E' }}>
                          {member.planName}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#252A2E' }}>
                            {formatDate(member.expiryDate)}
                          </div>
                          {isExpiringToday && (
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#F4C400',
                                color: '#252A2E',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.45rem',
                                marginTop: '0.2rem',
                              }}
                            >
                              TODAY
                            </span>
                          )}
                          {isExpiring1To3 && (
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#FFE866',
                                color: '#252A2E',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.45rem',
                                marginTop: '0.2rem',
                              }}
                            >
                              IN {diff} DAY{diff > 1 ? 'S' : ''}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          {isDue ? (
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#FDF2F2',
                                color: '#A83D3D',
                                border: '1px solid #A83D3D',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.65rem',
                              }}
                            >
                              ₹{member.amountDue}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: '#2F7D4A', fontWeight: 700 }}>
                              ₹0 (Paid)
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <Link
                            to={`/owner/members/${member.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#252A2E',
                              color: '#FFFFFF',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── MANAGE MODAL / ACTION DRAWER ────────────────────────────── */}
      {showManageModal && (
        <div
          id="manage-modal-backdrop"
          onClick={() => setShowManageModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37, 42, 46, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '2px solid #252A2E',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    fontSize: '2rem',
                    letterSpacing: '0.04em',
                    color: '#252A2E',
                    margin: 0,
                  }}
                >
                  MANAGE GYM
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4B555D', margin: '0.2rem 0 0' }}>
                  Select an administrative section
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#252A2E',
                  padding: '0.25rem',
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Management Links: MEMBERS & PLANS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Option 1: MEMBERS */}
              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/members');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  border: '2px solid #252A2E',
                  backgroundColor: '#FAF8F4',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease, transform 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F4C400';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: '#252A2E',
                      color: '#F4C400',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={22} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                        fontSize: '1.4rem',
                        letterSpacing: '0.04em',
                        color: '#252A2E',
                        lineHeight: 1,
                      }}
                    >
                      MEMBERS
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#4B555D' }}>
                      Search, filter, view profiles, and record payments
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#252A2E" />
              </div>

              {/* Option 2: PLANS */}
              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/plans');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  border: '2px solid #252A2E',
                  backgroundColor: '#FAF8F4',
                  cursor: 'pointer',
                  transition: 'background-color 120ms ease, transform 120ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F4C400';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF8F4';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: '#252A2E',
                      color: '#F4C400',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                        fontSize: '1.4rem',
                        letterSpacing: '0.04em',
                        color: '#252A2E',
                        lineHeight: 1,
                      }}
                    >
                      PLANS
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#4B555D' }}>
                      Configure membership packages, pricing, and durations
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="#252A2E" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
