import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Power,
  Calendar,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useOwnerGym } from '../../context/OwnerGymContext.jsx';

export default function Plans() {
  const { plans, isPlansLoading, plansError, addPlan, updatePlan, togglePlanStatus } = useOwnerGym();

  const [modalMode, setModalMode] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', durationDays: '30' });
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(null);

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) { setFormError('Plan name is required'); return; }
    if (!planForm.price || isNaN(planForm.price) || Number(planForm.price) <= 0) { setFormError('Please enter a valid price'); return; }
    if (!planForm.durationDays || isNaN(planForm.durationDays) || Number(planForm.durationDays) <= 0) { setFormError('Please enter a valid duration in days'); return; }

    setIsSaving(true);
    setFormError('');
    try {
      if (modalMode === 'add') {
        await addPlan({ name: planForm.name, price: planForm.price, durationDays: planForm.durationDays });
        triggerNotice('New plan created successfully.', 'success');
      } else if (modalMode === 'edit') {
        await updatePlan(selectedPlanId, { name: planForm.name, price: planForm.price, durationDays: planForm.durationDays });
        triggerNotice('Plan details updated successfully.', 'success');
      }
      setModalMode(null);
    } catch (err) {
      console.error('Plan save error:', err);
      setFormError(err.message || 'Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (plan) => {
    setIsToggling(plan.id);
    try {
      await togglePlanStatus(plan.id);
      triggerNotice(`Plan "${plan.name}" marked as ${plan.status === 'Active' ? 'Inactive' : 'Active'}.`, 'success');
    } catch (err) {
      console.error('Toggle plan error:', err);
      triggerNotice(err.message || 'Failed to update plan status. Please try again.', 'error');
    } finally {
      setIsToggling(null);
    }
  };

  const triggerNotice = (msg, type = 'success') => {
    setNotice(msg);
    setNoticeType(type);
    setTimeout(() => setNotice(''), 3500);
  };

  if (isPlansLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid rgba(37, 42, 46, 0.1)' }}>
          <h1 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', letterSpacing: '0.04em', color: '#252A2E', margin: 0, lineHeight: 1 }}>
            MEMBERSHIP PLANS
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.9rem', color: '#4B555D', margin: '0.4rem 0 0' }}>
            Loading plans from Firestore...
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ backgroundColor: '#F5F5F5', border: '2px solid rgba(37, 42, 46, 0.12)', height: '220px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', letterSpacing: '0.04em', color: '#252A2E', margin: '0 0 1.5rem' }}>
          MEMBERSHIP PLANS
        </h1>
        <div style={{ backgroundColor: '#FDF2F2', border: '2px solid #A83D3D', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} color="#A83D3D" />
          <div>
            <div style={{ fontWeight: 800, color: '#A83D3D', fontSize: '0.9rem' }}>Failed to load plans</div>
            <div style={{ color: '#4B555D', fontSize: '0.85rem', marginTop: '0.2rem' }}>{plansError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(37, 42, 46, 0.08)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', letterSpacing: '0.04em', color: 'var(--color-charcoal, #252A2E)', margin: 0, lineHeight: 1 }}>
            MEMBERSHIP PLANS
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.85rem', color: 'var(--color-slate, #4B555D)', margin: '0.3rem 0 0' }}>
            Manage pricing tiers, subscription durations, and activation status
          </p>
        </div>
        <button
          id="plans-add-plan-btn"
          type="button"
          onClick={openAddModal}
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
            cursor: 'pointer',
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
          <Plus size={16} />
          <span>Add New Plan</span>
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div style={{ backgroundColor: noticeType === 'error' ? 'rgba(168, 61, 61, 0.1)' : 'rgba(47, 125, 74, 0.1)', color: noticeType === 'error' ? '#A83D3D' : '#2F7D4A', border: noticeType === 'error' ? '1px solid rgba(168, 61, 61, 0.25)' : '1px solid rgba(47, 125, 74, 0.25)', padding: '0.75rem 1.25rem', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {noticeType === 'error' ? <AlertCircle size={17} /> : <Check size={17} />}
          <span>{notice}</span>
        </div>
      )}

      {/* PLANS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {plans.map((plan) => {
          const isActive = plan.status === 'Active';
          const toggling = isToggling === plan.id;
          return (
            <div
              key={plan.id}
              id={`plan-item-${plan.id}`}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(37, 42, 46, 0.08)',
                borderRadius: '8px',
                borderTop: isActive ? '4px solid var(--color-yellow, #F4C400)' : '4px solid rgba(37, 42, 46, 0.2)',
                boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isActive ? 1 : 0.7,
                transition: 'all 150ms ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.75rem', letterSpacing: '0.04em', color: 'var(--color-charcoal, #252A2E)', margin: 0, lineHeight: 1 }}>
                    {plan.name}
                  </h2>
                  <span style={{ backgroundColor: isActive ? 'rgba(47, 125, 74, 0.1)' : 'rgba(75, 85, 93, 0.1)', color: isActive ? '#2F7D4A' : '#4B555D', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    {plan.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2.6rem', lineHeight: 0.95, color: 'var(--color-charcoal, #252A2E)' }}>
                    ₹{plan.price}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-slate, #4B555D)', fontWeight: 500 }}>/ fee</span>
                </div>
                <div style={{ backgroundColor: '#FAF8F4', borderRadius: '6px', border: '1px solid rgba(37,42,46,0.06)', padding: '0.55rem 0.75rem', fontSize: '0.82rem', color: '#252A2E', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.25rem' }}>
                  <Calendar size={15} color="var(--color-slate, #4B555D)" />
                  <span>Duration: <strong>{plan.durationDays} Days</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', borderTop: '1px solid rgba(37, 42, 46, 0.06)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FFFFFF',
                    color: '#252A2E',
                    border: '1px solid rgba(37, 42, 46, 0.15)',
                    borderRadius: '6px',
                    padding: '0.55rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF8F4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(plan)}
                  disabled={toggling}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    backgroundColor: isActive ? 'rgba(168, 61, 61, 0.08)' : '#252A2E',
                    color: isActive ? '#A83D3D' : '#FFFFFF',
                    border: isActive ? '1px solid rgba(168, 61, 61, 0.25)' : '1px solid #252A2E',
                    borderRadius: '6px',
                    padding: '0.55rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: toggling ? 'not-allowed' : 'pointer',
                    opacity: toggling ? 0.7 : 1,
                    transition: 'all 120ms ease',
                  }}
                >
                  <Power size={14} />
                  <span>{toggling ? '...' : isActive ? 'Deactivate' : 'Reactivate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalMode && (
        <div onClick={() => setModalMode(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(37, 42, 46, 0.1)', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.6rem', margin: 0, color: 'var(--color-charcoal, #252A2E)' }}>
                {modalMode === 'add' ? 'ADD NEW PLAN' : 'EDIT MEMBERSHIP PLAN'}
              </h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            {formError && (
              <div style={{ backgroundColor: '#FDF2F2', color: '#A83D3D', padding: '0.5rem 0.75rem', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Plan Name</label>
                <input type="text" placeholder="e.g. Monthly, Quarterly Pro" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Price (Rs.)</label>
                <input type="number" placeholder="e.g. 1000" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} required style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>Duration (Days)</label>
                <input type="number" placeholder="e.g. 30" value={planForm.durationDays} onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })} required style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setModalMode(null)} disabled={isSaving} style={{ padding: '0.65rem 1.25rem', border: '1px solid rgba(37, 42, 46, 0.2)', background: '#FFFFFF', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} style={{ padding: '0.65rem 1.5rem', border: '1px solid #D4A900', background: '#F4C400', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.8 : 1 }}>
                  {isSaving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
