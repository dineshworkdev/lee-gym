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
  recordPaymentInFirestore,
  deleteMemberFromFirestore,
  generateNextMemberId,
} from '../services/memberService.js';
import {
  getPlans as getPlansFromFirestore,
  addPlan as addPlanToFirestore,
  updatePlan as updatePlanInFirestore,
  deletePlan as deletePlanFromFirestore,
} from '../services/planService.js';
import { getMemberPayments } from '../services/paymentService.js';

// Anchor date: Real today date string in YYYY-MM-DD
export const CURRENT_DATE_STR = new Date().toISOString().split('T')[0];

// Helper to format date nicely
export function formatDate(date) {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : (typeof date === 'string' ? new Date(date.includes('T') ? date : date + 'T00:00:00') : new Date(date));
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Helper to add days to a date string YYYY-MM-DD
export function addDaysToDate(dateStr, days) {
  if (!dateStr) return '';
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split('T')[0];
}

// Calculate days difference between date and current date (midnight to midnight)
export function getDaysDiffFromCurrent(dateVal) {
  if (!dateVal) return -999;
  let d;
  if (dateVal?.toDate) {
    d = dateVal.toDate();
  } else if (typeof dateVal === 'string') {
    d = new Date(dateVal.includes('T') ? dateVal : dateVal + 'T00:00:00');
  } else {
    d = new Date(dateVal);
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const OwnerGymContext = createContext(null);

export function OwnerGymProvider({ children }) {
  // ── Firebase Authentication State ─────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Real Members State from Firestore ─────────────────────────────
  const [members, setMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  // ── Plans State from Firestore ────────────────────────────────────
  const [plans, setPlans] = useState([]);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAuthenticated = Boolean(currentUser);

  // Load members from Firestore (single fetch when authenticated to optimize free tier)
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

  // Load plans from Firestore (single fetch when authenticated)
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

  // Fetch members and plans once when user logs in
  useEffect(() => {
    if (currentUser) {
      loadMembers();
      loadPlans();
    } else {
      setMembers([]);
      setIsMembersLoading(false);
      setMembersError(null);
      setPlans([]);
      setIsPlansLoading(false);
      setPlansError(null);
    }
  }, [currentUser, loadMembers, loadPlans]);

  // Derived owner profile
  const ownerProfile = useMemo(() => {
    if (!currentUser) {
      return {
        name: 'Gym Owner',
        role: 'Owner',
        email: 'leegym.website@gmail.com',
        gymName: 'LEE GYM',
        tagline: 'Gym located in Pappampatti Rd Pallapalayam.',
        photoURL: null,
        uid: null,
      };
    }
    return {
      name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Gym Owner'),
      role: 'Owner',
      email: currentUser.email || 'leegym.website@gmail.com',
      gymName: 'LEE GYM',
      tagline: 'Gym located in Pappampatti Rd Pallapalayam.',
      photoURL: currentUser.photoURL || null,
      uid: currentUser.uid,
    };
  }, [currentUser]);

  // Plans are managed via Firestore (state declared above with members)

  // Auth actions using Firebase
  const loginWithEmail = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
  };

  const login = async (email, password) => {
    return await loginWithEmail(email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  // Generate next member ID e.g. LEE001, LEE002
  const getNextMemberId = useCallback(() => {
    return generateNextMemberId(members);
  }, [members]);

  // ── Real Member Operations with Firestore ─────────────────────────

  // Add new member to Firestore
  const addMember = async (newMemberData, photoFile = null) => {
    const saved = await addMemberToFirestore(newMemberData, photoFile);
    // Optimistically prepend to local state without re-fetching all members (saving reads)
    setMembers((prev) => [saved, ...prev]);
    return saved;
  };

  // Update existing member in Firestore
  const updateMember = async (idOrDocId, updatedFields, newPhotoFile = null) => {
    // Find target document ID
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    const res = await updateMemberInFirestore(docId, updatedFields, newPhotoFile);

    // Update in-memory state
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

  // Record payment for member in Firestore (Atomic transaction)
  const recordPayment = async (
    idOrDocId,
    paymentAmount,
    paymentMode = 'Cash',
    paymentDate = null,
    notes = ''
  ) => {
    const target = members.find(
      (m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId
    );
    if (!target) return { success: false, message: 'Member not found in system.' };

    const docId = target.docId || idOrDocId;
    try {
      const res = await recordPaymentInFirestore(
        docId,
        target,
        paymentAmount,
        paymentMode,
        paymentDate,
        notes
      );

      // Update in-memory member state atomically
      setMembers((prev) =>
        prev.map((m) => {
          if (m.docId === docId || m.id === idOrDocId || m.memberId === idOrDocId) {
            return {
              ...m,
              amountCollected: res.amountCollected,
              dueAmount: res.dueAmount,
              amountDue: res.dueAmount,
              paymentMode: res.paymentMode,
              lastPaymentDate: res.lastPaymentDate,
            };
          }
          return m;
        })
      );
      return { success: true, payment: res.payment };
    } catch (err) {
      console.error('Failed to record payment in Firestore:', err);
      return { success: false, message: err.message || 'Payment recording failed.' };
    }
  };

  // Delete member from Firestore
  const deleteMember = async (idOrDocId) => {
    const target = members.find((m) => m.docId === idOrDocId || m.id === idOrDocId || m.memberId === idOrDocId);
    const docId = target?.docId || idOrDocId;

    await deleteMemberFromFirestore(docId);

    // Remove from in-memory state
    setMembers((prev) => prev.filter((m) => m.docId !== docId && m.id !== idOrDocId && m.memberId !== idOrDocId));
    return { success: true };
  };

  // ── Firestore Plan Operations ─────────────────────────────────────

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

  // Intelligent Status Classifications
  const memberEvaluator = useCallback((member) => {
    if (!member) return {};
    const diff = getDaysDiffFromCurrent(member.expiryDate);
    const isExpired = diff < 0;
    const isActive = diff >= 0;
    const isExpiringToday = diff === 0;
    const isExpiring1Day = diff === 1;
    const isExpiring2Days = diff === 2;
    const isExpiring3Days = diff === 3;
    const isExpiring1To3 = diff >= 1 && diff <= 3;
    const dueVal = Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0));
    // A member needs attention if they have a financial balance OR their membership has expired
    const isDue = dueVal > 0 || diff < 0;

    return {
      isExpired,
      isActive,
      isExpiringToday,
      isExpiring1Day,
      isExpiring2Days,
      isExpiring3Days,
      isExpiring1To3,
      isDue,
      diff,
      membershipStatus: isActive ? 'Active' : 'Expired',
      paymentStatus: isDue ? 'Due' : 'Paid',
    };
  }, []);

  // Metrics calculation from real Firestore members data
  const dashboardMetrics = useMemo(() => {
    let dueMembers = 0;
    let expiringToday = 0;
    let expiringSoon = 0;
    let expiring1Day = 0;
    let expiring2Days = 0;
    let expiring3Days = 0;
    let activeMembers = 0;
    let expiredMembers = 0;

    members.forEach((m) => {
      const {
        isDue,
        isExpiringToday,
        isExpiring1Day,
        isExpiring2Days,
        isExpiring3Days,
        isExpiring1To3,
        isActive,
        isExpired,
      } = memberEvaluator(m);

      // isDue = financial due > 0 OR expired — both require owner attention
      if (isDue) dueMembers++;
      if (isExpiringToday) expiringToday++;
      if (isExpiring1Day) expiring1Day++;
      if (isExpiring2Days) expiring2Days++;
      if (isExpiring3Days) expiring3Days++;
      if (isExpiring1To3) expiringSoon++;
      if (isActive) activeMembers++;
      if (isExpired) expiredMembers++;
    });

    return {
      dueMembers,
      expiringToday,
      expiringSoon,
      expiring1Day,
      expiring2Days,
      expiring3Days,
      activeMembers,
      expiredMembers,
      totalMembers: members.length,
    };
  }, [members, memberEvaluator]);

  return (
    <OwnerGymContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthenticated,
        ownerProfile,
        login,
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
        deleteMember,
        recordPayment,
        getMemberPayments,
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
