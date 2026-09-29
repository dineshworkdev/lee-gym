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
} from 'lucide-react';
import { useOwnerGym, formatDate, CURRENT_DATE_STR } from '../../context/OwnerGymContext.jsx';

export default function MemberDetail() {
  const { id } = useParams();
  const { members, memberEvaluator, updateMember, recordPayment, getMemberPayments } = useOwnerGym();

  const member = members.find((m) => m.id === id || m.docId === id || m.memberId === id);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  // Load payments on mount or when member changes (Always call hooks at top level)
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

  const { isDue, isActive, isExpiringToday, diff } = memberEvaluator(member);
  const currentDue = Number(member?.dueAmount !== undefined ? member.dueAmount : (member?.amountDue || 0));
  const hasDue = currentDue > 0;

  const handleOpenEdit = () => {
    setEditForm({
      name: member.name,
      mobile: member.mobile,
      gender: member.gender || 'Male',
      dobOrAge: member.dobOrAge || '',
      height: member.height || '',
      weight: member.weight || '',
      address: member.address || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateMember(member.id, editForm);
    setShowEditModal(false);
    showNotice('Member details updated successfully.');
  };

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

    if (!hasDue || currentDue <= 0) {
      setPaymentModalError('This member has no outstanding due amount (Due: ₹0).');
      return;
    }

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
          // Prepend newest payment to history list immediately
          setPayments((prev) => [res.payment, ...prev]);
        }
        setShowPaymentModal(false);
        showNotice(
          `Payment of ₹${amt} recorded successfully. (Receipt: ${
            res.payment?.receiptNumber || 'Created'
          })`
        );
      } else {
        setPaymentModalError(res.message || 'Payment recording failed.');
      }
    } catch (err) {
      console.error('Payment submit error:', err);
      setPaymentModalError(err.message || 'Failed to record payment. Please try again.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const showNotice = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* ── TOP BACK NAVIGATION & NOTIFICATION ──────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
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
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Check size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

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
          {/* Large Photo / Avatar */}
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
            }}
          >
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              member.name.charAt(0)
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

        {/* Action Buttons: [ EDIT MEMBER ] and [ RECORD PAYMENT ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
              padding: '0.7rem 1.25rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '3px 3px 0px #252A2E',
              cursor: 'pointer',
            }}
          >
            <Edit size={16} />
            <span>EDIT MEMBER</span>
          </button>

          {hasDue && (
            <button
              id="member-record-payment-btn"
              type="button"
              onClick={handleOpenPayment}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                border: '2px solid #252A2E',
                padding: '0.7rem 1.25rem',
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '3px 3px 0px #252A2E',
                cursor: 'pointer',
              }}
            >
              <DollarSign size={16} />
              <span>RECORD PAYMENT</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3 COMPREHENSIVE SECTIONS: PERSONAL, MEMBERSHIP, PAYMENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
            <span>MEMBERSHIP</span>
            {isActive ? (
              <span style={{ backgroundColor: '#2F7D4A', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                ACTIVE
              </span>
            ) : (
              <span style={{ backgroundColor: '#4B555D', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                EXPIRED
              </span>
            )}
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
              <span style={{ color: '#4B555D' }}>Status Timeline:</span>
              <div>
                {isExpiringToday && (
                  <span style={{ backgroundColor: '#F4C400', color: '#252A2E', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    EXPIRES TODAY
                  </span>
                )}
                {diff > 0 && !isExpiringToday && (
                  <span style={{ color: '#2F7D4A', fontWeight: 700 }}>
                    {diff} day{diff !== 1 ? 's' : ''} remaining
                  </span>
                )}
                {diff < 0 && (
                  <span style={{ color: '#A83D3D', fontWeight: 700 }}>
                    Expired {Math.abs(diff)} day{Math.abs(diff) !== 1 ? 's' : ''} ago
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>WhatsApp Invoice:</span>
              <strong style={{ color: '#252A2E' }}>{member.sendInvoice ? 'Requested' : 'Not Requested'}</strong>
            </div>
          </div>
        </div>

        {/* 3. PAYMENT */}
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
            <span>PAYMENT</span>
            {isDue ? (
              <span style={{ backgroundColor: '#A83D3D', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                DUE
              </span>
            ) : (
              <span style={{ backgroundColor: '#2F7D4A', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
                PAID
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
              <span style={{ fontWeight: 700, color: '#252A2E' }}>Amount Payable:</span>
              <strong style={{ color: '#252A2E', fontSize: '1.05rem' }}>₹{member.amountPayable || 0}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B555D' }}>Amount Collected:</span>
              <span style={{ fontWeight: 700, color: '#2F7D4A' }}>₹{member.amountCollected || 0}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: isDue ? '#FDF2F2' : '#F2F9F4',
                border: isDue ? '1px solid #A83D3D' : '1px solid #2F7D4A',
              }}
            >
              <span style={{ fontWeight: 800, color: isDue ? '#A83D3D' : '#2F7D4A' }}>Due Amount:</span>
              <strong style={{ fontSize: '1.15rem', color: isDue ? '#A83D3D' : '#2F7D4A' }}>
                ₹{member.amountDue || 0}
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
              <span style={{ color: '#4B555D' }}>Payment Mode:</span>
              <span
                style={{
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.6rem',
                  textTransform: 'uppercase',
                }}
              >
                {member.paymentMode || 'Cash'}
              </span>
            </div>

            {hasDue && (
              <button
                type="button"
                onClick={handleOpenPayment}
                style={{
                  marginTop: '0.6rem',
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: '#F4C400',
                  color: '#252A2E',
                  border: '2px solid #252A2E',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '2px 2px 0px #252A2E',
                }}
              >
                <DollarSign size={16} />
                <span>RECORD PAYMENT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. PAYMENT HISTORY SECTION ───────────────────────────────── */}
      <div
        style={{
          marginTop: '2rem',
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
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
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
            <h4
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.35rem',
                color: '#252A2E',
                margin: '0 0 0.35rem 0',
              }}
            >
              NO PAYMENT RECORDS FOUND
            </h4>
            <p style={{ color: '#4B555D', fontSize: '0.88rem', margin: '0 0 1rem 0' }}>
              No payments have been recorded for this member yet.
            </p>
            {hasDue && (
              <button
                type="button"
                onClick={handleOpenPayment}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  border: '2px solid #252A2E',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                <DollarSign size={15} />
                <span>Record First Payment</span>
              </button>
            )}
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
                  <div style={{ minWidth: '180px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#4B555D', marginBottom: '0.2rem' }}>
                      Previous Due: <strong style={{ color: '#252A2E' }}>₹{Number(p.previousDueAmount || 0).toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      Remaining Due:{' '}
                      <strong style={{ color: isFullyPaid ? '#2F7D4A' : '#A83D3D' }}>
                        ₹{Number(p.remainingDueAmount || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    {p.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#7A8288', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        Note: {p.notes}
                      </div>
                    )}
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
                  Full Name
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
                  Mobile Number
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
              {/* Error banner in modal */}
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

              {/* Outstanding Due Highlight */}
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
                <strong style={{ fontSize: '1.15rem', color: member.amountDue > 0 ? '#A83D3D' : '#2F7D4A' }}>
                  ₹{member.amountDue}
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
                  placeholder="Enter amount (e.g. 1500)"
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
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['Cash', 'UPI / Online'].map((mode) => (
                    <label
                      key={mode}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        border: '1.5px solid #252A2E',
                        backgroundColor: paymentMode === mode ? '#252A2E' : '#FFFFFF',
                        color: paymentMode === mode ? '#FFFFFF' : '#252A2E',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value={mode}
                        checked={paymentMode === mode}
                        onChange={() => setPaymentMode(mode)}
                        style={{ display: 'none' }}
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
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
                    opacity: isSubmittingPayment ? 0.6 : 1,
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
                    opacity: isSubmittingPayment ? 0.7 : 1,
                  }}
                >
                  {isSubmittingPayment ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
