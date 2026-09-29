/**
 * Lee Gym — Plan Service (Firestore)
 * Collection: `plans`
 * Fields per document:
 *   name         {string}   Plan display name
 *   price        {number}   Plan fee in Rs.
 *   durationDays {number}   Duration in days
 *   admissionFee {number}   Admission fee (0 for most plans)
 *   status       {string}   'Active' | 'Inactive'
 *   createdAt    {Timestamp}
 *   updatedAt    {Timestamp}
 *
 * Firestore document IDs are auto-generated.
 * The `id` field returned in JS objects is the Firestore document ID.
 *
 * Free-tier optimization: no realtime listeners; single getDocs() reads only.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const PLANS_COLLECTION = 'plans';

/**
 * Default plans to seed on first load (when Firestore plans collection is empty).
 * These match the INITIAL_PLANS that were previously in OwnerGymContext.
 */
export const DEFAULT_PLANS_SEED = [
  { name: 'Monthly',  price: 1000, durationDays: 30,  admissionFee: 500, status: 'Active' },
  { name: '3+1',      price: 3500, durationDays: 120, admissionFee: 0,   status: 'Active' },
  { name: '6 Months', price: 5000, durationDays: 180, admissionFee: 0,   status: 'Active' },
  { name: '1 Year',   price: 8500, durationDays: 365, admissionFee: 0,   status: 'Active' },
];

/**
 * Normalises a Firestore snapshot doc into a plain JS plan object.
 */
function normalisePlan(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name || '',
    price: Number(data.price || 0),
    durationDays: Number(data.durationDays || 30),
    admissionFee: Number(data.admissionFee || 0),
    status: data.status || 'Active',
  };
}

/**
 * Seeds the default plans into Firestore once (only called when collection is empty).
 */
async function seedDefaultPlans() {
  const plansRef = collection(db, PLANS_COLLECTION);
  for (const plan of DEFAULT_PLANS_SEED) {
    await addDoc(plansRef, {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Fetches all plans from Firestore (single read, no realtime listener).
 * Seeds default plans automatically on first load when collection is empty.
 * @returns {Promise<Array>}
 */
export async function getPlans() {
  const plansRef = collection(db, PLANS_COLLECTION);
  const snapshot = await getDocs(query(plansRef, orderBy('createdAt', 'asc')));

  // Seed defaults on first load when collection is empty
  if (snapshot.empty) {
    await seedDefaultPlans();
    const seededSnapshot = await getDocs(query(plansRef, orderBy('createdAt', 'asc')));
    const list = [];
    seededSnapshot.forEach((d) => list.push(normalisePlan(d)));
    return list;
  }

  const list = [];
  snapshot.forEach((d) => list.push(normalisePlan(d)));
  return list;
}

/**
 * Adds a new plan to Firestore.
 * @param {{ name: string, price: string|number, durationDays: string|number, admissionFee?: number }} planData
 * @returns {Promise<Object>} The created plan with its Firestore document ID as `id`
 */
export async function addPlan(planData) {
  const plansRef = collection(db, PLANS_COLLECTION);
  const payload = {
    name: String(planData.name || '').trim(),
    price: Number(planData.price) || 0,
    durationDays: Number(planData.durationDays) || 30,
    admissionFee: Number(planData.admissionFee || 0),
    status: 'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(plansRef, payload);
  return {
    id: docRef.id,
    name: payload.name,
    price: payload.price,
    durationDays: payload.durationDays,
    admissionFee: payload.admissionFee,
    status: payload.status,
  };
}

/**
 * Updates an existing Firestore plan document.
 * @param {string} planId Firestore document ID
 * @param {Object} planData Fields to update
 * @returns {Promise<void>}
 */
export async function updatePlan(planId, planData) {
  if (!planId) throw new Error('Plan document ID is required for update.');
  const planRef = doc(db, PLANS_COLLECTION, planId);
  const payload = {};
  if (planData.name !== undefined)         payload.name         = String(planData.name).trim();
  if (planData.price !== undefined)        payload.price        = Number(planData.price);
  if (planData.durationDays !== undefined) payload.durationDays = Number(planData.durationDays);
  if (planData.admissionFee !== undefined) payload.admissionFee = Number(planData.admissionFee);
  if (planData.status !== undefined)       payload.status       = planData.status;
  payload.updatedAt = serverTimestamp();
  await updateDoc(planRef, payload);
}

/**
 * Permanently deletes a plan document from Firestore.
 * @param {string} planId Firestore document ID
 * @returns {Promise<void>}
 */
export async function deletePlan(planId) {
  if (!planId) throw new Error('Plan document ID is required for deletion.');
  const planRef = doc(db, PLANS_COLLECTION, planId);
  await deleteDoc(planRef);
}
