import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js';
import { generateNextReceiptNumber } from './paymentService.js';
import {
  calculateExpiryDate,
  calculateRenewalDates,
  calculateResumeExtension,
  getTodayDateStr,
} from '../utils/membershipRules.js';

const MEMBERS_COLLECTION = 'members';
const PAYMENTS_COLLECTION = 'payments';

/**
 * Validates and uploads a member profile photo to Firebase Storage
 * Storage structure: members/{memberId}/profile.jpg
 * @param {File} file 
 * @param {string} memberId 
 * @returns {Promise<string>} Download URL
 */
export async function uploadMemberPhoto(file, memberId) {
  if (!file) return '';

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, or WEBP).');
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB.');
  }

  const cleanMemberId = String(memberId).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const storagePath = `members/${cleanMemberId}/profile.jpg`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  return await getDownloadURL(snapshot.ref);
}

/**
 * Computes the next human-readable member ID (e.g. LEE001, LEE002...)
 * @param {Array} membersList 
 * @returns {string} e.g. "LEE001"
 */
export function generateNextMemberId(membersList = []) {
  let maxNum = 0;
  for (const m of membersList) {
    const rawId = m.memberId || m.id || '';
    const match = rawId.match(/LEE[-]?(\d+)/i);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `LEE${String(nextNum).padStart(3, '0')}`;
}

/**
 * Fetches all members from the Firestore members collection once
 * Free-tier optimization: no infinite listeners or redundant reads
 * @returns {Promise<Array>}
 */
export async function getMembersFromFirestore() {
  const membersRef = collection(db, MEMBERS_COLLECTION);
  const snapshot = await getDocs(membersRef);

  const list = [];
  snapshot.forEach((document) => {
    const data = document.data();
    const docId = document.id;
    const memberId = data.memberId || docId;

    const admissionAmount = Number(data.admissionAmount || 0);
    const planAmount = Number(data.planAmount || 0);
    const amountCollected = Number(data.amountCollected || 0);
    const amountPayable = Number(data.amountPayable || (admissionAmount + planAmount));
    const dueAmount = Number(data.dueAmount !== undefined ? data.dueAmount : Math.max(0, amountPayable - amountCollected));

    let expiryDateStr = data.expiryDate || '';
    if (data.expiryDate?.toDate) {
      expiryDateStr = data.expiryDate.toDate().toISOString().split('T')[0];
    }

    list.push({
      ...data,
      docId,
      id: memberId,
      memberId,
      photo: data.photoUrl || data.photo || null,
      photoUrl: data.photoUrl || '',
      admissionAmount,
      planAmount,
      amountPayable,
      amountCollected,
      dueAmount,
      amountDue: dueAmount,
      expiryDate: expiryDateStr,
      isFrozen: Boolean(data.isFrozen),
      isArchived: Boolean(data.isArchived),
      renewals: Array.isArray(data.renewals) ? data.renewals : [],
      freezeHistory: Array.isArray(data.freezeHistory) ? data.freezeHistory : [],
    });
  });

  list.sort((a, b) => {
    const aId = String(a.memberId || a.id || '');
    const bId = String(b.memberId || b.id || '');
    return bId.localeCompare(aId, undefined, { numeric: true });
  });

  return list;
}

/**
 * Adds a new member to Firestore and optionally uploads their profile photo
 * Uses atomic batch commit to save member record and initial payment
 * @param {Object} memberInput 
 * @param {File|null} photoFile 
 * @returns {Promise<Object>}
 */
export async function addMemberToFirestore(memberInput, photoFile = null) {
  const memberId = memberInput.memberId || memberInput.id;
  if (!memberId) {
    throw new Error('A unique member ID is required.');
  }

  let photoUrl = memberInput.photoUrl || '';
  if (photoFile) {
    try {
      photoUrl = await uploadMemberPhoto(photoFile, memberId);
    } catch (uploadError) {
      console.warn('Photo upload warning:', uploadError);
    }
  }

  const admissionAmount = Number(memberInput.admissionAmount || 0);
  const planAmount = Number(memberInput.planAmount || 0);
  const discount = Number(memberInput.discount || 0);
  const amountPayable = Math.max(0, admissionAmount + planAmount - discount);
  const amountCollected = Number(memberInput.amountCollected || 0);
  const dueAmount = Math.max(0, amountPayable - amountCollected);

  const todayStr = getTodayDateStr();
  const joiningDate = memberInput.joiningDate || todayStr;
  const durationDays = Number(memberInput.durationDays || 30);
  const expiryDate = memberInput.expiryDate || calculateExpiryDate(joiningDate, durationDays);

  const memberDoc = {
    memberId,
    name: (memberInput.name || '').trim(),
    mobile: (memberInput.mobile || '').trim(),
    gender: memberInput.gender || 'Male',
    dob: memberInput.dob || '',
    age: memberInput.age || (memberInput.dobOrAge ? String(memberInput.dobOrAge).trim() : ''),
    dobOrAge: memberInput.dobOrAge || '',
    photoUrl: photoUrl || '',
    height: memberInput.height ? String(memberInput.height).trim() : '',
    weight: memberInput.weight ? String(memberInput.weight).trim() : '',
    address: memberInput.address ? String(memberInput.address).trim() : '',
    joiningDate,
    paymentDate: memberInput.paymentDate || todayStr,
    planId: memberInput.planId || '',
    planName: memberInput.planName || '',
    durationDays,
    admissionAmount,
    planAmount,
    discount,
    amountPayable,
    amountCollected,
    dueAmount,
    paymentMode: memberInput.paymentMode || 'Cash',
    expiryDate,
    status: expiryDate >= todayStr ? 'active' : 'expired',
    isFrozen: false,
    isArchived: false,
    renewals: [],
    freezeHistory: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const membersRef = collection(db, MEMBERS_COLLECTION);
  const memberDocRef = doc(membersRef);
  const memberDocId = memberDocRef.id;

  const batch = writeBatch(db);
  batch.set(memberDocRef, memberDoc);

  let initialPayment = null;
  if (amountCollected > 0) {
    const receiptNumber = await generateNextReceiptNumber();
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const paymentDocRef = doc(paymentsRef);

    const paymentDateTimestamp = Timestamp.fromDate(
      new Date(
        memberDoc.paymentDate.includes('T')
          ? memberDoc.paymentDate
          : `${memberDoc.paymentDate}T12:00:00`
      )
    );

    const paymentDoc = {
      receiptNumber,
      memberId,
      memberDocId,
      memberName: memberDoc.name,
      memberPhone: memberDoc.mobile,
      memberCode: memberId,
      amountPaid: amountCollected,
      paymentMode: memberDoc.paymentMode,
      paymentDate: paymentDateTimestamp,
      paymentDateStr: memberDoc.paymentDate,
      planName: memberDoc.planName,
      planId: memberDoc.planId,
      membershipStartDate: memberDoc.joiningDate,
      membershipExpiryDate: memberDoc.expiryDate,
      previousDueAmount: amountPayable,
      remainingDueAmount: dueAmount,
      admissionFee: admissionAmount,
      notes: 'Initial admission & membership registration',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(paymentDocRef, paymentDoc);
    initialPayment = {
      ...paymentDoc,
      id: paymentDocRef.id,
      docId: paymentDocRef.id,
      paymentDate: paymentDateTimestamp,
    };
  }

  await batch.commit();

  return {
    ...memberDoc,
    docId: memberDocId,
    id: memberId,
    amountDue: dueAmount,
    photo: photoUrl || null,
    initialPayment,
  };
}

/**
 * Updates an existing member's profile in Firestore
 * @param {string} docId 
 * @param {Object} updatedFields 
 * @param {File|null} newPhotoFile 
 * @returns {Promise<Object>}
 */
export async function updateMemberInFirestore(docId, updatedFields, newPhotoFile = null) {
  if (!docId) throw new Error('Document ID is required for update.');

  const payload = { ...updatedFields };

  if (newPhotoFile && payload.memberId) {
    try {
      const url = await uploadMemberPhoto(newPhotoFile, payload.memberId);
      payload.photoUrl = url;
      payload.photo = url;
    } catch (err) {
      console.warn('Photo update warning:', err);
    }
  }

  if (payload.planAmount !== undefined || payload.admissionAmount !== undefined || payload.amountCollected !== undefined || payload.discount !== undefined) {
    const admission = Number(payload.admissionAmount || 0);
    const planFee = Number(payload.planAmount || 0);
    const disc = Number(payload.discount || 0);
    const payable = Math.max(0, admission + planFee - disc);
    const collected = Number(payload.amountCollected || 0);
    payload.amountPayable = payable;
    payload.amountCollected = collected;
    payload.dueAmount = Math.max(0, payable - collected);
    payload.amountDue = payload.dueAmount;
  }

  if (payload.expiryDate) {
    const todayStr = getTodayDateStr();
    payload.status = payload.expiryDate >= todayStr ? 'active' : 'expired';
  }

  payload.updatedAt = serverTimestamp();

  const firestoreData = { ...payload };
  delete firestoreData.docId;
  delete firestoreData.id;
  delete firestoreData.photo;

  const memberRef = doc(db, MEMBERS_COLLECTION, docId);
  await updateDoc(memberRef, firestoreData);

  return payload;
}

/**
 * Executes a membership renewal atomically.
 * Updates the member document with the new plan and extended dates,
 * appends to the immutable renewal history, and creates a payment record.
 *
 * @param {Object} renewalInput
 * @returns {Promise<Object>}
 */
export async function renewMemberInFirestore(renewalInput) {
  const {
    memberDocId,
    memberId,
    plan,
    startDate,
    durationDays,
    expiryDate,
    planAmount,
    discount = 0,
    amountCollected = 0,
    paymentMode = 'Cash',
    paymentDate = getTodayDateStr(),
    notes = '',
    renewedBy = 'Owner',
  } = renewalInput;

  if (!memberDocId) throw new Error('Member document ID is required for renewal.');
  if (!plan?.name) throw new Error('Active plan selection is required.');

  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);
  const memberSnap = await getDoc(memberRef);
  if (!memberSnap.exists()) throw new Error('Member record not found.');

  const existingData = memberSnap.data();

  // Financial calculations for renewal
  const pFee = Number(planAmount || plan.price || 0);
  const disc = Number(discount || 0);
  const newPayable = Math.max(0, pFee - disc);
  const collectedNow = Number(amountCollected || 0);

  // Carry forward any previous unpaid balance
  const previousUnpaidDue = Number(existingData.dueAmount || 0);
  const totalCombinedDue = previousUnpaidDue + newPayable;
  const remainingDue = Math.max(0, totalCombinedDue - collectedNow);
  const totalLifetimeCollected = Number(existingData.amountCollected || 0) + collectedNow;

  // Generate unique receipt number
  let receiptNumber = null;
  let paymentDocRef = null;
  let paymentDoc = null;

  const batch = writeBatch(db);

  if (collectedNow > 0) {
    receiptNumber = await generateNextReceiptNumber();
    paymentDocRef = doc(collection(db, PAYMENTS_COLLECTION));

    const pTimestamp = Timestamp.fromDate(
      new Date(paymentDate.includes('T') ? paymentDate : `${paymentDate}T12:00:00`)
    );

    paymentDoc = {
      receiptNumber,
      memberId: existingData.memberId || memberId || memberDocId,
      memberDocId,
      memberName: existingData.name || '',
      memberPhone: existingData.mobile || '',
      memberCode: existingData.memberId || memberId,
      amountPaid: collectedNow,
      paymentMode,
      paymentDate: pTimestamp,
      paymentDateStr: paymentDate,
      planName: plan.name,
      planId: plan.id,
      membershipStartDate: startDate,
      membershipExpiryDate: expiryDate,
      previousDueAmount: totalCombinedDue,
      remainingDueAmount: remainingDue,
      admissionFee: 0,
      notes: notes || `Membership Renewal: ${plan.name}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(paymentDocRef, paymentDoc);
  }

  // Renewal history record
  const renewalRecord = {
    planId: plan.id,
    planName: plan.name,
    startDate,
    expiryDate,
    durationDays: Number(durationDays || plan.durationDays || 30),
    planPrice: pFee,
    discount: disc,
    amountPaid: collectedNow,
    receiptNumber: receiptNumber || 'UNPAID',
    paymentMode,
    notes,
    renewedAt: new Date().toISOString(),
    renewedBy,
  };

  const existingRenewals = Array.isArray(existingData.renewals) ? existingData.renewals : [];
  const updatedRenewals = [renewalRecord, ...existingRenewals];

  const todayStr = getTodayDateStr();
  const memberUpdate = {
    planId: plan.id,
    planName: plan.name,
    durationDays: Number(durationDays || plan.durationDays || 30),
    planAmount: pFee,
    amountPayable: Number(existingData.amountPayable || 0) + newPayable,
    amountCollected: totalLifetimeCollected,
    dueAmount: remainingDue,
    amountDue: remainingDue,
    expiryDate,
    status: expiryDate >= todayStr ? 'active' : 'expired',
    isFrozen: false,
    renewals: updatedRenewals,
    lastRenewalDate: todayStr,
    updatedAt: serverTimestamp(),
  };

  batch.update(memberRef, memberUpdate);
  await batch.commit();

  return {
    success: true,
    memberUpdate: { ...memberUpdate, docId: memberDocId },
    payment: paymentDoc ? { ...paymentDoc, id: paymentDocRef.id, docId: paymentDocRef.id } : null,
    renewalRecord,
  };
}

/**
 * Freezes an active membership
 * @param {string} memberDocId 
 * @param {Object} freezeData { startDate, expectedEndDate, reason, frozenBy }
 */
export async function freezeMemberInFirestore(memberDocId, freezeData) {
  if (!memberDocId) throw new Error('Member document ID is required');
  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);

  const payload = {
    isFrozen: true,
    freezeInfo: {
      startDate: freezeData.startDate || getTodayDateStr(),
      expectedEndDate: freezeData.expectedEndDate || '',
      reason: freezeData.reason || 'Medical / Personal leave',
      frozenAt: new Date().toISOString(),
      frozenBy: freezeData.frozenBy || 'Owner',
    },
    updatedAt: serverTimestamp(),
  };

  await updateDoc(memberRef, payload);
  return payload;
}

/**
 * Resumes a frozen membership and automatically extends the expiry date
 * @param {string} memberDocId 
 * @param {Object} currentMember 
 * @param {string} [resumeDate] 
 * @param {string} [resumedBy='Owner'] 
 */
export async function resumeMemberInFirestore(memberDocId, currentMember, resumeDate = getTodayDateStr(), resumedBy = 'Owner') {
  if (!memberDocId) throw new Error('Member document ID is required');
  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);

  const freezeInfo = currentMember.freezeInfo || {};
  const freezeStartDate = freezeInfo.startDate || getTodayDateStr();

  const { actualFrozenDays, newExpiryDate } = calculateResumeExtension(
    currentMember.expiryDate,
    freezeStartDate,
    resumeDate
  );

  const freezeRecord = {
    startDate: freezeStartDate,
    endDate: resumeDate,
    actualFrozenDays,
    reason: freezeInfo.reason || 'Frozen',
    resumedBy,
    resumedAt: new Date().toISOString(),
  };

  const existingHistory = Array.isArray(currentMember.freezeHistory) ? currentMember.freezeHistory : [];
  const updatedHistory = [freezeRecord, ...existingHistory];

  const payload = {
    isFrozen: false,
    freezeInfo: null,
    expiryDate: newExpiryDate,
    freezeHistory: updatedHistory,
    status: newExpiryDate >= getTodayDateStr() ? 'active' : 'expired',
    updatedAt: serverTimestamp(),
  };

  await updateDoc(memberRef, payload);
  return { ...payload, actualFrozenDays, newExpiryDate };
}

/**
 * Safely archives a member (preserving financial & audit history)
 * @param {string} memberDocId 
 * @param {string} [reason=''] 
 * @param {string} [archivedBy='Owner'] 
 */
export async function archiveMemberInFirestore(memberDocId, reason = '', archivedBy = 'Owner') {
  if (!memberDocId) throw new Error('Member document ID is required');
  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);

  const payload = {
    isArchived: true,
    archivedAt: new Date().toISOString(),
    archiveReason: reason || 'Member inactive / departed',
    archivedBy,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(memberRef, payload);
  return payload;
}

/**
 * Restores an archived member back to active directory
 * @param {string} memberDocId 
 */
export async function restoreMemberInFirestore(memberDocId) {
  if (!memberDocId) throw new Error('Member document ID is required');
  const memberRef = doc(db, MEMBERS_COLLECTION, memberDocId);

  const payload = {
    isArchived: false,
    archivedAt: null,
    archiveReason: null,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(memberRef, payload);
  return payload;
}

/**
 * Permanently deletes a member from Firestore
 * @param {string} docId 
 */
export async function deleteMemberFromFirestore(docId) {
  if (!docId) throw new Error('Document ID is required for deletion.');
  const memberRef = doc(db, MEMBERS_COLLECTION, docId);
  await deleteDoc(memberRef);
}
