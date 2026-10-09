import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useOwnerGym } from '../../context/OwnerGymContext.jsx';
import { GYM_INFO } from '../../data/gymData.js';

export default function Settings() {
  const {
    isOwner,
    userRole,
    staffList,
    isStaffLoading,
    saveStaff,
    updateStaff,
    deleteStaff,
  } = useOwnerGym();

  // New staff modal state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState('Receptionist');
  const [staffNotes, setStaffNotes] = useState('');
  const [staffError, setStaffError] = useState('');
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const triggerNotice = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(''), 3500);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffEmail.trim() || !staffName.trim()) {
      setStaffError('Please enter both name and email.');
      return;
    }

    setIsSubmittingStaff(true);
    setStaffError('');
    try {
      await saveStaff({
        email: staffEmail,
        name: staffName,
        phone: staffPhone,
        role: staffRole,
        status: 'Active',
        notes: staffNotes,
      });
      setShowAddStaffModal(false);
      setStaffEmail('');
      setStaffName('');
      setStaffPhone('');
      setStaffNotes('');
      triggerNotice(`Staff account provisioned for ${staffName} (${staffRole}).`);
    } catch (err) {
      setStaffError(err.message || 'Error provisioning staff account.');
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const handleToggleStaffStatus = async (staffMember) => {
    const nextStatus = staffMember.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateStaff(staffMember.id, { status: nextStatus });
      triggerNotice(`Staff member ${staffMember.name} marked as ${nextStatus}.`);
    } catch (err) {
      alert(err.message || 'Error updating staff status.');
    }
  };

  const handleDeleteStaff = async (staffMember) => {
    if (!window.confirm(`Permanently remove staff member ${staffMember.name}?`)) return;
    try {
      await deleteStaff(staffMember.id);
      triggerNotice(`Staff member ${staffMember.name} removed.`);
    } catch (err) {
      alert(err.message || 'Error deleting staff member.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            GYM SETTINGS &amp; STAFF
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.85rem', color: 'var(--color-slate, #4B555D)', margin: '0.3rem 0 0' }}>
            System configuration, staff account provisioning, and access permissions
          </p>
        </div>

        {feedbackNotice && (
          <div style={{ backgroundColor: 'rgba(47, 125, 74, 0.1)', color: '#2F7D4A', border: '1px solid rgba(47, 125, 74, 0.25)', borderRadius: '6px', padding: '0.5rem 0.85rem', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={16} />
            <span>{feedbackNotice}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* ── GYM BUSINESS PROFILE ───────────────────────────────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <Building size={18} color="var(--color-charcoal, #252A2E)" />
            <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--color-charcoal, #252A2E)' }}>
              VERIFIED GYM INFORMATION
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)', fontWeight: 600, textTransform: 'uppercase' }}>Gym Name</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#252A2E' }}>{GYM_INFO.name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)', fontWeight: 600, textTransform: 'uppercase' }}>Address</div>
              <div style={{ color: '#252A2E', lineHeight: 1.4 }}>{GYM_INFO.address}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)', fontWeight: 600, textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontWeight: 600 }}>{GYM_INFO.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontWeight: 500, color: 'var(--color-slate, #4B555D)' }}>{GYM_INFO.email}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-slate, #4B555D)', fontWeight: 600, textTransform: 'uppercase' }}>Operating Hours</div>
              <div style={{ color: '#252A2E', marginTop: '0.2rem' }}>
                Mon – Sat: <strong>05:30 AM – 11:00 AM</strong> &amp; <strong>04:30 PM – 10:00 PM</strong>
                <br />
                Sunday: <strong style={{ color: '#A83D3D' }}>Closed</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROLE & PERMISSION MATRIX ───────────────────────────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <Shield size={18} color="var(--color-charcoal, #252A2E)" />
            <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--color-charcoal, #252A2E)' }}>
              ROLE-BASED ACCESS CONTROL (RBAC)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ borderLeft: '3px solid #F4C400', paddingLeft: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Owner (Super Admin)</div>
              <div style={{ color: '#4B555D' }}>
                Full access: Member creation/edits, deletions, plan pricing, financial records, receipts, and staff provisioning.
              </div>
            </div>

            <div style={{ borderLeft: '3px solid #2F7D4A', paddingLeft: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Receptionist</div>
              <div style={{ color: '#4B555D' }}>
                Front desk operations: Member registration, renewals, recording cash/UPI collections, receipts, and search. Cannot delete members or change gym plans.
              </div>
            </div>

            <div style={{ borderLeft: '3px solid #1D6F8A', paddingLeft: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Trainer</div>
              <div style={{ color: '#4B555D' }}>
                Training floor: View members and physical stats (height, weight, assigned plan). Financial dues and payment recording hidden.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAFF MANAGEMENT SECTION (OWNER ONLY) ────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(37, 42, 46, 0.08)',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(37, 42, 46, 0.04)',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={22} color="#252A2E" />
            <h2 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.85rem', margin: 0 }}>
              AUTHORIZED STAFF ACCOUNTS
            </h2>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={() => setShowAddStaffModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                border: '1px solid #D4A900',
                borderRadius: '6px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Provision Staff</span>
            </button>
          )}
        </div>

        {isStaffLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#4B555D' }}>Loading staff records...</div>
        ) : staffList.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FAF8F4', border: '1.5px dashed #252A2E' }}>
            <UserCheck size={36} color="#7A8288" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.4rem', color: '#252A2E', margin: 0 }}>
              NO ADDITIONAL STAFF PROVISIONED
            </h4>
            <p style={{ color: '#4B555D', fontSize: '0.88rem', margin: '0.35rem 0 1rem 0' }}>
              Only the primary owner is currently configured. Click &quot;+ Provision Staff&quot; to assign receptionist or trainer accounts.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#252A2E', color: '#FFFFFF' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  {isOwner && (
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {staffList.map((s, idx) => {
                  const isActive = s.status === 'Active';
                  return (
                    <tr
                      key={s.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(37,42,46,0.08)',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{s.email}</td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace' }}>{s.phone || '—'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: s.role === 'Owner' ? '#F4C400' : s.role === 'Receptionist' ? '#EAF6EE' : '#E1F3F8',
                            color: '#252A2E',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.55rem',
                            border: '1px solid #252A2E',
                            textTransform: 'uppercase',
                          }}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            color: isActive ? '#2F7D4A' : '#A83D3D',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      {isOwner && (
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStaffStatus(s)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                border: '1px solid #252A2E',
                                backgroundColor: '#FFFFFF',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(s)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                border: '1px solid #A83D3D',
                                backgroundColor: '#FFF5F5',
                                color: '#A83D3D',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PROVISION STAFF MODAL ────────────────────────────────────── */}
      {showAddStaffModal && (
        <div
          onClick={() => setShowAddStaffModal(false)}
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
              maxWidth: '480px',
              padding: '2rem',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: '0 0 1rem 0' }}>
              PROVISION STAFF ACCOUNT
            </h3>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {staffError && (
                <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #A83D3D', borderRadius: '6px', color: '#A83D3D', padding: '0.75rem', fontSize: '0.85rem' }}>
                  {staffError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Staff Email *
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. receptionist@leegym.com"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Assigned Role *
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="Receptionist">Receptionist (Front desk, registrations & collections)</option>
                  <option value="Trainer">Trainer (Training floor, physical details only)</option>
                  <option value="Owner">Owner (Super Admin)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="e.g. Morning shift receptionist"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  disabled={isSubmittingStaff}
                  style={{ padding: '0.65rem 1.25rem', border: '1px solid rgba(37, 42, 46, 0.2)', background: '#FFFFFF', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  style={{ padding: '0.65rem 1.5rem', border: '1px solid #D4A900', background: '#F4C400', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  {isSubmittingStaff ? 'Provisioning...' : 'Provision Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
