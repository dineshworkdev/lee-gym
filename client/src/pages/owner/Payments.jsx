import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Receipt,
  Printer,
  DollarSign,
  TrendingUp,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useOwnerGym, formatDate, CURRENT_DATE_STR } from '../../context/OwnerGymContext.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';
import { GYM_INFO } from '../../data/gymData.js';

export default function Payments() {
  const {
    payments,
    isPaymentsLoading,
    refreshPayments,
    members,
    recordPayment,
  } = useOwnerGym();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [modeFilter, setModeFilter] = useState('all'); // 'all', 'Cash', 'UPI', 'Card', 'Other'
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'dues'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Quick Record Payment for Dues Modal state
  const [recordDuesMember, setRecordDuesMember] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [collectMode, setCollectMode] = useState('Cash');
  const [collectDate, setCollectDate] = useState(CURRENT_DATE_STR);
  const [collectNotes, setCollectNotes] = useState('');
  const [collectError, setCollectError] = useState('');
  const [isSubmittingCollect, setIsSubmittingCollect] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    refreshPayments();
  }, [refreshPayments]);

  // Date range filter calculations
  const filteredPayments = useMemo(() => {
    const today = CURRENT_DATE_STR;
    const now = new Date();

    return payments.filter((p) => {
      // 1. Search Query (Receipt #, Member Name, Member ID, Notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const rMatch = (p.receiptNumber || '').toLowerCase().includes(q);
        const nMatch = (p.memberName || '').toLowerCase().includes(q);
        const idMatch = (p.memberCode || p.memberId || '').toLowerCase().includes(q);
        const notesMatch = (p.notes || '').toLowerCase().includes(q);
        if (!rMatch && !nMatch && !idMatch && !notesMatch) return false;
      }

      // 2. Mode filter
      if (modeFilter !== 'all') {
        const m = (p.paymentMode || '').toLowerCase();
        if (modeFilter === 'Cash' && !m.includes('cash')) return false;
        if (modeFilter === 'UPI' && !m.includes('upi') && !m.includes('online')) return false;
        if (modeFilter === 'Card' && !m.includes('card')) return false;
        if (modeFilter === 'Other' && (m.includes('cash') || m.includes('upi') || m.includes('card'))) return false;
      }

      // 3. Date range filter
      const pDateStr = p.paymentDateStr || (p.paymentDate?.toDate ? p.paymentDate.toDate().toISOString().split('T')[0] : '');
      if (!pDateStr) return true;

      if (dateFilter === 'today') {
        return pDateStr === today;
      }
      if (dateFilter === 'month') {
        return pDateStr.startsWith(today.slice(0, 7)); // Same YYYY-MM
      }
      if (dateFilter === 'week') {
        const pDate = new Date(pDateStr + 'T12:00:00');
        const diffDays = (now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (dateFilter === 'custom') {
        if (customStartDate && pDateStr < customStartDate) return false;
        if (customEndDate && pDateStr > customEndDate) return false;
      }

      return true;
    });
  }, [payments, searchQuery, modeFilter, dateFilter, customStartDate, customEndDate]);

  // Collections Summary for selected filter range
  const summaryMetrics = useMemo(() => {
    let totalCollected = 0;
    let cashTotal = 0;
    let upiTotal = 0;
    let otherTotal = 0;

    filteredPayments.forEach((p) => {
      const amt = Number(p.amountPaid || 0);
      totalCollected += amt;

      const m = (p.paymentMode || '').toLowerCase();
      if (m.includes('cash')) cashTotal += amt;
      else if (m.includes('upi') || m.includes('online')) upiTotal += amt;
      else otherTotal += amt;
    });

    return { totalCollected, cashTotal, upiTotal, otherTotal, count: filteredPayments.length };
  }, [filteredPayments]);

  // Members with Outstanding Dues
  const duesMembers = useMemo(() => {
    return members.filter((m) => {
      const due = Number(m.dueAmount !== undefined ? m.dueAmount : (m.amountDue || 0));
      return due > 0 && !m.isArchived;
    });
  }, [members]);

  const totalOutstandingDues = useMemo(() => {
    return duesMembers.reduce((acc, m) => {
      return acc + Number(m.dueAmount !== undefined ? m.dueAmount : (m.amountDue || 0));
    }, 0);
  }, [duesMembers]);

  // Pagination for transactions
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  // Record payment for dues
  const handleOpenDuesCollect = (member) => {
    const due = Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0));
    setRecordDuesMember(member);
    setCollectAmount(String(due));
    setCollectMode('Cash');
    setCollectDate(CURRENT_DATE_STR);
    setCollectNotes('Settlement of outstanding balance');
    setCollectError('');
  };

  const handleSaveCollect = async (e) => {
    e.preventDefault();
    if (!recordDuesMember || isSubmittingCollect) return;

    const amt = Number(collectAmount);
    const due = Number(recordDuesMember.dueAmount !== undefined ? recordDuesMember.dueAmount : (recordDuesMember.amountDue || 0));

    if (isNaN(amt) || amt <= 0) {
      setCollectError('Please enter a valid amount.');
      return;
    }
    if (amt > due) {
      setCollectError(`Payment cannot exceed outstanding balance of ₹${due}.`);
      return;
    }

    setIsSubmittingCollect(true);
    setCollectError('');
    try {
      const res = await recordPayment(
        recordDuesMember.id,
        amt,
        collectMode,
        collectDate,
        collectNotes
      );
      if (res.success) {
        if (res.payment) {
          setSelectedReceipt(res.payment);
        }
        setRecordDuesMember(null);
      } else {
        setCollectError(res.message || 'Payment recording failed.');
      }
    } catch (err) {
      setCollectError(err.message || 'Error recording payment.');
    } finally {
      setIsSubmittingCollect(false);
    }
  };

  const getWhatsAppReminderUrl = (member) => {
    const due = Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0));
    const cleanPhone = (member.mobile || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${member.name}, this is a gentle reminder from ${GYM_INFO.name} regarding your membership fee for the ${member.planName} plan. Outstanding balance: ₹${due}. Kindly clear your dues at the gym reception at your earliest convenience. Thank you! - Lee Gym`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  const handleCopyReminder = (member) => {
    const due = Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0));
    const text = `Hello ${member.name}, this is a gentle reminder from ${GYM_INFO.name} regarding your membership fee for the ${member.planName} plan. Outstanding balance: ₹${due}. Kindly clear your dues at the gym reception. Thank you!`;
    navigator.clipboard.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
        }}
      >
        <div>
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
            PAYMENTS &amp; REVENUE
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.85rem', color: 'var(--color-slate, #4B555D)', margin: '0.3rem 0 0' }}>
            Authoritative collections ledger, receipt generation, and member dues management
          </p>
        </div>

        {/* View Switcher: Transactions vs Outstanding Dues */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: '8px', border: '1px solid rgba(37, 42, 46, 0.12)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: activeTab === 'transactions' ? '#252A2E' : 'transparent',
              color: activeTab === 'transactions' ? '#FFFFFF' : 'var(--color-charcoal, #252A2E)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 120ms ease',
            }}
          >
            <Receipt size={15} />
            <span>Transactions ({payments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dues')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: activeTab === 'dues' ? 'rgba(168, 61, 61, 0.12)' : 'transparent',
              color: activeTab === 'dues' ? '#A83D3D' : 'var(--color-charcoal, #252A2E)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 120ms ease',
            }}
          >
            <AlertCircle size={15} color={activeTab === 'dues' ? '#A83D3D' : 'currentColor'} />
            <span>Outstanding Dues ({duesMembers.length})</span>
          </button>
        </div>
      </div>

      {/* ── METRIC CARDS ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.25rem 1.4rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
            Collections in Selected Range
          </div>
          <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.2rem', color: '#2F7D4A', lineHeight: 1.1, margin: '0.35rem 0' }}>
            ₹{summaryMetrics.totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>
            From <strong>{summaryMetrics.count}</strong> transaction{summaryMetrics.count !== 1 ? 's' : ''}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.25rem 1.4rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
            Cash Received
          </div>
          <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.2rem', color: 'var(--color-charcoal, #252A2E)', lineHeight: 1.1, margin: '0.35rem 0' }}>
            ₹{summaryMetrics.cashTotal.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>Desk cash collection</div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.25rem 1.4rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate, #4B555D)' }}>
            UPI / Online Received
          </div>
          <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.2rem', color: 'var(--color-charcoal, #252A2E)', lineHeight: 1.1, margin: '0.35rem 0' }}>
            ₹{summaryMetrics.upiTotal.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate, #4B555D)' }}>Digital payments</div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(168, 61, 61, 0.15)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.25rem 1.4rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A83D3D' }}>
            Total Unpaid Dues
          </div>
          <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.2rem', color: '#A83D3D', lineHeight: 1.1, margin: '0.35rem 0' }}>
            ₹{totalOutstandingDues.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#A83D3D' }}>
            Across <strong>{duesMembers.length}</strong> member{duesMembers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── TAB 1: TRANSACTIONS LEDGER ──────────────────────────────── */}
      {activeTab === 'transactions' && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(37, 42, 46, 0.04)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
              <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#4B555D' }}>
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search receipt #, member name, ID..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  border: '1px solid rgba(37, 42, 46, 0.15)',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Date Quick Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'Past 7 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setDateFilter(t.id);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '0.45rem 0.75rem',
                    border: dateFilter === t.id ? '1px solid #252A2E' : '1px solid rgba(37, 42, 46, 0.15)',
                    borderRadius: '4px',
                    backgroundColor: dateFilter === t.id ? '#252A2E' : '#FFFFFF',
                    color: dateFilter === t.id ? '#FFFFFF' : '#252A2E',
                    fontSize: '0.8rem',
                    fontWeight: dateFilter === t.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Mode Filter */}
            <div>
              <select
                value={modeFilter}
                onChange={(e) => {
                  setModeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ padding: '0.55rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontWeight: 600, fontSize: '0.82rem' }}
              >
                <option value="all">All Modes</option>
                <option value="Cash">Cash Only</option>
                <option value="UPI">UPI / Online</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range Picker */}
          {dateFilter === 'custom' && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#FFFFFF', padding: '0.75rem 1rem', border: '1px solid rgba(37, 42, 46, 0.1)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4B555D' }}>Custom Range:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '4px', fontWeight: 500 }}
              />
              <span style={{ color: '#4B555D' }}>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '4px', fontWeight: 500 }}
              />
            </div>
          )}

          {/* Payments Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(37, 42, 46, 0.04)',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            {isPaymentsLoading ? (
              <div style={{ padding: '3.5rem', textAlign: 'center', color: '#4B555D', fontWeight: 700 }}>
                Loading payment records from Firestore...
              </div>
            ) : paginatedPayments.length === 0 ? (
              <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                <Receipt size={36} color="#7A8288" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.75rem', color: '#252A2E', margin: 0 }}>
                  NO TRANSACTIONS MATCHED
                </h3>
                <p style={{ color: '#4B555D', fontSize: '0.85rem', margin: '0.4rem 0 0' }}>
                  Try adjusting your search criteria or date filters.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#252A2E', color: '#FFFFFF' }}>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Receipt #
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Date
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Member
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Plan
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Amount Paid
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Mode
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Remaining Due
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((p, idx) => {
                      const payDate = formatDate(p.paymentDate || p.createdAt);
                      const isClear = Number(p.remainingDueAmount || 0) === 0;

                      return (
                        <tr
                          key={p.id || p.docId || idx}
                          style={{
                            borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                            backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                          }}
                        >
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span
                              style={{
                                backgroundColor: '#252A2E',
                                color: '#F4C400',
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                padding: '0.2rem 0.5rem',
                              }}
                            >
                              {p.receiptNumber || 'RECEIPT'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#4B555D', fontWeight: 600 }}>
                            {payDate}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: '#252A2E' }}>{p.memberName || 'Member'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#7A8288', fontFamily: 'monospace' }}>
                              {p.memberCode || p.memberId}
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                            {p.planName || 'General'}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#2F7D4A', fontSize: '1.05rem' }}>
                            ₹{Number(p.amountPaid || 0).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span
                              style={{
                                border: '1px solid #252A2E',
                                padding: '0.2rem 0.5rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                              }}
                            >
                              {p.paymentMode || 'Cash'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontWeight: 700, color: isClear ? '#2F7D4A' : '#A83D3D' }}>
                              ₹{Number(p.remainingDueAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(p)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                backgroundColor: '#252A2E',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.45rem 0.8rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Printer size={13} />
                              <span>Receipt</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>
                Page {currentPage} of {totalPages} ({filteredPayments.length} transactions)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '0.45rem 0.85rem',
                    border: '1.5px solid #252A2E',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '0.45rem 0.85rem',
                    border: '1.5px solid #252A2E',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: OUTSTANDING DUES CENTRE ─────────────────────────── */}
      {activeTab === 'dues' && (
        <div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 42, 46, 0.08)',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(37, 42, 46, 0.04)',
              overflow: 'hidden',
            }}
          >
            {duesMembers.length === 0 ? (
              <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
                <Check size={42} color="#2F7D4A" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', color: '#2F7D4A', margin: 0 }}>
                  ALL MEMBERS ARE FULLY SETTLED!
                </h3>
                <p style={{ color: '#4B555D', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                  There are currently zero members with outstanding balance dues.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#A83D3D', color: '#FFFFFF' }}>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Member ID
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Member Name
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Mobile
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Plan
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Total Payable
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Amount Paid
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Outstanding Due
                      </th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Quick Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {duesMembers.map((m, idx) => {
                      const due = Number(m.dueAmount !== undefined ? m.dueAmount : (m.amountDue || 0));
                      return (
                        <tr
                          key={m.id || idx}
                          style={{
                            borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                            backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FFF9F9',
                          }}
                        >
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontFamily: 'monospace' }}>
                            {m.id}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                            {m.name}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace' }}>
                            {m.mobile}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                            {m.planName}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                            ₹{m.amountPayable || 0}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#2F7D4A', fontWeight: 700 }}>
                            ₹{m.amountCollected || 0}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#A83D3D', fontWeight: 900, fontSize: '1.1rem' }}>
                            ₹{due}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              {/* Collect Payment Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenDuesCollect(m)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: '#F4C400',
                                  color: '#252A2E',
                                  border: '1.5px solid #252A2E',
                                  padding: '0.45rem 0.8rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                              >
                                <DollarSign size={14} />
                                <span>Collect</span>
                              </button>

                              {/* WhatsApp Reminder Button */}
                              <a
                                href={getWhatsAppReminderUrl(m)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '0.45rem 0.75rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  textDecoration: 'none',
                                }}
                                title="Send WhatsApp Reminder"
                              >
                                <MessageCircle size={14} />
                                <span>Remind</span>
                              </a>

                              {/* Copy message button */}
                              <button
                                type="button"
                                onClick={() => handleCopyReminder(m)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #252A2E',
                                  padding: '0.45rem 0.6rem',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                }}
                                title="Copy reminder text"
                              >
                                {copiedId === m.id ? <Check size={13} color="#2F7D4A" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RECORD PAYMENT MODAL (FROM DUES TAB) ─────────────────────── */}
      {recordDuesMember && (
        <div
          onClick={() => setRecordDuesMember(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37, 42, 46, 0.75)',
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
              border: '1px solid rgba(37, 42, 46, 0.1)',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                  COLLECT OUTSTANDING DUE
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>{recordDuesMember.name} ({recordDuesMember.id})</div>
              </div>
              <button type="button" onClick={() => setRecordDuesMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A8288' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveCollect} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {collectError && (
                <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #A83D3D', borderRadius: '6px', color: '#A83D3D', padding: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  {collectError}
                </div>
              )}

              <div style={{ backgroundColor: 'rgba(168, 61, 61, 0.06)', border: '1px solid rgba(168, 61, 61, 0.2)', borderRadius: '6px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A83D3D' }}>Total Due Amount:</span>
                <strong style={{ fontSize: '1.2rem', color: '#A83D3D' }}>
                  ₹{Number(recordDuesMember.dueAmount !== undefined ? recordDuesMember.dueAmount : recordDuesMember.amountDue || 0)}
                </strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Amount to Collect (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Payment Mode
                </label>
                <select
                  value={collectMode}
                  onChange={(e) => setCollectMode(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / Online">UPI / Online</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={collectDate}
                  onChange={(e) => setCollectDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', boxSizing: 'border-box', fontWeight: 500 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Notes / Reference
                </label>
                <input
                  type="text"
                  value={collectNotes}
                  onChange={(e) => setCollectNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRecordDuesMember(null)}
                  disabled={isSubmittingCollect}
                  style={{ padding: '0.65rem 1.25rem', border: '1px solid rgba(37, 42, 46, 0.2)', background: '#FFFFFF', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCollect}
                  style={{
                    padding: '0.65rem 1.5rem',
                    border: '1px solid #D4A900',
                    background: '#F4C400',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isSubmittingCollect ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmittingCollect ? 'Recording...' : 'Confirm & Collect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINTABLE RECEIPT MODAL ─────────────────────────────────── */}
      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
