import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  Calendar,
  Snowflake,
  AlertCircle,
  SlidersHorizontal,
  ChevronRight,
  X,
  CreditCard,
  Receipt,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';
import { useOwnerGym, formatDate } from '../../context/OwnerGymContext.jsx';

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

  // Recent Activity derived from verified real payments
  const recentTransactions = payments.slice(0, 5);

  // Real plan breakdown (excluding archived)
  const planBreakdownEntries = Object.entries(dashboardMetrics.planCounts || {}).sort(
    (a, b) => b[1] - a[1]
  );
  const totalPlanMembers = planBreakdownEntries.reduce((acc, curr) => acc + curr[1], 0) || 1;

  // Real payment mode breakdown
  const paymentModes = dashboardMetrics.paymentModeBreakdown || { Cash: 0, UPI: 0, Card: 0, Other: 0 };

  return (
    <div className="dashboard-entry w-full max-w-[1440px] mx-auto min-w-0 box-border">
      {/* ── A. PAGE HEADER ──────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-[rgba(37,42,46,0.08)] w-full min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                letterSpacing: '0.04em',
              }}
              className="text-3xl sm:text-4xl lg:text-5xl text-[#252A2E] m-0 leading-none"
            >
              DASHBOARD
            </h1>
            <span className="text-xs font-semibold text-[#4B555D] bg-[rgba(37,42,46,0.05)] px-2.5 py-1 rounded border border-[rgba(37,42,46,0.08)]">
              {todayFormatted}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B555D] mt-1 sm:mt-1.5 mb-0">
            Gym operations, athlete membership standing, and financial performance at a glance.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            id="dashboard-manage-btn"
            type="button"
            onClick={() => setShowManageModal(true)}
            className="inline-flex items-center gap-1.5 bg-white text-[#252A2E] border border-[rgba(37,42,46,0.15)] px-3 sm:px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold cursor-pointer shadow-[0_1px_3px_rgba(37,42,46,0.04)] hover:bg-[#FAF8F4] hover:border-[rgba(37,42,46,0.3)] transition-all"
          >
            <SlidersHorizontal size={15} />
            <span>Manage Portal</span>
          </button>

          <Link
            to="/owner/members"
            id="dashboard-view-members-btn"
            className="inline-flex items-center gap-1.5 bg-white text-[#252A2E] border border-[rgba(37,42,46,0.15)] px-3 sm:px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold no-underline shadow-[0_1px_3px_rgba(37,42,46,0.04)] hover:bg-[#FAF8F4] hover:border-[rgba(37,42,46,0.3)] transition-all"
          >
            <Users size={15} />
            <span>Members List</span>
          </Link>

          <Link
            to="/owner/members/new"
            id="dashboard-add-member-btn"
            className="inline-flex items-center gap-1.5 bg-[#F4C400] text-[#252A2E] border border-[#D4A900] px-3.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold no-underline shadow-[0_2px_6px_rgba(244,196,0,0.25)] hover:bg-[#E5B800] hover:-translate-y-0.5 transition-all"
          >
            <UserPlus size={15} />
            <span>Add Member</span>
          </Link>
        </div>
      </header>

      {/* ── B. MEMBERSHIP STATUS — FIRST ────────────────────────────── */}
      <section className="mb-8 sm:mb-10 w-full min-w-0">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4 flex-wrap gap-2 min-w-0">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                letterSpacing: '0.04em',
              }}
              className="text-xl sm:text-2xl text-[#252A2E] m-0"
            >
              MEMBERSHIP STATUS
            </h2>
            <p className="text-xs sm:text-sm text-[#4B555D] mt-0.5 mb-0">
              Athlete activity, upcoming expirations, and subscription health
            </p>
          </div>
          <Link
            to="/owner/members?filter=all"
            className="text-xs sm:text-sm font-semibold text-[#252A2E] no-underline inline-flex items-center gap-1 hover:text-[#D4A900] transition-colors"
          >
            <span>View All ({dashboardMetrics.totalMembers})</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 7 Responsive Membership Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5 w-full min-w-0">
          {/* 1. Total Members */}
          <div
            id="metric-card-total-members"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(37,42,46,0.08)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=all')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#4B555D] truncate">Total Members</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(37,42,46,0.06)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                <Users size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.totalMembers}
            </div>
            <span className="text-[0.72rem] text-[#6B7280] truncate block">
              Registered athletes
            </span>
          </div>

          {/* 2. Active Members */}
          <div
            id="metric-card-active-members"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(47,125,74,0.2)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=active')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#2F7D4A] truncate">Active</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(47,125,74,0.08)] text-[#2F7D4A] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.activeMembers}
            </div>
            <span className="text-[0.72rem] text-[#2F7D4A] font-medium truncate block">
              Valid subscriptions
            </span>
          </div>

          {/* 3. Expiring Today */}
          <div
            id="metric-card-expiring-today"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(212,169,0,0.25)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=today')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#997A00] truncate">Expiring Today</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(244,196,0,0.15)] text-[#997A00] flex items-center justify-center flex-shrink-0">
                <Clock size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.expiringToday}
            </div>
            <span className="text-[0.72rem] text-[#997A00] font-medium truncate block">
              Renewal due today
            </span>
          </div>

          {/* 4. Expiring in 1–3 Days */}
          <div
            id="metric-card-expiring-soon"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(212,169,0,0.25)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=soon')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#997A00] truncate">Expiring 1–3 Days</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(244,196,0,0.15)] text-[#997A00] flex items-center justify-center flex-shrink-0">
                <Clock size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.expiringSoon}
            </div>
            <span className="text-[0.72rem] text-[#997A00] font-medium truncate block">
              Upcoming within 72h
            </span>
          </div>

          {/* 5. Expired Members */}
          <div
            id="metric-card-expired-members"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(168,61,61,0.2)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=expired')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#A83D3D] truncate">Expired</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(168,61,61,0.08)] text-[#A83D3D] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.expiredMembers}
            </div>
            <span className="text-[0.72rem] text-[#A83D3D] font-medium truncate block">
              Needs reactivation
            </span>
          </div>

          {/* 6. Frozen Members */}
          <div
            id="metric-card-frozen-members"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(75,85,93,0.2)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=frozen')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#4B555D] truncate">Frozen</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(75,85,93,0.08)] text-[#4B555D] flex items-center justify-center flex-shrink-0">
                <Snowflake size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-1 truncate"
            >
              {dashboardMetrics.frozenMembers}
            </div>
            <span className="text-[0.72rem] text-[#4B555D] truncate block">
              Temporarily paused
            </span>
          </div>

          {/* 7. Members with Outstanding Dues */}
          <div
            id="metric-card-due-members"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(168,61,61,0.25)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer min-h-[118px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/members?filter=due')}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span className="text-xs sm:text-[0.76rem] font-semibold text-[#A83D3D] truncate">With Dues</span>
              <div className="w-7 h-7 rounded-md bg-[rgba(168,61,61,0.08)] text-[#A83D3D] flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#A83D3D] leading-none my-1 truncate"
            >
              {dashboardMetrics.dueMembers}
            </div>
            <span className="text-[0.72rem] text-[#A83D3D] font-semibold truncate block">
              ₹{Number(dashboardMetrics.totalOutstandingDues || 0).toLocaleString('en-IN')} pending
            </span>
          </div>
        </div>
      </section>

      {/* ── C. NEEDS ATTENTION — PROMINENT FOLLOW-UPS ───────────────── */}
      <section className="mb-8 sm:mb-10 w-full min-w-0">
        <div className="bg-white border border-[rgba(37,42,46,0.08)] rounded-xl shadow-[0_1px_3px_rgba(37,42,46,0.04)] p-4 sm:p-5 lg:p-6 w-full min-w-0 box-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    letterSpacing: '0.04em',
                  }}
                  className="text-lg sm:text-xl text-[#252A2E] m-0"
                >
                  NEEDS ATTENTION
                </h3>
                {attentionMembers.length > 0 && (
                  <span className="text-xs font-bold text-[#A83D3D] bg-[rgba(168,61,61,0.08)] px-2 py-0.5 rounded">
                    {attentionMembers.length} item{attentionMembers.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#4B555D] mt-0.5 mb-0">
                Actionable member follow-ups: today&apos;s expirations, upcoming renewals, and outstanding balances
              </p>
            </div>

            <Link
              to="/owner/members?filter=due"
              className="text-xs sm:text-sm text-[#252A2E] font-semibold no-underline inline-flex items-center gap-1 hover:text-[#D4A900] transition-colors"
            >
              <span>View all follow-ups</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {attentionMembers.length === 0 ? (
            <div className="p-8 sm:p-10 text-center bg-[rgba(47,125,74,0.03)] rounded-lg border border-dashed border-[rgba(47,125,74,0.25)]">
              <CheckCircle2 size={32} color="#2F7D4A" className="mx-auto mb-2" />
              <div className="font-semibold text-sm sm:text-base text-[#252A2E] mb-1">
                All athlete accounts in good standing
              </div>
              <p className="text-xs sm:text-sm text-[#4B555D] m-0">
                No immediate expirations or overdue balances requiring attention today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full min-w-0">
              {attentionMembers.map((m) => {
                const evalStatus = memberEvaluator(m);
                return (
                  <div
                    key={m.id || m.docId}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-md bg-[rgba(37,42,46,0.02)] border border-[rgba(37,42,46,0.06)] gap-3 min-w-0 w-full box-border"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-sm text-[#252A2E] truncate">
                          {m.name}
                        </span>
                        <span className="text-xs text-[#6B7280] flex-shrink-0">
                          ({m.memberId || m.id})
                        </span>
                      </div>
                      <div className="text-xs text-[#4B555D] mt-0.5 truncate">
                        {m.planName || 'Standard'} • Exp: {formatDate(m.expiryDate)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {evalStatus.isDue ? (
                        <span className="text-xs font-bold text-[#A83D3D] bg-[rgba(168,61,61,0.08)] px-2 py-0.5 rounded whitespace-nowrap">
                          Due: ₹{m.dueAmount || m.amountDue || 0}
                        </span>
                      ) : evalStatus.isExpiringToday ? (
                        <span className="text-xs font-bold text-[#997A00] bg-[rgba(244,196,0,0.15)] px-2 py-0.5 rounded whitespace-nowrap">
                          Expires Today
                        </span>
                      ) : evalStatus.isExpiringSoon ? (
                        <span className="text-xs font-semibold text-[#997A00] bg-[rgba(244,196,0,0.12)] px-2 py-0.5 rounded whitespace-nowrap">
                          Expires in {evalStatus.diff}d
                        </span>
                      ) : evalStatus.isExpired ? (
                        <span className="text-xs font-semibold text-[#A83D3D] bg-[rgba(168,61,61,0.08)] px-2 py-0.5 rounded whitespace-nowrap">
                          Expired
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#4B555D] bg-[rgba(75,85,93,0.08)] px-2 py-0.5 rounded whitespace-nowrap">
                          {evalStatus.badgeLabel}
                        </span>
                      )}

                      <Link
                        to={`/owner/members/${m.id || m.docId}`}
                        className="text-xs font-semibold text-[#252A2E] bg-white border border-[rgba(37,42,46,0.15)] px-2.5 py-1 rounded no-underline inline-flex items-center gap-1 hover:border-[#252A2E] hover:bg-[#FAF8F4] transition-all"
                      >
                        <span>Action</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── D. FINANCIAL OVERVIEW — SECOND ───────────────────────────── */}
      <section className="mb-8 sm:mb-10 w-full min-w-0">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4 flex-wrap gap-2 min-w-0">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                letterSpacing: '0.04em',
              }}
              className="text-xl sm:text-2xl text-[#252A2E] m-0"
            >
              FINANCIAL OVERVIEW
            </h2>
            <p className="text-xs sm:text-sm text-[#4B555D] mt-0.5 mb-0">
              Real-time revenue receipts and ledger standing recorded in Firestore
            </p>
          </div>
          <Link
            to="/owner/payments"
            className="text-xs sm:text-sm font-semibold text-[#252A2E] no-underline inline-flex items-center gap-1 hover:text-[#D4A900] transition-colors"
          >
            <span>Open Payments Ledger</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 4 Responsive Financial Cards (wraps cleanly to 2 cols on narrower desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 w-full min-w-0">
          {/* 1. Collected Today */}
          <div
            id="financial-card-collected-today"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(37,42,46,0.08)] rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[130px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-[#4B555D] truncate">
                Collected Today
              </span>
              <div className="w-8 h-8 rounded-md bg-[rgba(47,125,74,0.08)] text-[#2F7D4A] flex items-center justify-center flex-shrink-0">
                <Calendar size={17} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-2 truncate"
            >
              ₹{Number(dashboardMetrics.collectionsToday || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#2F7D4A] font-medium truncate block">
              Active business day collections
            </span>
          </div>

          {/* 2. Collected This Month */}
          <div
            id="financial-card-collected-month"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(37,42,46,0.08)] rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[130px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-[#4B555D] truncate">
                This Month (MTD)
              </span>
              <div className="w-8 h-8 rounded-md bg-[rgba(244,196,0,0.15)] text-[#D4A900] flex items-center justify-center flex-shrink-0">
                <TrendingUp size={17} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-2 truncate"
            >
              ₹{Number(dashboardMetrics.collectionsThisMonth || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#4B555D] font-medium truncate block">
              Current month cashflow
            </span>
          </div>

          {/* 3. Total Lifetime Revenue */}
          <div
            id="financial-card-total-revenue"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(37,42,46,0.08)] rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[130px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-[#4B555D] truncate">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-md bg-[rgba(37,42,46,0.08)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                <IndianRupee size={17} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#252A2E] leading-none my-2 truncate"
            >
              ₹{Number(dashboardMetrics.totalRevenueCollected || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#4B555D] font-medium truncate block">
              Verified lifetime receipts
            </span>
          </div>

          {/* 4. Outstanding Dues */}
          <div
            id="financial-card-outstanding-dues"
            className="metric-card-interactive w-full min-w-0 bg-white border border-[rgba(168,61,61,0.2)] rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer min-h-[130px] box-border shadow-[0_1px_3px_rgba(37,42,46,0.04)]"
            onClick={() => navigate('/owner/payments')}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-[#A83D3D] truncate">
                Outstanding Dues
              </span>
              <div className="w-8 h-8 rounded-md bg-[rgba(168,61,61,0.08)] text-[#A83D3D] flex items-center justify-center flex-shrink-0">
                <AlertCircle size={17} />
              </div>
            </div>
            <div
              style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
              className="text-3xl sm:text-4xl text-[#A83D3D] leading-none my-2 truncate"
            >
              ₹{Number(dashboardMetrics.totalOutstandingDues || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#A83D3D] font-semibold truncate block">
              {dashboardMetrics.dueMembers} member{dashboardMetrics.dueMembers === 1 ? '' : 's'} with due balance
            </span>
          </div>
        </div>
      </section>

      {/* ── E & F. SPLIT SECTION: RECENT TRANSACTIONS & REAL ANALYTICS ─ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 sm:mb-10 w-full min-w-0">
        {/* E. Recent Activity: Verified Collections */}
        <section className="bg-white border border-[rgba(37,42,46,0.08)] rounded-xl shadow-[0_1px_3px_rgba(37,42,46,0.04)] p-4 sm:p-5 lg:p-6 flex flex-col min-w-0 w-full box-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 min-w-0">
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  letterSpacing: '0.04em',
                }}
                className="text-lg sm:text-xl text-[#252A2E] m-0"
              >
                RECENT TRANSACTIONS
              </h3>
              <p className="text-xs text-[#4B555D] mt-0.5 mb-0">
                Latest verified payment collections
              </p>
            </div>
            <Link
              to="/owner/payments"
              className="text-xs sm:text-sm text-[#252A2E] font-semibold no-underline inline-flex items-center gap-1 hover:text-[#D4A900] transition-colors"
            >
              <span>Full Ledger</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="p-8 sm:p-10 text-center text-[#4B555D] text-xs sm:text-sm">
              <Receipt size={28} color="#4B555D" className="mx-auto mb-2 opacity-40" />
              No transaction history recorded yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 w-full min-w-0">
              {recentTransactions.map((p) => (
                <div
                  key={p.id || p.receiptNumber}
                  className="flex items-center justify-between p-3 rounded-md bg-[rgba(37,42,46,0.02)] border border-[rgba(37,42,46,0.05)] gap-3 min-w-0 w-full box-border"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-md bg-[rgba(47,125,74,0.08)] text-[#2F7D4A] flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                      ₹
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs sm:text-sm text-[#252A2E] truncate">
                        {p.memberName}
                      </div>
                      <div className="text-[0.72rem] sm:text-xs text-[#4B555D] mt-0.5 truncate">
                        {p.receiptNumber} • {p.paymentMode || 'Cash'} • {formatDate(p.paymentDateStr || p.paymentDate)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-xs sm:text-sm text-[#2F7D4A] whitespace-nowrap">
                      +₹{Number(p.amountPaid || 0).toLocaleString('en-IN')}
                    </div>
                    {p.remainingDueAmount > 0 && (
                      <div className="text-[0.7rem] text-[#A83D3D] font-semibold whitespace-nowrap">
                        Due: ₹{p.remainingDueAmount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* F. Real Analytics: Plan Distribution & Payment Modes */}
        <section className="bg-white border border-[rgba(37,42,46,0.08)] rounded-xl shadow-[0_1px_3px_rgba(37,42,46,0.04)] p-4 sm:p-5 lg:p-6 flex flex-col justify-between min-w-0 w-full box-border">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2 min-w-0">
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    letterSpacing: '0.04em',
                  }}
                  className="text-lg sm:text-xl text-[#252A2E] m-0"
                >
                  OPERATIONAL ANALYTICS
                </h3>
                <p className="text-xs text-[#4B555D] mt-0.5 mb-0">
                  Live membership distribution & payment methods from verified data
                </p>
              </div>
              <div className="w-8 h-8 rounded-md bg-[rgba(37,42,46,0.05)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                <PieChart size={17} />
              </div>
            </div>

            {/* Plan Distribution Progress Bars */}
            <div className="mb-5 sm:mb-6 w-full min-w-0">
              <div className="text-xs font-bold text-[#252A2E] uppercase tracking-wide mb-2.5">
                Active Plan Distribution
              </div>
              {planBreakdownEntries.length === 0 ? (
                <div className="text-xs text-[#6B7280]">No active plan data yet.</div>
              ) : (
                <div className="flex flex-col gap-2 w-full min-w-0">
                  {planBreakdownEntries.slice(0, 4).map(([planName, count]) => {
                    const percent = Math.round((count / totalPlanMembers) * 100);
                    return (
                      <div key={planName} className="w-full min-w-0">
                        <div className="flex justify-between text-xs mb-1 min-w-0">
                          <span className="font-semibold text-[#252A2E] truncate pr-2">{planName}</span>
                          <span className="text-[#4B555D] flex-shrink-0">{count} ({percent}%)</span>
                        </div>
                        <div className="h-1.5 bg-[rgba(37,42,46,0.08)] rounded-full overflow-hidden w-full max-w-full">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-[#F4C400] rounded-full transition-all duration-300"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Modes */}
            <div className="w-full min-w-0">
              <div className="text-xs font-bold text-[#252A2E] uppercase tracking-wide mb-2.5">
                Payment Channel Breakdown
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full min-w-0">
                <div className="p-2 sm:p-2.5 bg-[rgba(37,42,46,0.03)] rounded-md text-center min-w-0 overflow-hidden box-border">
                  <div className="text-[0.68rem] sm:text-xs text-[#6B7280] uppercase font-semibold truncate">Cash</div>
                  <div
                    style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
                    className="text-lg sm:text-xl text-[#252A2E] mt-0.5 truncate leading-none"
                  >
                    ₹{Number(paymentModes.Cash || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2 sm:p-2.5 bg-[rgba(37,42,46,0.03)] rounded-md text-center min-w-0 overflow-hidden box-border">
                  <div className="text-[0.68rem] sm:text-xs text-[#6B7280] uppercase font-semibold truncate">UPI</div>
                  <div
                    style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
                    className="text-lg sm:text-xl text-[#252A2E] mt-0.5 truncate leading-none"
                  >
                    ₹{Number(paymentModes.UPI || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2 sm:p-2.5 bg-[rgba(37,42,46,0.03)] rounded-md text-center min-w-0 overflow-hidden box-border">
                  <div className="text-[0.68rem] sm:text-xs text-[#6B7280] uppercase font-semibold truncate">Card</div>
                  <div
                    style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)' }}
                    className="text-lg sm:text-xl text-[#252A2E] mt-0.5 truncate leading-none"
                  >
                    ₹{Number(paymentModes.Card || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── MANAGE MODAL / ACTION DRAWER ────────────────────────────── */}
      {showManageModal && (
        <div
          id="manage-modal-backdrop"
          onClick={() => setShowManageModal(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[rgba(37,42,46,0.1)] rounded-lg shadow-2xl w-full max-w-[440px] p-5 sm:p-7 box-border"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(37,42,46,0.08)] mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    letterSpacing: '0.04em',
                  }}
                  className="text-xl sm:text-2xl text-[#252A2E] m-0"
                >
                  MANAGE GYM
                </h3>
                <p className="text-xs text-[#4B555D] mt-0.5 mb-0">
                  Quick shortcuts to primary management areas
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="bg-transparent border-0 cursor-pointer text-[#4B555D] p-1 hover:text-[#252A2E] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-2.5">
              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/members');
                }}
                className="flex items-center justify-between p-3.5 rounded-md border border-[rgba(37,42,46,0.08)] bg-[#FAF8F4] cursor-pointer hover:bg-[#F5EFE4] hover:border-[rgba(37,42,46,0.25)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[rgba(37,42,46,0.08)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#252A2E]">
                      Members Directory
                    </div>
                    <div className="text-xs text-[#4B555D]">
                      Search, edit, freeze, renew, or archive
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#4B555D" />
              </div>

              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/plans');
                }}
                className="flex items-center justify-between p-3.5 rounded-md border border-[rgba(37,42,46,0.08)] bg-[#FAF8F4] cursor-pointer hover:bg-[#F5EFE4] hover:border-[rgba(37,42,46,0.25)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[rgba(37,42,46,0.08)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#252A2E]">
                      Membership Plans
                    </div>
                    <div className="text-xs text-[#4B555D]">
                      Manage pricing, terms, and active plans
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#4B555D" />
              </div>

              <div
                onClick={() => {
                  setShowManageModal(false);
                  navigate('/owner/payments');
                }}
                className="flex items-center justify-between p-3.5 rounded-md border border-[rgba(37,42,46,0.08)] bg-[#FAF8F4] cursor-pointer hover:bg-[#F5EFE4] hover:border-[rgba(37,42,46,0.25)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-[rgba(37,42,46,0.08)] text-[#252A2E] flex items-center justify-center flex-shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#252A2E]">
                      Payments Ledger
                    </div>
                    <div className="text-xs text-[#4B555D]">
                      View collections, print receipts, and manage dues
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#4B555D" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
