import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Power,
  CreditCard,
  Calendar,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useOwnerGym } from '../../context/OwnerGymContext.jsx';

export default function Plans() {
  const { plans, addPlan, updatePlan, togglePlanStatus } = useOwnerGym();

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', durationDays: '30' });
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const openAddModal = () => {
    setPlanForm({ name: '', price: '', durationDays: '30' });
    setFormError('');
    setModalMode('add');
  };

  const openEditModal = (plan) => {
    setSelectedPlanId(plan.id);
    setPlanForm({ name: plan.name, price: String(plan.price), durationDays: String(plan.durationDays) });
    setFormError('');
    setModalMode('edit');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      setFormError('Plan name is required');
      return;
    }
    if (!planForm.price || isNaN(planForm.price) || Number(planForm.price) <= 0) {
      setFormError('Please enter a valid price');
      return;
    }
    if (!planForm.durationDays || isNaN(planForm.durationDays) || Number(planForm.durationDays) <= 0) {
      setFormError('Please enter a valid duration in days');
      return;
    }

    if (modalMode === 'add') {
      addPlan({
        name: planForm.name,
        price: planForm.price,
        durationDays: planForm.durationDays,
      });
      triggerNotice('New plan created successfully.');
    } else if (modalMode === 'edit') {
      updatePlan(selectedPlanId, {
        name: planForm.name,
        price: planForm.price,
        durationDays: planForm.durationDays,
      });
      triggerNotice('Plan details updated successfully.');
    }

    setModalMode(null);
  };

  const handleToggle = (plan) => {
    togglePlanStatus(plan.id);
    triggerNotice(`Plan "${plan.name}" marked as ${plan.status === 'Active' ? 'Inactive' : 'Active'}.`);
  };

  const triggerNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
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
            MEMBERSHIP PLANS
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.9rem', color: '#4B555D', margin: '0.4rem 0 0' }}>
            Manage pricing tiers, subscription durations, and activation status
          </p>
        </div>

        {/* + ADD NEW PLAN Button */}
        <button
          id="plans-add-plan-btn"
          type="button"
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#F4C400',
            color: '#252A2E',
            border: '2px solid #252A2E',
            padding: '0.75rem 1.4rem',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            boxShadow: '3px 3px 0px #252A2E',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          <span>+ ADD NEW PLAN</span>
        </button>
      </div>

      {/* Notice notification */}
      {notice && (
        <div
          style={{
            backgroundColor: '#2F7D4A',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.5rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={18} />
          <span>{notice}</span>
        </div>
      )}

      {/* ── PLANS GRID / LIST ───────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {plans.map((plan) => {
          const isActive = plan.status === 'Active';
          return (
            <div
              key={plan.id}
              id={`plan-item-${plan.id}`}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #252A2E',
                boxShadow: '4px 4px 0px #252A2E',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isActive ? 1 : 0.65,
                transition: 'all 120ms ease',
              }}
            >
              <div>
                {/* Header: Name and Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                      fontSize: '2rem',
                      letterSpacing: '0.04em',
                      color: '#252A2E',
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {plan.name}
                  </h2>

                  <span
                    style={{
                      backgroundColor: isActive ? '#2F7D4A' : '#4B555D',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                    }}
                  >
                    {plan.status}
                  </span>
                </div>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                      fontSize: '3.2rem',
                      lineHeight: 0.9,
                      color: '#252A2E',
                    }}
                  >
                    ₹{plan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#4B555D', fontWeight: 600 }}>/ fee</span>
                </div>

                {/* Duration */}
                <div
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid rgba(37,42,46,0.15)',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.85rem',
                    color: '#252A2E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Calendar size={16} color="#4B555D" />
                  <span>
                    Duration: <strong>{plan.durationDays} Days</strong>
                  </span>
                </div>
              </div>

              {/* Actions: Edit & Deactivate/Reactivate */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  borderTop: '1px dashed rgba(37, 42, 46, 0.15)',
                  paddingTop: '1.25rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#FFFFFF',
                    color: '#252A2E',
                    border: '1.5px solid #252A2E',
                    padding: '0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(plan)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: isActive ? '#FAF8F4' : '#252A2E',
                    color: isActive ? '#A83D3D' : '#FFFFFF',
                    border: isActive ? '1.5px solid #A83D3D' : '1.5px solid #252A2E',
                    padding: '0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <Power size={14} />
                  <span>{isActive ? 'Deactivate' : 'Reactivate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD / EDIT PLAN MODAL ───────────────────────────────────── */}
      {modalMode && (
        <div
          onClick={() => setModalMode(null)}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #252A2E',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                {modalMode === 'add' ? 'ADD NEW PLAN' : 'EDIT MEMBERSHIP PLAN'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  backgroundColor: '#FDF2F2',
                  color: '#A83D3D',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Plan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly, Quarterly Pro"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 800"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Duration (Days)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={planForm.durationDays}
                  onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.7rem 1.5rem',
                    border: '2px solid #252A2E',
                    background: '#F4C400',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #252A2E',
                  }}
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
