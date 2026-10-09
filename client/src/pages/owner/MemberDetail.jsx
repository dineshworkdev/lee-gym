import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Phone,
  Calendar,
  X,
  Check,
  Receipt,
  AlertCircle,
  Plus,
  RefreshCw,
  Snowflake,
  PlayCircle,
  Archive,
  RotateCcw,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import {
  useOwnerGym,
  formatDate,
  CURRENT_DATE_STR,
} from '../../context/OwnerGymContext.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';
import {
  calculateRenewalDates,
  calculateResumeExtension,
  calculateExpiryDate,
} from '../../utils/membershipRules.js';

export default function MemberDetail() {
  const { id } = useParams();
  const {
    members,
    plans,
    isOwner,
    memberEvaluator,
    updateMember,
    recordPayment,
    renewMember,
    freezeMember,
    resumeMember,
    archiveMember,
    restoreMember,
    getMemberPayments,
  } = useOwnerGym();

  const member = members.find((m) => m.id === id || m.docId === id || m.memberId === id);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Payment History State
  const [payments, setPayments] = useState([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState(null);

  // Record payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(CURRENT_DATE_STR);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentModalError, setPaymentModalError] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Renewal form state
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewStartDate, setRenewStartDate] = useState('');
  const [renewDiscount, setRenewDiscount] = useState('0');
  const [renewAmountCollected, setRenewAmountCollected] = useState('');
  const [renewPaymentMode, setRenewPaymentMode] = useState('Cash');
  const [renewPaymentDate, setRenewPaymentDate] = useState(CURRENT_DATE_STR);
  const [renewNotes, setRenewNotes] = useState('');
  const [renewError, setRenewError] = useState('');
  const [isSubmittingRenew, setIsSubmittingRenew] = useState(false);

  // Freeze form state
  const [freezeStartDate, setFreezeStartDate] = useState(CURRENT_DATE_STR);
  const [freezeExpectedEndDate, setFreezeExpectedEndDate] = useState('');
  const [freezeReason, setFreezeReason] = useState('');
  const [freezeError, setFreezeError] = useState('');
  const [isSubmittingFreeze, setIsSubmittingFreeze] = useState(false);

  // Resume form state
  const [resumeDate, setResumeDate] = useState(CURRENT_DATE_STR);
  const [isSubmittingResume, setIsSubmittingResume] = useState(false);

  // Archive state
  const [archiveReason, setArchiveReason] = useState('');
  const [isSubmittingArchive, setIsSubmittingArchive] = useState(false);

  // Load payments on mount or when member changes
  useEffect(() => {
    let isMounted = true;
    if (member && getMemberPayments) {
      setIsPaymentsLoading(true);
      setPaymentsError('');
      getMemberPayments(member.memberId || member.id, member.docId)
        .then((data) => {
          if (isMounted) {
            setPayments(data);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Error fetching member payments:', err);
            setPaymentsError('Failed to load payment history.');
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsPaymentsLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [member?.id, member?.docId, getMemberPayments]);

  if (!member) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.5rem', color: '#252A2E' }}>
          MEMBER NOT FOUND
        </h2>
        <p style={{ color: '#4B555D', marginBottom: '1.5rem' }}>No member exists with ID: {id}</p>
        <Link
          to="/owner/members"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#252A2E',
            color: '#FFFFFF',
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Members</span>
        </Link>
      </div>
    );
  }

  const evalStatus = memberEvaluator(member);
  const currentDue = Number(member?.dueAmount !== undefined ? member.dueAmount : (member?.amountDue || 0));
  const hasDue = currentDue > 0;

  const showNotice = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // ── EDIT HANDLERS ─────────────────────────────────────────────────
  const handleOpenEdit = () => {
    setEditForm({
      name: member.name || '',
      mobile: member.mobile || '',
      gender: member.gender || 'Male',
      dobOrAge: member.dobOrAge || '',
      height: member.height || '',
      weight: member.weight || '',
      address: member.address || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await updateMember(member.id, editForm);
    setShowEditModal(false);
    showNotice('Member details updated successfully.');
  };

  // ── RECORD PAYMENT HANDLERS ───────────────────────────────────────
  const handleOpenPayment = () => {
    if (!hasDue) return;
    setPaymentAmount(String(currentDue));
    setPaymentMode('Cash');
    setPaymentDate(CURRENT_DATE_STR);
    setPaymentNotes('');
    setPaymentModalError('');
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (isSubmittingPayment) return;

    const amt = Number(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      setPaymentModalError('Please enter a valid payment amount greater than ₹0.');
      return;
    }

    if (amt > currentDue) {
      setPaymentModalError(
        `Payment amount (₹${amt}) cannot exceed current outstanding due amount (₹${currentDue}).`
      );
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentModalError('');

    try {
      const res = await recordPayment(
        member.id,
        amt,
        paymentMode,
        paymentDate,
        paymentNotes
      );

      if (res.success) {
        if (res.payment) {
          setPayments((prev) => [res.payment, ...prev]);
          setSelectedReceiptPayment(res.payment);
        }
        setShowPaymentModal(false);
        showNotice(`Payment of ₹${amt} recorded successfully.`);
      } else {
        setPaymentModalError(res.message || 'Payment recording failed.');
      }
    } catch (err) {
      console.error('Payment submit error:', err);
      setPaymentModalError(err.message || 'Failed to record payment.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // ── RENEWAL HANDLERS ──────────────────────────────────────────────
  const handleOpenRenew = () => {
    const activePlans = plans.filter((p) => p.status === 'Active');
    const defaultPlan = activePlans[0] || plans[0] || { id: 'default', name: 'Monthly', price: 1000, durationDays: 30 };
    setRenewPlanId(defaultPlan.id);

    // Calculate dates
    const renewalDates = calculateRenewalDates(
      member.expiryDate,
      defaultPlan.durationDays || 30,
      null,
      CURRENT_DATE_STR
    );
    setRenewStartDate(renewalDates.startDate);
    setRenewDiscount('0');
    setRenewAmountCollected(String(defaultPlan.price || 1000));
    setRenewPaymentMode('Cash');
    setRenewPaymentDate(CURRENT_DATE_STR);
    setRenewNotes('');
    setRenewError('');
    setShowRenewModal(true);
  };

  const selectedRenewPlan = plans.find((p) => p.id === renewPlanId) || plans[0] || {
    id: 'default',
    name: 'Monthly',
    price: 1000,
    durationDays: 30,
  };

  const renewDuration = Number(selectedRenewPlan.durationDays || 30);
  const calculatedRenewExpiry = calculateExpiryDate(renewStartDate || CURRENT_DATE_STR, renewDuration);
  const renewPriceNum = Number(selectedRenewPlan.price || 0);
  const renewDiscountNum = Number(renewDiscount || 0);
  const renewNetPayable = Math.max(0, renewPriceNum - renewDiscountNum);

  const handleSaveRenew = async (e) => {
    e.preventDefault();
    if (isSubmittingRenew) return;

    if (!selectedRenewPlan?.name) {
      setRenewError('Please select a valid membership plan.');
      return;
    }

    const collectedAmt = Number(renewAmountCollected || 0);
    if (collectedAmt < 0) {
      setRenewError('Amount collected cannot be negative.');
      return;
    }

    setIsSubmittingRenew(true);
    setRenewError('');

    try {
      const res = await renewMember({
        memberDocId: member.docId,
        memberId: member.memberId || member.id,
        plan: selectedRenewPlan,
        startDate: renewStartDate,
        durationDays: renewDuration,
        expiryDate: calculatedRenewExpiry,
        planAmount: renewPriceNum,
        discount: renewDiscountNum,
        amountCollected: collectedAmt,
        paymentMode: renewPaymentMode,
        paymentDate: renewPaymentDate,
        notes: renewNotes,
      });

      if (res.success) {
        if (res.payment) {
          setPayments((prev) => [res.payment, ...prev]);
          setSelectedReceiptPayment(res.payment);
        }
        setShowRenewModal(false);
        showNotice(`Membership successfully renewed under ${selectedRenewPlan.name} plan!`);
      } else {
        setRenewError('Renewal failed. Please check inputs.');
      }
    } catch (err) {
      console.error('Renewal error:', err);
      setRenewError(err.message || 'Failed to complete renewal.');
    } finally {
      setIsSubmittingRenew(false);
    }
  };

  // ── FREEZE HANDLERS ───────────────────────────────────────────────
  const handleOpenFreeze = () => {
    setFreezeStartDate(CURRENT_DATE_STR);
    setFreezeExpectedEndDate('');
    setFreezeReason('');
    setFreezeError('');
    setShowFreezeModal(true);
  };

  const handleSaveFreeze = async (e) => {
    e.preventDefault();
    if (isSubmittingFreeze) return;

    setIsSubmittingFreeze(true);
    setFreezeError('');
    try {
      await freezeMember(member.id, {
        startDate: freezeStartDate,
        expectedEndDate: freezeExpectedEndDate,
        reason: freezeReason || 'Medical / Personal hiatus',
      });
      setShowFreezeModal(false);
      showNotice('Membership frozen successfully.');
    } catch (err) {
      console.error('Freeze error:', err);
      setFreezeError(err.message || 'Failed to freeze membership.');
    } finally {
      setIsSubmittingFreeze(false);
    }
  };

  // ── RESUME HANDLERS ───────────────────────────────────────────────
  const handleOpenResume = () => {
    setResumeDate(CURRENT_DATE_STR);
    setShowResumeModal(true);
  };

  const handleSaveResume = async (e) => {
    e.preventDefault();
    if (isSubmittingResume) return;

    setIsSubmittingResume(true);
    try {
      const res = await resumeMember(member.id, resumeDate);
      setShowResumeModal(false);
      showNotice(
        `Membership resumed! Expiry extended by ${res.actualFrozenDays} days to ${formatDate(res.newExpiryDate)}.`
      );
    } catch (err) {
      console.error('Resume error:', err);
      alert(err.message || 'Failed to resume membership.');
    } finally {
      setIsSubmittingResume(false);
    }
  };

  // ── ARCHIVE & RESTORE HANDLERS ────────────────────────────────────
  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmittingArchive(true);
    try {
      await archiveMember(member.id, archiveReason);
      setShowArchiveModal(false);
      showNotice('Member safely archived. Financial and renewal history preserved.');
    } catch (err) {
      console.error('Archive error:', err);
      alert(err.message || 'Failed to archive member.');
    } finally {
      setIsSubmittingArchive(false);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Restore this member back to active directory?')) return;
    try {
      await restoreMember(member.id);
      showNotice('Member restored back to active directory.');
    } catch (err) {
      console.error('Restore error:', err);
      alert(err.message || 'Failed to restore member.');
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {/* ── TOP BACK NAVIGATION & NOTIFICATION ──────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/owner/members"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#252A2E',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} />
          <span>BACK TO MEMBERS</span>
        </Link>

        {feedbackMsg && (
          <div
            style={{
              backgroundColor: '#2F7D4A',
              color: '#FFFFFF',
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '2px',
            }}
          >
            <Check size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* ── FROZEN / ARCHIVED STATUS BANNER ─────────────────────────── */}
      {evalStatus.isFrozen && (
        <div
          style={{
            backgroundColor: '#E1F3F8',
            border: '2px solid #1D6F8A',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Snowflake size={24} color="#1D6F8A" />
            <div>
              <div style={{ fontWeight: 800, color: '#1D6F8A', fontSize: '0.95rem' }}>
                MEMBERSHIP IS CURRENTLY FROZEN
              </div>
              <div style={{ fontSize: '0.82rem', color: '#4B555D' }}>
                Frozen since: <strong>{formatDate(member.freezeInfo?.startDate)}</strong>
                {member.freezeInfo?.expectedEndDate && ` | Expected End: ${formatDate(member.freezeInfo?.expectedEndDate)}`}
                {member.freezeInfo?.reason && ` | Reason: "${member.freezeInfo?.reason}"`}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenResume}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#1D6F8A',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.2rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <PlayCircle size={16} />
            <span>RESUME MEMBERSHIP</span>
          </button>
        </div>
      )}

      {evalStatus.isArchived && (
        <div
          style={{
            backgroundColor: '#F0F0F0',
            border: '2px solid #7A8288',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Archive size={24} color="#7A8288" />
            <div>
              <div style={{ fontWeight: 800, color: '#252A2E', fontSize: '0.95rem' }}>
                MEMBER ARCHIVED
              </div>
              <div style={{ fontSize: '0.82rem', color: '#4B555D' }}>
                Archived on: {formatDate(member.archivedAt)} | Reason: {member.archiveReason || 'Departed'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRestore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#252A2E',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.2rem',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} />
            <span>RESTORE MEMBER</span>
          </button>
        </div>
      )}

      {/* ── MEMBER HEADER PROFILE CARD ──────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #252A2E',
          boxShadow: '5px 5px 0px #252A2E',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Photo Avatar */}
          <div
            style={{
              width: '84px',
              height: '84px',
              backgroundColor: '#252A2E',
              color: '#F4C400',
              border: '2px solid #252A2E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '2.5rem',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {member.photo || member.photoUrl ? (
              <img
                src={member.photo || member.photoUrl}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              member.name?.charAt(0) || 'L'
            )}
          </div>

          {/* Name & Basic Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  letterSpacing: '0.04em',
                  color: '#252A2E',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {member.name}
              </h1>
              <span
                style={{
                  backgroundColor: '#252A2E',
                  color: '#F4C400',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.2rem 0.6rem',
                }}
              >
                {member.id}
              </span>
              <span
                style={{
                  backgroundColor: evalStatus.badgeBg,
                  color: evalStatus.badgeColor,
                  border: `1.5px solid ${evalStatus.badgeColor}`,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.55rem',
                  letterSpacing: '0.05em',
                }}
              >
                {evalStatus.badgeLabel}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '0.5rem',
                flexWrap: 'wrap',
                fontSize: '0.88rem',
                color: '#4B555D',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} />
                <span style={{ fontWeight: 600, color: '#252A2E' }}>{member.mobile}</span>
              </div>
              <span>•</span>
              <div>Gender: <strong>{member.gender || 'Male'}</strong></div>
              <span>•</span>
              <div>DOB/Age: <strong>{member.dobOrAge || '—'}</strong></div>
            </div>
          </div>
        </div>

        {/* Action Buttons: [ EDIT ], [ RENEW ], [ FREEZE / RESUME ], [ RECORD PAYMENT ], [ ARCHIVE ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            id="member-edit-btn"
            type="button"
            onClick={handleOpenEdit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              color: '#252A2E',
              border: '2px solid #252A2E',
              padding: '0.65rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '2px 2px 0px #252A2E',
              cursor: 'pointer',
            }}
          >
            <Edit size={15} />
            <span>EDIT</span>
          </button>

          {/* RENEW Button */}
          {!evalStatus.isArchived && (
            <button
              id="member-renew-btn"
              type="button"
              onClick={handleOpenRenew}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                border: '2px solid #252A2E',
                padding: '0.65rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '2px 2px 0px #252A2E',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={15} />
              <span>RENEW</span>
            </button>
          )}

          {/* FREEZE / RESUME Button */}
          {!evalStatus.isArchived && (
            evalStatus.isFrozen ? (
              <button
                id="member-resume-btn"
                type="button"
                onClick={handleOpenResume}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#1D6F8A',
                  color: '#FFFFFF',
                  border: '2px solid #252A2E',
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  boxShadow: '2px 2px 0px #252A2E',
                  cursor: 'pointer',
                }}
              >
                <PlayCircle size={15} />
                <span>RESUME</span>
              </button>
            ) : (
              <button
                id="member-freeze-btn"
                type="button"
                onClick={handleOpenFreeze}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#FFFFFF',
                  color: '#1D6F8A',
                  border: '2px solid #1D6F8A',
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  boxShadow: '2px 2px 0px #252A2E',
                  cursor: 'pointer',
                }}
              >
                <Snowflake size={15} />
                <span>FREEZE</span>
              </button>
            )
          )}

          {/* RECORD PAYMENT Button */}
          {hasDue && (
            <button
              id="member-record-payment-btn"
              type="button"
              onClick={handleOpenPayment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#2F7D4A',
                color: '#FFFFFF',
                border: '2px solid #252A2E',
                padding: '0.65rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '2px 2px 0px #252A2E',
                cursor: 'pointer',
              }}
            >
              <DollarSign size={15} />
              <span>COLLECT DUE</span>
            </button>
          )}

          {/* ARCHIVE Button (Owner only) */}
          {isOwner && !evalStatus.isArchived && (
            <button
              id="member-archive-btn"
              type="button"
              onClick={() => setShowArchiveModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FFFFFF',
                color: '#7A8288',
                border: '1.5px solid #7A8288',
                padding: '0.65rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Safe member archival"
            >
              <Archive size={15} />
              <span>ARCHIVE</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3 SECTIONS: PERSONAL, MEMBERSHIP, FINANCIALS ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* 1. PERSONAL DETAILS */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '4px 4px 0px #252A2E',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '1.5rem',
              letterSpacing: '0.04em',
              color: '#252A2E',
              borderBottom: '2px solid #252A2E',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            PERSONAL DETAILS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Height:</span>
              <strong style={{ color: '#252A2E' }}>{member.height ? `${member.height} cm` : '—'}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Weight:</span>
              <strong style={{ color: '#252A2E' }}>{member.weight ? `${member.weight} kg` : '—'}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Gender:</span>
              <strong style={{ color: '#252A2E' }}>{member.gender || '—'}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Age / DOB:</span>
              <strong style={{ color: '#252A2E' }}>{member.dobOrAge || '—'}</strong>
            </div>

            <div style={{ borderTop: '1px dashed rgba(37, 42, 46, 0.15)', paddingTop: '0.75rem' }}>
              <div style={{ color: '#4B555D', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Address:</div>
              <div style={{ color: '#252A2E', lineHeight: 1.4, fontWeight: 500 }}>
                {member.address || 'No address provided'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEMBERSHIP */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '4px 4px 0px #252A2E',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '1.5rem',
              letterSpacing: '0.04em',
              color: '#252A2E',
              borderBottom: '2px solid #252A2E',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>CURRENT MEMBERSHIP</span>
            <span
              style={{
                backgroundColor: evalStatus.badgeBg,
                color: evalStatus.badgeColor,
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
              }}
            >
              {evalStatus.badgeLabel}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Plan Name:</span>
              <strong style={{ color: '#252A2E', fontSize: '1rem' }}>{member.planName}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Joining Date:</span>
              <strong style={{ color: '#252A2E' }}>{formatDate(member.joiningDate)}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Membership Expiry:</span>
              <strong style={{ color: '#252A2E' }}>{formatDate(member.expiryDate)}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Timeline:</span>
              <div>
                {evalStatus.isExpiringToday && (
                  <span style={{ backgroundColor: '#F4C400', color: '#252A2E', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    EXPIRES TODAY
                  </span>
                )}
                {evalStatus.daysRemaining > 0 && !evalStatus.isExpiringToday && (
                  <span style={{ color: '#2F7D4A', fontWeight: 700 }}>
                    {evalStatus.daysRemaining} day{evalStatus.daysRemaining !== 1 ? 's' : ''} remaining
                  </span>
                )}
                {evalStatus.daysRemaining < 0 && (
                  <span style={{ color: '#A83D3D', fontWeight: 700 }}>
                    Expired {Math.abs(evalStatus.daysRemaining)} day{Math.abs(evalStatus.daysRemaining) !== 1 ? 's' : ''} ago
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. FINANCIALS */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '4px 4px 0px #252A2E',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '1.5rem',
              letterSpacing: '0.04em',
              color: '#252A2E',
              borderBottom: '2px solid #252A2E',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>FINANCIAL SUMMARY</span>
            {hasDue ? (
              <span style={{ backgroundColor: '#A83D3D', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                DUE: ₹{currentDue}
              </span>
            ) : (
              <span style={{ backgroundColor: '#2F7D4A', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                CLEAR
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Admission Amount:</span>
              <span style={{ fontWeight: 600, color: '#252A2E' }}>₹{member.admissionAmount || 0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Plan Amount:</span>
              <span style={{ fontWeight: 600, color: '#252A2E' }}>₹{member.planAmount || 0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed rgba(37, 42, 46, 0.15)', paddingTop: '0.6rem' }}>
              <span style={{ fontWeight: 700, color: '#252A2E' }}>Total Lifetime Payable:</span>
              <strong style={{ color: '#252A2E', fontSize: '1.05rem' }}>₹{member.amountPayable || 0}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Total Collected:</span>
              <span style={{ fontWeight: 700, color: '#2F7D4A' }}>₹{member.amountCollected || 0}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: hasDue ? '#FDF2F2' : '#F2F9F4',
                border: hasDue ? '1px solid #A83D3D' : '1px solid #2F7D4A',
              }}
            >
              <span style={{ fontWeight: 800, color: hasDue ? '#A83D3D' : '#2F7D4A' }}>Current Due:</span>
              <strong style={{ fontSize: '1.15rem', color: hasDue ? '#A83D3D' : '#2F7D4A' }}>
                ₹{currentDue}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. RENEWAL HISTORY SECTION ───────────────────────────────── */}
      {Array.isArray(member.renewals) && member.renewals.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '4px 4px 0px #252A2E',
            padding: '1.75rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={20} color="#252A2E" />
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.6rem', margin: 0, color: '#252A2E' }}>
                RENEWAL HISTORY
              </h3>
            </div>
            <span style={{ backgroundColor: '#252A2E', color: '#F4C400', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem', fontFamily: 'monospace' }}>
              {member.renewals.length} RENEWAL{member.renewals.length > 1 ? 'S' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {member.renewals.map((ren, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1px solid #252A2E',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{ren.planName}</strong>
                  <div style={{ color: '#4B555D', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                    Period: {formatDate(ren.startDate)} – {formatDate(ren.expiryDate)} ({ren.durationDays} days)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#2F7D4A' }}>Paid: ₹{Number(ren.amountPaid || 0).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.75rem', color: '#7A8288' }}>
                    Receipt: {ren.receiptNumber || '—'} | By: {ren.renewedBy || 'Staff'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. PAYMENT HISTORY SECTION ───────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #252A2E',
          boxShadow: '4px 4px 0px #252A2E',
          padding: '1.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #252A2E',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Receipt size={24} color="#252A2E" />
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.85rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: 0,
                lineHeight: 1,
              }}
            >
              PAYMENT HISTORY
            </h2>
            <span
              style={{
                backgroundColor: '#252A2E',
                color: '#F4C400',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                fontFamily: 'monospace',
              }}
            >
              {payments.length} {payments.length === 1 ? 'RECORD' : 'RECORDS'}
            </span>
          </div>

          {hasDue && (
            <button
              type="button"
              onClick={handleOpenPayment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                border: '2px solid #252A2E',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #252A2E',
              }}
            >
              <Plus size={16} />
              <span>RECORD PAYMENT</span>
            </button>
          )}
        </div>

        {/* Content States */}
        {isPaymentsLoading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#4B555D' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Loading payment history...</div>
          </div>
        ) : paymentsError ? (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#FDF2F2',
              border: '1.5px solid #A83D3D',
              color: '#A83D3D',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            {paymentsError}
          </div>
        ) : payments.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              backgroundColor: '#FAF8F4',
              border: '1.5px dashed #252A2E',
            }}
          >
            <Receipt size={36} color="#7A8288" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.35rem', color: '#252A2E', margin: '0 0 0.35rem 0' }}>
              NO PAYMENT RECORDS FOUND
            </h4>
            <p style={{ color: '#4B555D', fontSize: '0.88rem', margin: '0 0 1rem 0' }}>
              No payments have been recorded for this member yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {payments.map((p) => {
              const pDate = formatDate(p.paymentDate || p.createdAt);
              const isFullyPaid = Number(p.remainingDueAmount || 0) === 0;
              return (
                <div
                  key={p.id || p.docId || p.receiptNumber}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1.5px solid #252A2E',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  {/* Left: Receipt # & Date */}
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          backgroundColor: '#252A2E',
                          color: '#F4C400',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          padding: '0.25rem 0.6rem',
                        }}
                      >
                        {p.receiptNumber || 'RECEIPT'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#4B555D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      <span>{pDate}</span>
                    </div>
                  </div>

                  {/* Middle: Amount & Mode */}
                  <div style={{ minWidth: '140px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#4B555D', fontWeight: 600, textTransform: 'uppercase' }}>
                      Amount Paid
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#2F7D4A', lineHeight: 1.1 }}>
                      ₹{Number(p.amountPaid || 0).toLocaleString('en-IN')}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '0.25rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #252A2E',
                        color: '#252A2E',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {p.paymentMode || 'Cash'}
                    </span>
                  </div>

                  {/* Right: Previous Due & Remaining Due */}
                  <div style={{ minWidth: '160px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#4B555D', marginBottom: '0.2rem' }}>
                      Prev Due: <strong style={{ color: '#252A2E' }}>₹{Number(p.previousDueAmount || 0).toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      Remaining Due:{' '}
                      <strong style={{ color: isFullyPaid ? '#2F7D4A' : '#A83D3D' }}>
                        ₹{Number(p.remainingDueAmount || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Receipt Action Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptPayment(p)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#252A2E',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.55rem 0.9rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Printer size={14} />
                      <span>RECEIPT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── EDIT MEMBER MODAL ──────────────────────────────────────── */}
      {showEditModal && editForm && (
        <div
          onClick={() => setShowEditModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '520px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                EDIT MEMBER DETAILS
              </h3>
              <button type="button" onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Address
                </label>
                <textarea
                  rows="3"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', border: '2px solid #252A2E', background: '#F4C400', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RENEW MEMBERSHIP MODAL ─────────────────────────────────── */}
      {showRenewModal && (
        <div
          onClick={() => setShowRenewModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '520px',
              padding: '2rem',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                  RENEW MEMBERSHIP
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>{member.name} ({member.id})</div>
              </div>
              <button type="button" onClick={() => setShowRenewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveRenew} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {renewError && (
                <div style={{ backgroundColor: '#FDF2F2', border: '1.5px solid #A83D3D', color: '#A83D3D', padding: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
                  {renewError}
                </div>
              )}

              {/* Plan Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Select Membership Plan *
                </label>
                <select
                  value={renewPlanId}
                  onChange={(e) => {
                    const pId = e.target.value;
                    setRenewPlanId(pId);
                    const chosen = plans.find((p) => p.id === pId);
                    if (chosen) {
                      setRenewAmountCollected(String(chosen.price || 0));
                    }
                  }}
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #252A2E', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  {plans.filter((p) => p.status === 'Active').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price} ({p.durationDays} days)
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date & Calculated Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={renewStartDate}
                    onChange={(e) => setRenewStartDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    New Expiry Date
                  </label>
                  <div style={{ padding: '0.65rem', backgroundColor: '#F0ECE1', border: '1.5px solid #252A2E', fontWeight: 800 }}>
                    {formatDate(calculatedRenewExpiry)}
                  </div>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div style={{ backgroundColor: '#FAF8F4', border: '1.5px solid #252A2E', padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span>Plan Fee:</span>
                  <strong>₹{renewPriceNum}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    min="0"
                    max={renewPriceNum}
                    value={renewDiscount}
                    onChange={(e) => setRenewDiscount(e.target.value)}
                    style={{ width: '90px', padding: '0.3rem', border: '1px solid #252A2E', textAlign: 'right', fontWeight: 700 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #252A2E', paddingTop: '0.35rem', fontWeight: 800 }}>
                  <span>Net Payable for Renewal:</span>
                  <span style={{ color: '#2F7D4A', fontSize: '1.05rem' }}>₹{renewNetPayable}</span>
                </div>
              </div>

              {/* Payment Recording */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Amount Collected (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={renewAmountCollected}
                    onChange={(e) => setRenewAmountCollected(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 800, fontSize: '1.05rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Payment Mode
                  </label>
                  <select
                    value={renewPaymentMode}
                    onChange={(e) => setRenewPaymentMode(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 700 }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI / Online">UPI / Online</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Notes / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={renewNotes}
                  onChange={(e) => setRenewNotes(e.target.value)}
                  placeholder="e.g. GPay ref / Cash received at desk"
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  disabled={isSubmittingRenew}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRenew}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #252A2E',
                    background: '#F4C400',
                    fontWeight: 800,
                    cursor: isSubmittingRenew ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0px #252A2E',
                  }}
                >
                  {isSubmittingRenew ? 'Processing Renewal...' : 'Confirm & Renew'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FREEZE MEMBERSHIP MODAL ─────────────────────────────────── */}
      {showFreezeModal && (
        <div
          onClick={() => setShowFreezeModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0, color: '#1D6F8A' }}>
                FREEZE MEMBERSHIP
              </h3>
              <button type="button" onClick={() => setShowFreezeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveFreeze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {freezeError && (
                <div style={{ backgroundColor: '#FDF2F2', border: '1.5px solid #A83D3D', color: '#A83D3D', padding: '0.75rem', fontSize: '0.85rem' }}>
                  {freezeError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Freeze Start Date *
                </label>
                <input
                  type="date"
                  value={freezeStartDate}
                  onChange={(e) => setFreezeStartDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Expected End Date (Optional)
                </label>
                <input
                  type="date"
                  value={freezeExpectedEndDate}
                  onChange={(e) => setFreezeExpectedEndDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Reason for Freeze *
                </label>
                <textarea
                  rows="3"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  placeholder="e.g. Travel, exam period, minor injury"
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#4B555D', backgroundColor: '#E1F3F8', padding: '0.75rem' }}>
                Note: When resumed, the membership expiry date will automatically be extended by the exact number of days frozen.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowFreezeModal(false)}
                  disabled={isSubmittingFreeze}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFreeze}
                  style={{ padding: '0.75rem 1.5rem', border: '2px solid #252A2E', background: '#1D6F8A', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmittingFreeze ? 'Freezing...' : 'Confirm Freeze'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESUME MEMBERSHIP MODAL ─────────────────────────────────── */}
      {showResumeModal && (
        <div
          onClick={() => setShowResumeModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0, color: '#2F7D4A' }}>
                RESUME MEMBERSHIP
              </h3>
              <button type="button" onClick={() => setShowResumeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveResume} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Resume Date *
                </label>
                <input
                  type="date"
                  value={resumeDate}
                  onChange={(e) => setResumeDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box', fontWeight: 600 }}
                />
              </div>

              {member.freezeInfo?.startDate && (
                <div style={{ backgroundColor: '#F2F9F4', border: '1px solid #2F7D4A', padding: '0.85rem', fontSize: '0.85rem' }}>
                  <div>Frozen Start Date: <strong>{formatDate(member.freezeInfo.startDate)}</strong></div>
                  <div>Current Expiry Date: <strong>{formatDate(member.expiryDate)}</strong></div>
                  <div style={{ marginTop: '0.35rem', color: '#2F7D4A', fontWeight: 700 }}>
                    Extension: Expiry date will be extended by the actual duration frozen.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  disabled={isSubmittingResume}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResume}
                  style={{ padding: '0.75rem 1.5rem', border: '2px solid #252A2E', background: '#2F7D4A', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmittingResume ? 'Resuming...' : 'Confirm Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ARCHIVE MODAL ──────────────────────────────────────────── */}
      {showArchiveModal && (
        <div
          onClick={() => setShowArchiveModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0, color: '#A83D3D' }}>
                ARCHIVE MEMBER
              </h3>
              <button type="button" onClick={() => setShowArchiveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleArchive} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#4B555D', lineHeight: 1.5 }}>
                Archiving removes <strong>{member.name}</strong> from active lists while preserving all payments, receipts, and audit history intact.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Reason for Archival (Optional)
                </label>
                <textarea
                  rows="3"
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="e.g. Relocated to another city / Discontinued membership"
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowArchiveModal(false)}
                  disabled={isSubmittingArchive}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingArchive}
                  style={{ padding: '0.75rem 1.5rem', border: '2px solid #252A2E', background: '#A83D3D', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmittingArchive ? 'Archiving...' : 'Confirm Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECORD PAYMENT MODAL ───────────────────────────────────── */}
      {showPaymentModal && (
        <div
          onClick={() => setShowPaymentModal(false)}
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
              border: '2px solid #252A2E',
              boxShadow: '6px 6px 0px #252A2E',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                  RECORD PAYMENT
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>{member.name} ({member.id})</div>
              </div>
              <button type="button" onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {paymentModalError && (
                <div
                  style={{
                    backgroundColor: '#FDF2F2',
                    border: '1.5px solid #A83D3D',
                    color: '#A83D3D',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{paymentModalError}</span>
                </div>
              )}

              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1.5px solid #252A2E',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Current Outstanding Due:</span>
                <strong style={{ fontSize: '1.15rem', color: currentDue > 0 ? '#A83D3D' : '#2F7D4A' }}>
                  ₹{currentDue}
                </strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Payment Amount Collected (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #252A2E',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #252A2E', fontWeight: 700 }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / Online">UPI / Online</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    border: '1.5px solid #252A2E',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid in cash at reception / GPay txn ref"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    border: '1.5px solid #252A2E',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isSubmittingPayment}
                  style={{
                    padding: '0.65rem 1.25rem',
                    border: '1.5px solid #252A2E',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: isSubmittingPayment ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #252A2E',
                    background: '#F4C400',
                    fontWeight: 800,
                    cursor: isSubmittingPayment ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0px #252A2E',
                  }}
                >
                  {isSubmittingPayment ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINTABLE RECEIPT MODAL ─────────────────────────────────── */}
      {selectedReceiptPayment && (
        <ReceiptModal
          payment={selectedReceiptPayment}
          member={member}
          onClose={() => setSelectedReceiptPayment(null)}
        />
      )}
    </div>
  );
}
