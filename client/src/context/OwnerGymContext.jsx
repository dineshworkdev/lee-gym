import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase.js';
import {
  getMembersFromFirestore,
  addMemberToFirestore,
  updateMemberInFirestore,
  renewMemberInFirestore,
  freezeMemberInFirestore,
  resumeMemberInFirestore,
  archiveMemberInFirestore,
  restoreMemberInFirestore,
  deleteMemberFromFirestore,
  generateNextMemberId,
} from '../services/memberService.js';
import {
  getPlans as getPlansFromFirestore,
  addPlan as addPlanToFirestore,
  updatePlan as updatePlanInFirestore,
  deletePlan as deletePlanFromFirestore,
} from '../services/planService.js';
import {
  getMemberPayments,
  getAllPayments,
  addPayment as recordPaymentInFirestore,
} from '../services/paymentService.js';
import {
  getStaffProfile,
  getStaffList,
  saveStaffMember,
  updateStaffMember as updateStaffInFirestore,
  deleteStaffMember as deleteStaffFromFirestore,
  OWNER_BOOTSTRAP_EMAIL,
} from '../services/staffService.js';
import {
  getTodayDateStr,
  formatDateDisplay,
  addDaysToDate,
  getDaysDifference,
  evaluateMemberStatus,
} from '../utils/membershipRules.js';

export const CURRENT_DATE_STR = getTodayDateStr();
export const formatDate = formatDateDisplay;
export { addDaysToDate };

const OwnerGymContext = createContext(null);

export function OwnerGymProvider({ children }) {
  // ── Authentication State ──────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState('Owner');

  // ── Members State ─────────────────────────────────────────────────
  const [members, setMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  // ── Plans State ───────────────────────────────────────────────────
  const [plans, setPlans] = useState([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  // ── Payments State (for Payments Hub & Reports) ───────────────────
  const [payments, setPayments] = useState([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

  // ── Staff State (RBAC) ────────────────────────────────────────────
  const [staffList, setStaffList] = useState([]);
  const [isStaffLoading, setIsStaffLoading] = useState(false);

  // ── Auth Observer & Role Resolution ───────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getStaffProfile(user.uid, user.email);
          setUserRole(profile?.role || (user.email === OWNER_BOOTSTRAP_EMAIL ? 'Owner' : 'Receptionist'));
        } catch (err) {
          console.warn('Could not resolve user role:', err);
          setUserRole(user.email === OWNER_BOOTSTRAP_EMAIL ? 'Owner' : 'Receptionist');
        }
      } else {
        setUserRole('none');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAuthenticated = Boolean(currentUser);
  const isOwner = userRole === 'Owner' || currentUser?.email === OWNER_BOOTSTRAP_EMAIL;
  const isReceptionist = userRole === 'Receptionist';
  const isTrainer = userRole === 'Trainer';

  // ── Data Loaders ──────────────────────────────────────────────────
  const loadMembers = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsMembersLoading(true);
    setMembersError(null);
    try {
      const data = await getMembersFromFirestore();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members from Firestore:', err);
      setMembersError(err.message || 'Failed to load members from Firestore.');
    } finally {
      setIsMembersLoading(false);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsPlansLoading(true);
    setPlansError(null);
    try {
      const data = await getPlansFromFirestore();
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans from Firestore:', err);
      setPlansError(err.message || 'Failed to load plans from Firestore.');
    } finally {
      setIsPlansLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsPaymentsLoading(true);
    try {
      const data = await getAllPayments(300);
      setPayments(data);
    } catch (err) {
      console.error('Error fetching all payments:', err);
    } finally {
      setIsPaymentsLoading(false);
    }
  }, []);

  const loadStaff = useCallback(async () => {
    if (!auth.currentUser || !isOwner) return;
    setIsStaffLoading(true);
    try {
      const data = await getStaffList();
      setStaffList(data);
    } catch (err) {
      console.error('Error fetching staff list:', err);
    } finally {
      setIsStaffLoading(false);
    }
  }, [isOwner]);

  // Initial load when user logs in
  useEffect(() => {
    if (currentUser) {
      loadMembers();
      loadPlans();
      loadPayments();
      if (isOwner) loadStaff();
    } else {
      setMembers([]);
      setPlans([]);
      setPayments([]);
      setStaffList([]);
      setIsMembersLoading(false);
      setIsPlansLoading(false);
      setIsPaymentsLoading(false);
    }
  }, [currentUser, isOwner, loadMembers, loadPlans, loadPayments, loadStaff]);

  // Derived owner profile
  const ownerProfile = useMemo(() => {
    if (!currentUser) {
      return {
        name: 'Gym Owner',
        role: 'Owner',
        email: OWNER_BOOTSTRAP_EMAIL,
        gymName: 'LEE GYM',
        tagline: 'Gym located in Pappampatti Rd Pallapalayam.',
        photoURL: null,
        uid: null,
      };
    }
    return {
      name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Gym Staff'),
      role: userRole,
      email: currentUser.email || OWNER_BOOTSTRAP_EMAIL,
      gymName: 'LEE GYM',
      tagline: 'Gym located in Pappampatti Rd Pallapalayam.',
      photoURL: currentUser.photoURL || null,
      uid: currentUser.uid,
    };
  }, [currentUser, userRole]);

  // ── Auth Actions ──────────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    if (!email || !password) throw new Error('Please enter both email and password.');
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  const getNextMemberId = useCallback(() => {
    return generateNextMemberId(members);
  }, [members]);

  // ── Member Operations ─────────────────────────────────────────────
  const addMember = async (newMemberData, photoFile = null) => {
    const saved = await addMemberToFirestore(newMemberData, photoFile);
    setMembers((prev) => [saved, ...prev]);
    if (saved.initialPayment) {
      setPayments((prev) => [saved.initialPayment, ...prev]);
    }
    return saved;
  };

  const updateMember = async (idOrDocId, updatedFields, newPhotoFile = null) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await updateMemberInFirestore(docId, updatedFields, newPhotoFile);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.docId === docId || m.id === idOrDocId || m.memberId === idOrDocId) {
          return { ...m, ...updatedFields, ...res };
        }
        return m;
      })
    );
    return res;
  };

  const recordPayment = async (
    idOrDocId,
    paymentAmount,
    paymentMode = 'Cash',
    paymentDate = null,
    notes = ''
  ) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    if (!target) return { success: false, message: 'Member not found.' };

    const docId = target.docId || idOrDocId;
    try {
      const res = await recordPaymentInFirestore({
        memberDocId: docId,
        memberId: target.memberId || target.id,
        amount: paymentAmount,
        paymentMode,
        paymentDate: paymentDate || CURRENT_DATE_STR,
        notes,
      });

      setMembers((prev) =>
        prev.map((m) => {
          if (m.docId === docId || m.id === idOrDocId || m.memberId === idOrDocId) {
            return {
              ...m,
              ...res.memberUpdate,
              dueAmount: res.memberUpdate?.dueAmount,
              amountDue: res.memberUpdate?.dueAmount,
            };
          }
          return m;
        })
      );

      if (res.payment) {
        setPayments((prev) => [res.payment, ...prev]);
      }

      return { success: true, payment: res.payment };
    } catch (err) {
      console.error('Failed to record payment:', err);
      return { success: false, message: err.message || 'Payment recording failed.' };
    }
  };

  const renewMember = async (renewalInput) => {
    const res = await renewMemberInFirestore({
      ...renewalInput,
      renewedBy: ownerProfile.name || 'Owner',
    });

    // Update in-memory member state
    setMembers((prev) =>
      prev.map((m) => {
        if (m.docId === renewalInput.memberDocId || m.id === renewalInput.memberId) {
          return {
            ...m,
            ...res.memberUpdate,
          };
        }
        return m;
      })
    );

    if (res.payment) {
      setPayments((prev) => [res.payment, ...prev]);
    }

    return res;
  };

  const freezeMember = async (idOrDocId, freezeData) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await freezeMemberInFirestore(docId, {
      ...freezeData,
      frozenBy: ownerProfile.name || 'Owner',
    });

    setMembers((prev) =>
      prev.map((m) => (m.docId === docId || m.id === idOrDocId ? { ...m, ...res } : m))
    );
    return res;
  };

  const resumeMember = async (idOrDocId, resumeDate = getTodayDateStr()) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await resumeMemberInFirestore(docId, target, resumeDate, ownerProfile.name || 'Owner');

    setMembers((prev) =>
      prev.map((m) => (m.docId === docId || m.id === idOrDocId ? { ...m, ...res } : m))
    );
    return res;
  };

  const archiveMember = async (idOrDocId, reason = '') => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await archiveMemberInFirestore(docId, reason, ownerProfile.name || 'Owner');

    setMembers((prev) =>
      prev.map((m) => (m.docId === docId || m.id === idOrDocId ? { ...m, ...res } : m))
    );
    return res;
  };

  const restoreMember = async (idOrDocId) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await restoreMemberInFirestore(docId);

    setMembers((prev) =>
      prev.map((m) => (m.docId === docId || m.id === idOrDocId ? { ...m, ...res } : m))
    );
    return res;
  };

  const deleteMember = async (idOrDocId) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    await deleteMemberFromFirestore(docId);
    setMembers((prev) => prev.filter((m) => m.docId !== docId && m.id !== idOrDocId && m.memberId !== idOrDocId));
    return { success: true };
  };

  // ── Plan Operations ───────────────────────────────────────────────
  const addPlan = async (planData) => {
    const created = await addPlanToFirestore(planData);
    setPlans((prev) => [...prev, created]);
    return created;
  };

  const updatePlan = async (id, planData) => {
    await updatePlanInFirestore(id, planData);
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...planData,
              price: planData.price !== undefined ? Number(planData.price) : p.price,
              durationDays: planData.durationDays !== undefined ? Number(planData.durationDays) : p.durationDays,
            }
          : p
      )
    );
  };

  const togglePlanStatus = async (id) => {
    const target = plans.find((p) => p.id === id);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    await updatePlanInFirestore(id, { status: newStatus });
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const removePlan = async (id) => {
    await deletePlanFromFirestore(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Staff Operations ──────────────────────────────────────────────
  const saveStaff = async (staffData) => {
    const saved = await saveStaffMember(staffData);
    setStaffList((prev) => {
      const exists = prev.some((s) => s.id === saved.id || s.uid === saved.uid);
      if (exists) {
        return prev.map((s) => (s.id === saved.id || s.uid === saved.uid ? saved : s));
      }
      return [...prev, saved];
    });
    return saved;
  };

  const updateStaff = async (staffId, updateData) => {
    await updateStaffInFirestore(staffId, updateData);
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId || s.uid === staffId ? { ...s, ...updateData } : s))
    );
  };

  const deleteStaff = async (staffId) => {
    await deleteStaffFromFirestore(staffId);
    setStaffList((prev) => prev.filter((s) => s.id !== staffId && s.uid !== staffId));
  };

  // ── Centralized Member Evaluator ──────────────────────────────────
  const memberEvaluator = useCallback((member) => {
    return evaluateMemberStatus(member, CURRENT_DATE_STR);
  }, []);

  // ── Comprehensive Dashboard Metrics ───────────────────────────────
  const dashboardMetrics = useMemo(() => {
    let dueMembers = 0;
    let expiringToday = 0;
    let expiringSoon = 0;
    let activeMembers = 0;
    let expiredMembers = 0;
    let frozenMembers = 0;
    let archivedMembers = 0;
    let totalOutstandingDues = 0;

    const planCounts = {};
    const todayStr = CURRENT_DATE_STR;
    const currentMonthPrefix = todayStr.slice(0, 7); // e.g. "2026-10"

    members.forEach((m) => {
      const evalResult = memberEvaluator(m);

      if (evalResult.isArchived) {
        archivedMembers++;
        return;
      }

      if (evalResult.isFrozen) {
        frozenMembers++;
      } else if (evalResult.isActive) {
        activeMembers++;
        if (evalResult.isExpiringToday) expiringToday++;
        else if (evalResult.isExpiringSoon) expiringSoon++;
      } else if (evalResult.isExpired) {
        expiredMembers++;
      }

      if (evalResult.isDue) {
        dueMembers++;
        totalOutstandingDues += Number(evalResult.dueAmount || 0);
      }

      const pName = m.planName || 'Unassigned';
      planCounts[pName] = (planCounts[pName] || 0) + 1;
    });

    // Revenue calculations from actual payments
    let totalRevenueCollected = 0;
    let collectionsToday = 0;
    let collectionsThisMonth = 0;
    const paymentModeBreakdown = { Cash: 0, UPI: 0, Card: 0, Other: 0 };

    payments.forEach((p) => {
      const amt = Number(p.amountPaid || 0);
      totalRevenueCollected += amt;

      const pDateStr = p.paymentDateStr || (p.paymentDate?.toDate ? p.paymentDate.toDate().toISOString().split('T')[0] : '');

      if (pDateStr === todayStr) {
        collectionsToday += amt;
      }
      if (pDateStr.startsWith(currentMonthPrefix)) {
        collectionsThisMonth += amt;
      }

      const mode = (p.paymentMode || 'Cash').toLowerCase();
      if (mode.includes('cash')) paymentModeBreakdown.Cash += amt;
      else if (mode.includes('upi') || mode.includes('online')) paymentModeBreakdown.UPI += amt;
      else if (mode.includes('card')) paymentModeBreakdown.Card += amt;
      else paymentModeBreakdown.Other += amt;
    });

    return {
      dueMembers,
      expiringToday,
      expiringSoon,
      activeMembers,
      expiredMembers,
      frozenMembers,
      archivedMembers,
      totalMembers: members.filter((m) => !m.isArchived).length,
      allMembersCount: members.length,
      totalOutstandingDues,
      totalRevenueCollected,
      collectionsToday,
      collectionsThisMonth,
      planCounts,
      paymentModeBreakdown,
    };
  }, [members, payments, memberEvaluator]);

  return (
    <OwnerGymContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthenticated,
        userRole,
        isOwner,
        isReceptionist,
        isTrainer,
        ownerProfile,
        login: loginWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
        plans,
        isPlansLoading,
        plansError,
        refreshPlans: loadPlans,
        addPlan,
        updatePlan,
        togglePlanStatus,
        removePlan,
        members,
        isMembersLoading,
        membersError,
        refreshMembers: loadMembers,
        addMember,
        updateMember,
        renewMember,
        freezeMember,
        resumeMember,
        archiveMember,
        restoreMember,
        deleteMember,
        recordPayment,
        payments,
        isPaymentsLoading,
        refreshPayments: loadPayments,
        getMemberPayments,
        staffList,
        isStaffLoading,
        refreshStaff: loadStaff,
        saveStaff,
        updateStaff,
        deleteStaff,
        getNextMemberId,
        memberEvaluator,
        dashboardMetrics,
      }}
    >
      {children}
    </OwnerGymContext.Provider>
  );
}

export function useOwnerGym() {
  const context = useContext(OwnerGymContext);
  if (!context) {
    throw new Error('useOwnerGym must be used within an OwnerGymProvider');
  }
  return context;
}
