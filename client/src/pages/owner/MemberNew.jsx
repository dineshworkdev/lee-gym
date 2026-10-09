import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Plus,
  X,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { useOwnerGym, formatDate, addDaysToDate, CURRENT_DATE_STR } from '../../context/OwnerGymContext.jsx';
import ReceiptModal from '../../components/common/ReceiptModal.jsx';

export default function MemberNew() {
  const navigate = useNavigate();
  const { plans, addPlan, addMember, getNextMemberId } = useOwnerGym();

  // Generated Member ID
  const [memberId, setMemberId] = useState(() => getNextMemberId());
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Step state: 1: Basic, 2: Details, 3: Membership, 4: Payment, 5: Success
  const [currentStep, setCurrentStep] = useState(1);

  // Photo file state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState('');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic
    photo: null,
    name: '',
    mobile: '',
    gender: 'Male',
    dobOrAge: '',
    // Step 2: Details
    height: '',
    weight: '',
    address: '',
    // Step 3: Membership
    joiningDate: CURRENT_DATE_STR,
    paymentDate: CURRENT_DATE_STR,
    planId: plans[0]?.id || 'plan-1',
    // Step 4: Payment
    admissionAmount: '500',
    discount: '0',
    amountCollected: '1500',
    paymentMode: 'Cash',
    sendInvoice: true,
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // Add Plan Modal state (Step 3)
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [newPlanDuration, setNewPlanDuration] = useState('30');
  const [planModalError, setPlanModalError] = useState('');

  // Selected Plan Object
  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0] || {
    id: 'plan-1',
    name: 'Monthly',
    price: 1000,
    durationDays: 30,
  };

  // Payment Dynamic Calculations
  const admissionNum = Number(formData.admissionAmount) || 0;
  const planPriceNum = selectedPlan.price || 0;
  const discountNum = Number(formData.discount) || 0;
  const amountPayable = Math.max(0, admissionNum + planPriceNum - discountNum);
  const amountCollectedNum = Number(formData.amountCollected) || 0;
  const dueAmount = Math.max(0, amountPayable - amountCollectedNum);

  // Calculated Expiry Date
  const expiryDate = addDaysToDate(formData.joiningDate || CURRENT_DATE_STR, selectedPlan.durationDays || 30);

  // Success Created Member state
  const [createdMember, setCreatedMember] = useState(null);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Member name is required';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      errs.mobile = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Photo upload handler with validation
  const handlePhotoUpload = (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setPhotoError('Please select a valid image (JPEG, PNG, or WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Photo size must be less than 5MB.');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save New Plan Modal (async - calls Firestore via context)
  const handleSaveNewPlan = async (e) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      setPlanModalError('Plan name is required');
      return;
    }
    if (!newPlanPrice || isNaN(newPlanPrice) || Number(newPlanPrice) <= 0) {
      setPlanModalError('Please enter a valid price');
      return;
    }
    if (!newPlanDuration || isNaN(newPlanDuration) || Number(newPlanDuration) <= 0) {
      setPlanModalError('Please enter valid duration in days');
      return;
    }

    try {
      const createdPlan = await addPlan({
        name: newPlanName,
        price: newPlanPrice,
        durationDays: newPlanDuration,
      });

      // Auto select newly created plan
      setFormData((prev) => ({
        ...prev,
        planId: createdPlan.id,
        amountCollected: String(admissionNum + createdPlan.price),
      }));

      setShowAddPlanModal(false);
      setNewPlanName('');
      setNewPlanPrice('');
      setNewPlanDuration('30');
      setPlanModalError('');
    } catch (err) {
      console.error('Failed to create plan:', err);
      setPlanModalError(err.message || 'Failed to create plan. Please try again.');
    }
  };

  // Submit Final Member Form to Firestore
  const handleSubmitMember = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const newMemberPayload = {
        memberId: memberId,
        id: memberId,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        gender: formData.gender,
        dobOrAge: formData.dobOrAge.trim(),
        height: formData.height.trim(),
        weight: formData.weight.trim(),
        address: formData.address.trim(),
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        joiningDate: formData.joiningDate,
        expiryDate: expiryDate,
        paymentDate: formData.paymentDate,
        admissionAmount: admissionNum,
        planAmount: planPriceNum,
        discount: discountNum,
        amountPayable: amountPayable,
        amountCollected: amountCollectedNum,
        dueAmount: dueAmount,
        paymentMode: formData.paymentMode,
        sendInvoice: formData.sendInvoice,
      };

      const saved = await addMember(newMemberPayload, photoFile);
      setCreatedMember(saved);
      setCurrentStep(5); // Show Success Screen
    } catch (err) {
      console.error('Failed to save member in Firestore:', err);
      setSubmitError(err.message || 'Failed to save member. Please verify data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: '01 BASIC' },
    { num: 2, label: '02 DETAILS' },
    { num: 3, label: '03 MEMBERSHIP' },
    { num: 4, label: '04 PAYMENT' },
  ];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* ── TOP BACK NAVIGATION ─────────────────────────────────────── */}
      {currentStep !== 5 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/owner/members"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#252A2E',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>BACK TO MEMBERS</span>
          </Link>
        </div>
      )}

      {/* ── HEADING ─────────────────────────────────────────────────── */}
      {currentStep !== 5 && (
        <div style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(37, 42, 46, 0.08)' }}>
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
            ADD NEW MEMBER
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-slate, #4B555D)', margin: '0.3rem 0 0' }}>
            Complete the 4-step registration to enroll athlete
          </p>
        </div>
      )}

      {/* ── STEP INDICATOR ──────────────────────────────────────────── */}
      {currentStep !== 5 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '0.75rem',
            marginBottom: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}
        >
          {stepsList.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(244, 196, 0, 0.15)' : isCompleted ? '#F8FAF9' : 'transparent',
                  border: isActive ? '1px solid rgba(244, 196, 0, 0.6)' : isCompleted ? '1px solid rgba(47, 125, 74, 0.2)' : '1px solid transparent',
                  color: isActive ? '#997A00' : isCompleted ? '#2F7D4A' : 'var(--color-slate, #4B555D)',
                  fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                  fontSize: '0.8rem',
                  letterSpacing: '0.02em',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-yellow, #F4C400)' : isCompleted ? '#2F7D4A' : '#E5E7EB',
                    color: isActive ? '#252A2E' : isCompleted ? '#FFFFFF' : '#4B555D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? <Check size={13} /> : step.num}
                </div>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MAIN CARD FORM WRAPPER ──────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(37, 42, 46, 0.08)',
          borderRadius: '8px',
          boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* ════ STEP 1: BASIC INFORMATION ════ */}
        {currentStep === 1 && (
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.8rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: '0 0 1.5rem',
                borderBottom: '2px solid #252A2E',
                paddingBottom: '0.5rem',
              }}
            >
              01 — BASIC INFORMATION
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Photo & Member ID Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.25rem',
                  backgroundColor: '#FAF8F4',
                  border: '1.5px solid #252A2E',
                  flexWrap: 'wrap',
                }}
              >
                {/* Photo Preview / Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: '#252A2E',
                      color: '#F4C400',
                      border: '1.5px solid #252A2E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {formData.photo ? (
                      <img src={formData.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={28} />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="photo-upload-input"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#FFFFFF',
                        color: '#252A2E',
                        border: '1px solid rgba(37, 42, 46, 0.2)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                      }}
                    >
                      <Upload size={14} />
                      <span>{formData.photo ? 'Change Photo' : 'Upload Photo'}</span>
                    </label>
                    <input
                      id="photo-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: photoError ? '#A83D3D' : '#4B555D', marginTop: '0.25rem', fontWeight: photoError ? 700 : 400 }}>
                      {photoError || 'Optional PNG, JPG up to 5MB'}
                    </div>
                  </div>
                </div>

                {/* Auto-generated Member ID */}
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#4B555D' }}>
                    AUTOMATIC MEMBER ID
                  </div>
                  <div
                    style={{
                      backgroundColor: '#252A2E',
                      color: '#F4C400',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      padding: '0.4rem 0.85rem',
                      letterSpacing: '0.08em',
                      marginTop: '0.2rem',
                    }}
                  >
                    {memberId}
                  </div>
                </div>
              </div>

              {/* Name * */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  FULL NAME *
                </label>
                <input
                  id="new-member-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arun Kumar"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.name ? '2px solid #A83D3D' : '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                {errors.name && <div style={{ color: '#A83D3D', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: 600 }}>{errors.name}</div>}
              </div>

              {/* Mobile Number * */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  MOBILE NUMBER *
                </label>
                <input
                  id="new-member-mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  maxLength="10"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: errors.mobile ? '2px solid #A83D3D' : '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                {errors.mobile && <div style={{ color: '#A83D3D', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: 600 }}>{errors.mobile}</div>}
              </div>

              {/* Gender */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  GENDER
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      style={{
                        padding: '0.7rem',
                        border: '1.5px solid #252A2E',
                        backgroundColor: formData.gender === g ? '#252A2E' : '#FFFFFF',
                        color: formData.gender === g ? '#FFFFFF' : '#252A2E',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth / Age */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  DATE OF BIRTH / AGE
                </label>
                <input
                  type="text"
                  value={formData.dobOrAge}
                  onChange={(e) => setFormData({ ...formData, dobOrAge: e.target.value })}
                  placeholder="e.g. 26 Yrs or 14/05/1998"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Next Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  id="step1-proceed-btn"
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#F4C400',
                    color: '#252A2E',
                    border: '1px solid #D4A900',
                    borderRadius: '6px',
                    padding: '0.75rem 1.75rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span>Proceed</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2: PERSONAL DETAILS ════ */}
        {currentStep === 2 && (
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.8rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: '0 0 1.5rem',
                borderBottom: '2px solid #252A2E',
                paddingBottom: '0.5rem',
              }}
            >
              02 — PERSONAL DETAILS
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Height & Weight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    HEIGHT (CM)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g. 178"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1.5px solid #252A2E',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 74"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1.5px solid #252A2E',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Address (Large Textarea) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  RESIDENTIAL ADDRESS
                </label>
                <textarea
                  rows="4"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full street address, apartment / door number, locality, city..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Buttons: Back & Proceed */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    color: '#252A2E',
                    border: '1px solid rgba(37, 42, 46, 0.2)',
                    borderRadius: '6px',
                    padding: '0.75rem 1.4rem',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  id="step2-proceed-btn"
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#F4C400',
                    color: '#252A2E',
                    border: '1px solid #D4A900',
                    borderRadius: '6px',
                    padding: '0.75rem 1.75rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span>Proceed</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 3: MEMBERSHIP ════ */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #252A2E', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                  fontSize: '1.8rem',
                  letterSpacing: '0.04em',
                  color: '#252A2E',
                  margin: 0,
                }}
              >
                03 — MEMBERSHIP
              </h2>

              {/* + ADD NEW PLAN Button */}
              <button
                type="button"
                id="add-new-plan-btn"
                onClick={() => setShowAddPlanModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  color: '#252A2E',
                  border: '1.5px solid #252A2E',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>+ ADD NEW PLAN</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Dates Row: Joining Date & Payment Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    JOINING DATE
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1.5px solid #252A2E',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    PAYMENT DATE
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1.5px solid #252A2E',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Membership Plan Selector Cards */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  SELECT MEMBERSHIP PLAN *
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {plans.filter(p => p.status === 'Active' || p.status === undefined).map((p) => {
                    const isSelected = formData.planId === p.id;
                    return (
                      <div
                        key={p.id}
                        id={`plan-card-${p.id}`}
                        onClick={() => {
                          const isMonthly = p.name.toLowerCase().includes('monthly');
                          const adm = isMonthly ? 500 : (p.admissionFee || 0);
                          setFormData((prev) => ({
                            ...prev,
                            planId: p.id,
                            admissionAmount: String(adm),
                            amountCollected: String(adm + p.price),
                          }));
                        }}
                        style={{
                          border: isSelected ? '1.5px solid #F4C400' : '1px solid rgba(37, 42, 46, 0.12)',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'rgba(244, 196, 0, 0.05)' : '#FFFFFF',
                          padding: '1.25rem 1rem',
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: isSelected ? '0 2px 8px rgba(244, 196, 0, 0.15)' : 'none',
                          transition: 'all 120ms ease',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              width: '18px',
                              height: '18px',
                              backgroundColor: '#252A2E',
                              color: '#F4C400',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={12} />
                          </div>
                        )}
                        <div
                          style={{
                            fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                            fontSize: '1.4rem',
                            letterSpacing: '0.04em',
                            color: '#252A2E',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {p.name}
                        </div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#252A2E', marginBottom: '0.25rem' }}>
                          ₹{p.price}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#4B555D' }}>
                          {p.durationDays} Days Duration
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Expiry Preview */}
              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1.5px solid #252A2E',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#4B555D', textTransform: 'uppercase', fontWeight: 700 }}>
                    Computed Membership Expiry:
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#252A2E' }}>
                    {formatDate(expiryDate)} ({selectedPlan.durationDays} Days)
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4B555D' }}>
                  Auto-calculated from joining date + plan duration
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    color: '#252A2E',
                    border: '1px solid rgba(37, 42, 46, 0.2)',
                    borderRadius: '6px',
                    padding: '0.75rem 1.4rem',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  id="step3-proceed-btn"
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#F4C400',
                    color: '#252A2E',
                    border: '1px solid #D4A900',
                    borderRadius: '6px',
                    padding: '0.75rem 1.75rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <span>Proceed</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 4: PAYMENT ════ */}
        {currentStep === 4 && (
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '1.8rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: '0 0 1.5rem',
                borderBottom: '2px solid #252A2E',
                paddingBottom: '0.5rem',
              }}
            >
              04 — PAYMENT
            </h2>

            <form onSubmit={handleSubmitMember} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Admission Amount */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  ADMISSION AMOUNT (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.admissionAmount}
                  onChange={(e) => {
                    const adm = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      admissionAmount: adm,
                      amountCollected: String((Number(adm) || 0) + planPriceNum),
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Plan Amount (Auto from chosen plan) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  PLAN AMOUNT (AUTOMATIC FROM SELECTED PLAN)
                </label>
                <input
                  type="text"
                  value={`₹${planPriceNum} (${selectedPlan.name})`}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid rgba(37, 42, 46, 0.25)',
                    backgroundColor: '#FAF8F4',
                    color: '#252A2E',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Discount Amount */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  SPECIAL DISCOUNT (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1.5px solid #252A2E',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Live Calculation: AMOUNT PAYABLE */}
              <div
                style={{
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#F4C400', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>
                    TOTAL AMOUNT PAYABLE
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#E5E7EB', marginTop: '0.15rem' }}>
                    Admission (₹{admissionNum}) + Plan (₹{planPriceNum}){discountNum > 0 ? ` - Discount (₹${discountNum})` : ''}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    fontSize: '2.5rem',
                    color: '#F4C400',
                    lineHeight: 1,
                  }}
                >
                  ₹{amountPayable}
                </div>
              </div>

              {/* Amount Collected */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.4rem' }}>
                  Amount Collected (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amountCollected}
                  onChange={(e) => setFormData({ ...formData, amountCollected: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid rgba(37, 42, 46, 0.2)',
                    borderRadius: '6px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Live Calculation: DUE AMOUNT */}
              <div
                style={{
                  backgroundColor: dueAmount > 0 ? '#FDF2F2' : '#F2F9F4',
                  border: dueAmount > 0 ? '2px solid #A83D3D' : '2px solid #2F7D4A',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: dueAmount > 0 ? '#A83D3D' : '#2F7D4A' }}>
                    {dueAmount > 0 ? 'OUTSTANDING DUE BALANCE' : 'PAYMENT FULLY SETTLED'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4B555D' }}>
                    Payable (₹{amountPayable}) − Collected (₹{amountCollectedNum})
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                    fontSize: '2.2rem',
                    color: dueAmount > 0 ? '#A83D3D' : '#2F7D4A',
                    lineHeight: 1,
                  }}
                >
                  ₹{dueAmount}
                </div>
              </div>

              {/* Mode of Payment: Cash / Online */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  MODE OF PAYMENT
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {['Cash', 'Online'].map((mode) => (
                    <label
                      key={mode}
                      style={{
                        padding: '0.8rem',
                        border: '1.5px solid #252A2E',
                        backgroundColor: formData.paymentMode === mode ? '#252A2E' : '#FFFFFF',
                        color: formData.paymentMode === mode ? '#FFFFFF' : '#252A2E',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value={mode}
                        checked={formData.paymentMode === mode}
                        onChange={() => setFormData({ ...formData, paymentMode: mode })}
                        style={{ display: 'none' }}
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Invoice Checkbox: Send Invoice on WhatsApp */}
              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1.5px solid #252A2E',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}
                onClick={() => setFormData({ ...formData, sendInvoice: !formData.sendInvoice })}
              >
                <input
                  type="checkbox"
                  id="send-invoice-checkbox"
                  checked={formData.sendInvoice}
                  onChange={(e) => setFormData({ ...formData, sendInvoice: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#252A2E' }}
                />
                <label htmlFor="send-invoice-checkbox" style={{ cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: '#252A2E' }}>
                  Send Invoice on WhatsApp
                </label>
              </div>

              {/* Submit Error Banner */}
              {submitError && (
                <div
                  style={{
                    backgroundColor: '#FDF2F2',
                    borderLeft: '4px solid #A83D3D',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    color: '#A83D3D',
                    fontWeight: 600,
                  }}
                >
                  {submitError}
                </div>
              )}

              {/* Action Buttons: Back & Final Add Member */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCurrentStep(3)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    color: '#252A2E',
                    border: '1px solid rgba(37, 42, 46, 0.2)',
                    borderRadius: '6px',
                    padding: '0.75rem 1.4rem',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  id="final-add-member-btn"
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    backgroundColor: '#F4C400',
                    color: '#252A2E',
                    border: '1px solid #D4A900',
                    borderRadius: '6px',
                    padding: '0.75rem 2rem',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 120ms ease',
                    opacity: isSubmitting ? 0.8 : 1,
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{isSubmitting ? 'Saving to Firestore...' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════ STEP 5: SUCCESS SCREEN ════ */}
        {currentStep === 5 && createdMember && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {/* Success Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#2F7D4A',
                color: '#FFFFFF',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '3px solid #252A2E',
              }}
            >
              <Check size={36} strokeWidth={3} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: '2.8rem',
                letterSpacing: '0.04em',
                color: '#252A2E',
                margin: 0,
                lineHeight: 1,
              }}
            >
              MEMBER ADDED
            </h2>
            <p style={{ color: '#4B555D', fontSize: '0.9rem', margin: '0.35rem 0 1.75rem' }}>
              Registration complete and member details have been recorded.
            </p>

            {/* Member Summary Receipt Card */}
            <div
              style={{
                maxWidth: '480px',
                margin: '0 auto 2rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(37, 42, 46, 0.08)',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(37, 42, 46, 0.06)',
                padding: '1.75rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.6rem', color: '#252A2E', lineHeight: 1 }}>
                    {createdMember.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4B555D' }}>{createdMember.mobile}</div>
                </div>
                <div style={{ backgroundColor: '#252A2E', color: '#F4C400', fontFamily: 'monospace', fontWeight: 800, padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>
                  {createdMember.id}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Membership:</span>
                  <strong>{createdMember.planName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Joining:</span>
                  <strong>{formatDate(createdMember.joiningDate)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Expiry:</span>
                  <strong>{formatDate(createdMember.expiryDate)}</strong>
                </div>

                <div style={{ borderTop: '1px dashed rgba(37, 42, 46, 0.2)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Amount Payable:</span>
                  <strong>₹{createdMember.amountPayable}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Collected:</span>
                  <strong style={{ color: '#2F7D4A' }}>₹{createdMember.amountCollected}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Due:</span>
                  <strong style={{ color: createdMember.amountDue > 0 ? '#A83D3D' : '#2F7D4A' }}>
                    ₹{createdMember.amountDue}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B555D' }}>Payment Mode:</span>
                  <strong style={{ textTransform: 'uppercase' }}>{createdMember.paymentMode}</strong>
                </div>
              </div>

              {/* WhatsApp Invoice notice if checked */}
              {createdMember.sendInvoice && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem',
                    backgroundColor: '#E6F4EA',
                    border: '1px solid #2F7D4A',
                    fontSize: '0.8rem',
                    color: '#2F7D4A',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Send size={15} />
                  <span>Invoice will be sent on WhatsApp (Future integration)</span>
                </div>
              )}
            </div>

            {/* Action Buttons: [ PRINT RECEIPT ] & [ VIEW MEMBER ] & [ BACK TO DASHBOARD ] */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                id="success-print-receipt-btn"
                onClick={() => setShowReceiptModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#2F7D4A',
                  color: '#FFFFFF',
                  border: '1px solid rgba(47, 125, 74, 0.8)',
                  borderRadius: '6px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                id="success-view-member-btn"
                onClick={() => navigate(`/owner/members/${createdMember.id}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  border: '1px solid #252A2E',
                  borderRadius: '6px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                <span>View Member</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                id="success-back-dashboard-btn"
                onClick={() => navigate('/owner/dashboard')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#F4C400',
                  color: '#252A2E',
                  border: '1px solid #D4A900',
                  borderRadius: '6px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                id="success-add-another-btn"
                onClick={() => {
                  setFormData({
                    photo: null,
                    name: '',
                    mobile: '',
                    gender: 'Male',
                    dobOrAge: '',
                    height: '',
                    weight: '',
                    address: '',
                    joiningDate: CURRENT_DATE_STR,
                    paymentDate: CURRENT_DATE_STR,
                    planId: plans[0]?.id || 'plan-1',
                    admissionAmount: '500',
                    amountCollected: '1500',
                    paymentMode: 'Cash',
                    sendInvoice: true,
                  });
                  setPhotoFile(null);
                  setPhotoError('');
                  setCreatedMember(null);
                  setSubmitError('');
                  setMemberId(getNextMemberId());
                  setCurrentStep(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  color: '#252A2E',
                  border: '1px solid rgba(37, 42, 46, 0.2)',
                  borderRadius: '6px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                <span>+ Add Another Member</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD NEW PLAN MODAL (STEP 3) ─────────────────────────────── */}
      {showAddPlanModal && (
        <div
          onClick={() => setShowAddPlanModal(false)}
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
              maxWidth: '440px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(37, 42, 46, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '2rem', margin: 0 }}>
                ADD NEW PLAN
              </h3>
              <button type="button" onClick={() => setShowAddPlanModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A8288' }}>
                <X size={22} />
              </button>
            </div>

            {planModalError && (
              <div style={{ backgroundColor: '#FDF2F2', border: '1px solid #A83D3D', borderRadius: '6px', color: '#A83D3D', padding: '0.5rem', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                {planModalError}
              </div>
            )}

            <form onSubmit={handleSaveNewPlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Plan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Semi-Annual Pro"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={newPlanPrice}
                  onChange={(e) => setNewPlanPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4B555D', marginBottom: '0.35rem' }}>
                  Duration (Days)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 180"
                  value={newPlanDuration}
                  onChange={(e) => setNewPlanDuration(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid rgba(37, 42, 46, 0.2)', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  style={{ padding: '0.65rem 1.25rem', border: '1px solid rgba(37, 42, 46, 0.2)', background: '#FFFFFF', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.5rem', border: '1px solid #D4A900', background: '#F4C400', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── PRINTABLE RECEIPT MODAL ─────────────────────────────────── */}
      {showReceiptModal && createdMember && (
        <ReceiptModal
          payment={{
            receiptNumber: `RCP-${String(createdMember.id || createdMember.memberId).replace(/\D/g, '') || '001'}`,
            date: createdMember.paymentDate || CURRENT_DATE_STR,
            amount: createdMember.amountCollected || 0,
            amountPaid: createdMember.amountCollected || 0,
            admissionAmount: createdMember.admissionAmount || 0,
            planAmount: createdMember.planAmount || 0,
            discount: createdMember.discount || 0,
            amountPayable: createdMember.amountPayable || 0,
            paymentMode: createdMember.paymentMode || 'Cash',
            mode: createdMember.paymentMode || 'Cash',
            planName: createdMember.planName,
            dueAmount: createdMember.dueAmount || 0,
            type: 'Initial Registration',
          }}
          member={createdMember}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}
