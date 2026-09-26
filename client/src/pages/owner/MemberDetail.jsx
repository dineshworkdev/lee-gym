import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  DollarSign,
  Phone,
  User,
  Calendar,
  MapPin,
  Scale,
  Ruler,
  Clock,
  ShieldAlert,
  CheckCircle,
  CreditCard,
  X,
  Check,
} from 'lucide-react';
import { useOwnerGym, formatDate, addDaysToDate } from '../../context/OwnerGymContext.jsx';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, memberEvaluator, updateMember, recordPayment, plans } = useOwnerGym();

  const member = members.find((m) => m.id === id);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState(null);

  // Record payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

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

  const { isDue, isExpired, isActive, isExpiringToday, diff } = memberEvaluator(member);

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
    setPaymentAmount(member.amountDue > 0 ? String(member.amountDue) : '500');
    setPaymentMode('Cash');
    setShowPaymentModal(true);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    const res = recordPayment(member.id, paymentAmount, paymentMode);
    if (res.success) {
      setShowPaymentModal(false);
      showNotice(`Payment of ₹${paymentAmount} recorded successfully.`);
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
          </div>
        </div>
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
                  Payment Amount Collected (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
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
                  Payment Mode
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Cash', 'Online'].map((mode) => (
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #252A2E',
                    background: '#F4C400',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #252A2E',
                  }}
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
