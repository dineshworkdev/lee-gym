/**
 * Lee Gym — Staff Service (Firestore)
 * Collection: `staff`
 * Fields:
 *   uid          {string}   Firebase Auth UID
 *   email        {string}   Staff email
 *   name         {string}   Staff full name
 *   phone        {string}   Phone number
 *   role         {string}   'Owner' | 'Receptionist' | 'Trainer'
 *   status       {string}   'Active' | 'Inactive'
 *   notes        {string}   Internal notes
 *   createdAt    {Timestamp}
 *   updatedAt    {Timestamp}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const STAFF_COLLECTION = 'staff';
export const OWNER_BOOTSTRAP_EMAIL = 'leegym.website@gmail.com';

export const STAFF_ROLES = {
  OWNER: 'Owner',
  RECEPTIONIST: 'Receptionist',
  TRAINER: 'Trainer',
};

/**
 * Normalises staff document from Firestore snapshot
 */
function normaliseStaff(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    uid: docSnap.id,
    email: data.email || '',
    name: data.name || '',
    phone: data.phone || '',
    role: data.role || 'Receptionist',
    status: data.status || 'Active',
    notes: data.notes || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Gets a staff profile by Firebase Auth UID.
 * If user is the primary gym owner email and not yet in Firestore, bootstraps an Owner record.
 * @param {string} uid 
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export async function getStaffProfile(uid, email = '') {
  if (!uid) return null;

  const staffRef = doc(db, STAFF_COLLECTION, uid);
  const snap = await getDoc(staffRef);

  if (snap.exists()) {
    return normaliseStaff(snap);
  }

  // Bootstrap initial Owner record if authenticated as primary gym owner
  if (email && email.toLowerCase() === OWNER_BOOTSTRAP_EMAIL.toLowerCase()) {
    const defaultOwner = {
      email,
      name: 'Gym Owner',
      phone: '+91 62387 69097',
      role: 'Owner',
      status: 'Active',
      notes: 'Primary Gym Owner (Super Admin)',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(staffRef, defaultOwner);
      return { id: uid, uid, ...defaultOwner };
    } catch (err) {
      console.warn('Could not auto-write staff profile for owner:', err);
      return { id: uid, uid, ...defaultOwner };
    }
  }

  return {
    id: uid,
    uid,
    email,
    name: email.split('@')[0],
    role: email.toLowerCase() === OWNER_BOOTSTRAP_EMAIL.toLowerCase() ? 'Owner' : 'Receptionist',
    status: 'Active',
  };
}

/**
 * Fetches all staff members from Firestore
 * @returns {Promise<Array>}
 */
export async function getStaffList() {
  const staffRef = collection(db, STAFF_COLLECTION);
  const snap = await getDocs(query(staffRef, orderBy('createdAt', 'asc')));
  const list = [];
  snap.forEach((d) => list.push(normaliseStaff(d)));
  return list;
}

/**
 * Adds or provisions a new staff member in Firestore
 * @param {Object} staffInput 
 * @returns {Promise<Object>}
 */
export async function saveStaffMember(staffInput) {
  const staffId = staffInput.uid || staffInput.id || doc(collection(db, STAFF_COLLECTION)).id;
  const staffRef = doc(db, STAFF_COLLECTION, staffId);

  const payload = {
    email: (staffInput.email || '').trim().toLowerCase(),
    name: (staffInput.name || '').trim(),
    phone: (staffInput.phone || '').trim(),
    role: staffInput.role || 'Receptionist',
    status: staffInput.status || 'Active',
    notes: (staffInput.notes || '').trim(),
    updatedAt: serverTimestamp(),
  };

  const existing = await getDoc(staffRef);
  if (!existing.exists()) {
    payload.createdAt = serverTimestamp();
    await setDoc(staffRef, payload);
  } else {
    await updateDoc(staffRef, payload);
  }

  return { id: staffId, uid: staffId, ...payload };
}

/**
 * Updates an existing staff member's role or status
 * @param {string} staffId 
 * @param {Object} updateData 
 */
export async function updateStaffMember(staffId, updateData) {
  if (!staffId) throw new Error('Staff ID required');
  const staffRef = doc(db, STAFF_COLLECTION, staffId);
  const payload = {
    ...updateData,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(staffRef, payload);
}

/**
 * Deletes a staff member from Firestore
 * @param {string} staffId 
 */
export async function deleteStaffMember(staffId) {
  if (!staffId) throw new Error('Staff ID required');
  const staffRef = doc(db, STAFF_COLLECTION, staffId);
  await deleteDoc(staffRef);
}
