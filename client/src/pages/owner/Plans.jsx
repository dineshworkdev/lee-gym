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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid rgba(37, 42, 46, 0.1)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', letterSpacing: '0.04em', color: '#252A2E', margin: 0, lineHeight: 1 }}>
            MEMBERSHIP PLANS
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.9rem', color: '#4B555D', margin: '0.4rem 0 0' }}>
            Manage pricing tiers, subscription durations, and activation status
          </p>
        </div>
        <button
          id="plans-add-plan-btn"
          type="button"
          onClick={openAddModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F4C400', color: '#252A2E', border: '2px solid #252A2E', padding: '0.75rem 1.4rem', fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: '3px 3px 0px #252A2E', cursor: 'pointer' }}
        >
          <Plus size={18} />
          <span>+ ADD NEW PLAN</span>
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div style={{ backgroundColor: noticeType === 'error' ? '#A83D3D' : '#2F7D4A', color: '#FFFFFF', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {noticeType === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{notice}</span>
        </div>
      )}

      {/* PLANS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {plans.map((plan) => {
          const isActive = plan.status === 'Active';
          const toggling = isToggling === plan.id;
          return (
            <div
              key={plan.id}
              id={`plan-item-${plan.id}`}
              style={{ backgroundColor: '#FFFFFF', border: '2px solid #252A2E', boxShadow: '4px 4px 0px #252A2E', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isActive ? 1 : 0.65, transition: 'all 120ms ease' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', letterSpacing: '0.04em', color: '#252A2E', margin: 0, lineHeight: 1 }}>
                    {plan.name}
                  </h2>
                  <span style={{ backgroundColor: isActive ? '#2F7D4A' : '#4B555D', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.6rem' }}>
                    {plan.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '3.2rem', lineHeight: 0.9, color: '#252A2E' }}>
                    {String.fromCharCode(8377)}{plan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#4B555D', fontWeight: 600 }}>/ fee</span>
                </div>
                <div style={{ backgroundColor: '#FAF8F4', border: '1px solid rgba(37,42,46,0.15)', padding: '0.65rem 0.85rem', fontSize: '0.85rem', color: '#252A2E', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <Calendar size={16} color="#4B555D" />
                  <span>Duration: <strong>{plan.durationDays} Days</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px dashed rgba(37, 42, 46, 0.15)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: '#FFFFFF', color: '#252A2E', border: '1.5px solid #252A2E', padding: '0.65rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(plan)}
                  disabled={toggling}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: isActive ? '#FAF8F4' : '#252A2E', color: isActive ? '#A83D3D' : '#FFFFFF', border: isActive ? '1.5px solid #A83D3D' : '1.5px solid #252A2E', padding: '0.65rem', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', cursor: toggling ? 'not-allowed' : 'pointer', opacity: toggling ? 0.7 : 1 }}
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
        <div onClick={() => setModalMode(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37, 42, 46, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', border: '2px solid #252A2E', boxShadow: '6px 6px 0px #252A2E', width: '100%', maxWidth: '460px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
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
                <input type="number" placeholder="e.g. 1000" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Duration (Days)</label>
                <input type="number" placeholder="e.g. 30" value={planForm.durationDays} onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })} required style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #252A2E', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={() => setModalMode(null)} disabled={isSaving} style={{ padding: '0.65rem 1.25rem', border: '1.5px solid #252A2E', background: '#FFFFFF', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} style={{ padding: '0.7rem 1.5rem', border: '2px solid #252A2E', background: '#F4C400', fontWeight: 800, cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: isSaving ? 'none' : '3px 3px 0px #252A2E', opacity: isSaving ? 0.8 : 1 }}>
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
