import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const PAYMENTS_COLLECTION = 'payments';
const MEMBERS_COLLECTION = 'members';

/**
 * Generates the next human-readable receipt number: e.g. "LEE-2026-0001"
 * Queries the highest existing receipt number ordered descending.
 * Uses a single-field index (default in Firestore) to avoid index creation requirements.
 *
 * @returns {Promise<string>} Next receipt number
 */
export async function generateNextReceiptNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `LEE-${currentYear}-`;

  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, orderBy('receiptNumber', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return `${prefix}0001`;
    }

    const latestData = snapshot.docs[0].data();
    const latestReceipt = latestData.receiptNumber || '';
    const match = latestReceipt.match(/LEE-(\d{4})-(\d+)/);

    if (match && parseInt(match[1], 10) === currentYear) {
      const nextNum = parseInt(match[2], 10) + 1;
      return `${prefix}${String(nextNum).padStart(4, '0')}`;
    }

    return `${prefix}0001`;
  } catch (err) {
    console.error('Error in generateNextReceiptNumber:', err);
    // Unique fallback based on timestamp to avoid collision
    const timestampSuffix = String(Date.now()).slice(-4);
    return `${prefix}${timestampSuffix}`;
  }
}

/**
 * Fetches all payments for a specific member, sorted newest first.
 * Does not require composite index because sorting is done in memory.
 *
 * @param {string} memberId - Member custom ID (e.g. "LEE001")
 * @param {string} [memberDocId] - Firestore Document ID if different
 * @returns {Promise<Array>} List of payment objects
 */
export async function getMemberPayments(memberId, memberDocId = null) {
  if (!memberId && !memberDocId) return [];

  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const paymentMap = new Map();

  // 1. Query by memberId
  if (memberId) {
    try {
      const q1 = query(paymentsRef, where('memberId', '==', String(memberId).trim()));
      const snap1 = await getDocs(q1);
      snap1.forEach((document) => {
        paymentMap.set(document.id, {
          id: document.id,
          docId: document.id,
          ...document.data(),
        });
      });
    } catch (err) {
      console.warn('Error querying payments by memberId:', err);
    }
  }

  // 2. Query by memberDocId if provided and different
  if (memberDocId && memberDocId !== memberId) {
    try {
      const q2 = query(paymentsRef, where('memberDocId', '==', String(memberDocId).trim()));
      const snap2 = await getDocs(q2);
      snap2.forEach((document) => {
        if (!paymentMap.has(document.id)) {
          paymentMap.set(document.id, {
            id: document.id,
            docId: document.id,
            ...document.data(),
          });
        }
      });
    } catch (err) {
      console.warn('Error querying payments by memberDocId:', err);
    }
  }

  const list = Array.from(paymentMap.values());

  // Sort newest first by paymentDate, then createdAt, then receiptNumber
  list.sort((a, b) => {
    const getTime = (val) => {
      if (!val) return 0;
      if (val.toDate) return val.toDate().getTime();
      const d = new Date(typeof val === 'string' && !val.includes('T') ? val + 'T12:00:00' : val);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    const timeA = getTime(a.paymentDate);
    const timeB = getTime(b.paymentDate);
    if (timeB !== timeA) return timeB - timeA;

    const createdA = getTime(a.createdAt);
    const createdB = getTime(b.createdAt);
    if (createdB !== createdA) return createdB - createdA;

    return (b.receiptNumber || '').localeCompare(a.receiptNumber || '');
  });

  return list;
}

/**
 * Records a payment atomically using a Firestore transaction.
 * Creates the payment document and updates the member's balance in one atomic commit.
 *
 * @param {Object} paymentInput
 * @param {string} paymentInput.memberDocId - Firestore Document ID of member
 * @param {string} [paymentInput.memberId] - Human-readable member code (e.g. LEE001)
 * @param {number|string} paymentInput.amount - Amount collected
 * @param {string} [paymentInput.paymentMode='Cash'] - Mode: Cash / UPI / Online
 * @param {string} [paymentInput.paymentDate] - Date string YYYY-MM-DD
 * @param {string} [paymentInput.notes] - Optional note/reference
 * @returns {Promise<Object>} Created payment record with receiptNumber
 */
export async function addPayment(paymentInput) {
  const {
    memberDocId,
    memberId,
    amount,
    paymentMode = 'Cash',
    paymentDate,
    notes = '',
  } = paymentInput;

  if (!memberDocId) {
    throw new Error('Member document ID is required.');
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }

  // 1. Generate receipt number before transaction
  const receiptNumber = await generateNextReceiptNumber();

  const todayStr = new Date().toISOString().split('T')[0];
  const dateStr = paymentDate || todayStr;
  const paymentTimestamp = Timestamp.fromDate(
    new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`)
  );

  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);
  const paymentDocRef = doc(collection(db, PAYMENTS_COLLECTION));

  let finalPaymentRecord = null;
  let updatedMemberData = null;

  // 2. Atomic Transaction: Read member -> Validate & Compute -> Write payment & member
  await runTransaction(db, async (transaction) => {
    const memberSnap = await transaction.get(memberRef);
    if (!memberSnap.exists()) {
      throw new Error('Member not found in Firestore.');
    }

    const memberData = memberSnap.data();

    // Previous due calculation
    const currentPayable = Number(
      memberData.amountPayable ||
      (Number(memberData.admissionAmount || 0) + Number(memberData.planAmount || 0))
    );
    const currentCollected = Number(memberData.amountCollected || 0);
    const previousDue = Number(
      memberData.dueAmount !== undefined
        ? memberData.dueAmount
        : Math.max(0, currentPayable - currentCollected)
    );

    // Validate that payment does not exceed due amount (avoiding negative balance)
    if (previousDue > 0 && numAmount > previousDue) {
      throw new Error(
        `Payment amount (₹${numAmount}) cannot exceed current outstanding due amount (₹${previousDue}).`
      );
    }
    if (previousDue === 0) {
      throw new Error('This member currently has no outstanding due amount (Due: ₹0).');
    }

    const remainingDue = Math.max(0, previousDue - numAmount);
    const newCollected = currentCollected + numAmount;

    // Payment document payload (full receipt info for future PDF)
    const paymentDoc = {
      receiptNumber,
      memberId: memberData.memberId || memberId || memberDocId,
      memberDocId,
      memberName: memberData.name || '',
      memberPhone: memberData.mobile || '',
      memberCode: memberData.memberId || memberId || memberDocId,
      amountPaid: numAmount,
      paymentMode,
      paymentDate: paymentTimestamp,
      paymentDateStr: dateStr,
      planName: memberData.planName || '',
      planId: memberData.planId || '',
      membershipStartDate: memberData.joiningDate || '',
      membershipExpiryDate: memberData.expiryDate || '',
      previousDueAmount: previousDue,
      remainingDueAmount: remainingDue,
      admissionFee: Number(memberData.admissionAmount || 0),
      notes: (notes || '').trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Member update payload
    const memberUpdate = {
      amountCollected: newCollected,
      dueAmount: remainingDue,
      amountDue: remainingDue,
      paymentMode,
      lastPaymentDate: dateStr,
      updatedAt: serverTimestamp(),
    };

    // Atomic Writes
    transaction.set(paymentDocRef, paymentDoc);
    transaction.update(memberRef, memberUpdate);

    finalPaymentRecord = {
      ...paymentDoc,
      id: paymentDocRef.id,
      docId: paymentDocRef.id,
      paymentDate: paymentTimestamp,
    };

    updatedMemberData = {
      ...memberUpdate,
      docId: memberDocId,
    };
  });

  return {
    payment: finalPaymentRecord,
    memberUpdate: updatedMemberData,
  };
}

/**
 * Retrieves a single payment document by ID
 * @param {string} paymentId 
 * @returns {Promise<Object|null>}
 */
export async function getPayment(paymentId) {
  if (!paymentId) return null;
  const paymentRef = doc(db, PAYMENTS_COLLECTION, paymentId);
  const snap = await getDoc(paymentRef);
  if (!snap.exists()) return null;
  return { id: snap.id, docId: snap.id, ...snap.data() };
}

/**
 * Fetches all payments from Firestore (newest first).
 * Intended for master reports or owner audit logs without real-time listeners.
 * @param {number} [maxCount=100] 
 * @returns {Promise<Array>}
 */
export async function getAllPayments(maxCount = 100) {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const q = query(paymentsRef, orderBy('createdAt', 'desc'), limit(maxCount));
  const snap = await getDocs(q);
  const list = [];
  snap.forEach((document) => {
    list.push({ id: document.id, docId: document.id, ...document.data() });
  });
  return list;
}
