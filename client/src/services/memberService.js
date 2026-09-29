import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js';
import { generateNextReceiptNumber, addPayment } from './paymentService.js';

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

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, or WEBP).');
  }

  // Validate size (max 5MB)
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
 * based on already loaded members list
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
 * Designed for free-tier optimization: no infinite listeners or redundant reads
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

    // Convert expiry date string if needed
    let expiryDateStr = data.expiryDate || '';
    if (data.expiryDate?.toDate) {
      expiryDateStr = data.expiryDate.toDate().toISOString().split('T')[0];
    }

    list.push({
      ...data,
      docId,
      id: memberId, // For compatibility with existing components
      memberId,
      photo: data.photoUrl || data.photo || null,
      photoUrl: data.photoUrl || '',
      admissionAmount,
      planAmount,
      amountPayable,
      amountCollected,
      dueAmount,
      amountDue: dueAmount, // Compatibility fallback
      expiryDate: expiryDateStr,
    });
  });

  // Sort descending by memberId or creation time
  list.sort((a, b) => {
    const aId = String(a.memberId || a.id || '');
    const bId = String(b.memberId || b.id || '');
    return bId.localeCompare(aId, undefined, { numeric: true });
  });

  return list;
}

/**
 * Adds a new member to Firestore and optionally uploads their profile photo
 * @param {Object} memberInput 
 * @param {File|null} photoFile 
 * @returns {Promise<Object>} The created member with document ID
 */
export async function addMemberToFirestore(memberInput, photoFile = null) {
  const memberId = memberInput.memberId || memberInput.id;
  if (!memberId) {
    throw new Error('A unique member ID is required.');
  }

  // 1. Upload photo if provided
  let photoUrl = memberInput.photoUrl || '';
  if (photoFile) {
    try {
      photoUrl = await uploadMemberPhoto(photoFile, memberId);
    } catch (uploadError) {
      console.warn('Photo upload warning:', uploadError);
      // We don't break member creation if photo fails, but inform
    }
  }

  // 2. Calculate financial amounts
  const admissionAmount = Number(memberInput.admissionAmount || 0);
  const planAmount = Number(memberInput.planAmount || 0);
  const amountPayable = admissionAmount + planAmount;
  const amountCollected = Number(memberInput.amountCollected || 0);
  const dueAmount = Math.max(0, amountPayable - amountCollected);

  // 3. Determine status from expiryDate
  const todayStr = new Date().toISOString().split('T')[0];
  const expiryDate = memberInput.expiryDate || todayStr;
  const status = expiryDate >= todayStr ? 'active' : 'expired';

  // 4. Build document payload matching specifications
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
    joiningDate: memberInput.joiningDate || todayStr,
    paymentDate: memberInput.paymentDate || todayStr,
    planId: memberInput.planId || '',
    planName: memberInput.planName || '',
    admissionAmount,
    planAmount,
    amountCollected,
    dueAmount,
    paymentMode: memberInput.paymentMode || 'Cash',
    expiryDate,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // 5. Save to Firestore atomically with initial payment record if payment was made
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
      notes: 'Initial admission & membership payment',
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
    amountPayable,
    amountDue: dueAmount,
    photo: photoUrl || null,
    initialPayment,
  };
}

/**
 * Updates an existing member in Firestore
 * @param {string} docId 
 * @param {Object} updatedFields 
 * @param {File|null} newPhotoFile 
 * @returns {Promise<Object>}
 */
export async function updateMemberInFirestore(docId, updatedFields, newPhotoFile = null) {
  if (!docId) throw new Error('Document ID is required for update.');

  const payload = { ...updatedFields };

  // Upload new photo if provided
  if (newPhotoFile && payload.memberId) {
    try {
      const url = await uploadMemberPhoto(newPhotoFile, payload.memberId);
      payload.photoUrl = url;
      payload.photo = url;
    } catch (err) {
      console.warn('Photo update warning:', err);
    }
  }

  // Recalculate financial fields if amounts changed
  if (payload.planAmount !== undefined || payload.admissionAmount !== undefined || payload.amountCollected !== undefined) {
    const admission = Number(payload.admissionAmount || 0);
    const planFee = Number(payload.planAmount || 0);
    const payable = admission + planFee;
    const collected = Number(payload.amountCollected || 0);
    payload.amountPayable = payable;
    payload.amountCollected = collected;
    payload.dueAmount = Math.max(0, payable - collected);
    payload.amountDue = payload.dueAmount;
  }

  // Recalculate status if expiryDate changed
  if (payload.expiryDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    payload.status = payload.expiryDate >= todayStr ? 'active' : 'expired';
  }

  payload.updatedAt = serverTimestamp();

  // Strip local temporary fields not needed in doc update
  const firestoreData = { ...payload };
  delete firestoreData.docId;
  delete firestoreData.id;
  delete firestoreData.photo;

  const memberRef = doc(db, MEMBERS_COLLECTION, docId);
  await updateDoc(memberRef, firestoreData);

  return payload;
}

/**
 * Records a partial or full payment for a member using an atomic Firestore transaction.
 * @param {string} docId - Member Firestore document ID
 * @param {Object} currentMember - In-memory member object
 * @param {number|string} paymentAmount - Amount collected
 * @param {string} [paymentMode='Cash'] - Mode of payment (Cash, UPI, etc.)
 * @param {string} [paymentDate] - Date string YYYY-MM-DD
 * @param {string} [notes=''] - Optional note
 * @returns {Promise<Object>}
 */
export async function recordPaymentInFirestore(
  docId,
  currentMember,
  paymentAmount,
  paymentMode = 'Cash',
  paymentDate = null,
  notes = ''
) {
  const result = await addPayment({
    memberDocId: docId,
    memberId: currentMember.memberId || currentMember.id,
    amount: paymentAmount,
    paymentMode,
    paymentDate,
    notes,
  });

  return {
    ...result.memberUpdate,
    payment: result.payment,
  };
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
