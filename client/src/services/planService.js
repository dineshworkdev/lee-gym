/**
 * Lee Gym — Plan Service (Firestore)
 * Collection: `plans`
 * Fields per document:
 *   name         {string}   Plan display name
 *   price        {number}   Plan fee in Rs.
 *   durationDays {number}   Duration in days
 *   admissionFee {number}   Admission fee (0 for most plans)
 *   status       {string}   'Active' | 'Inactive'
 *   description  {string}   Plan description
 *   features     {string[]} Included features
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
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const PLANS_COLLECTION = 'plans';

/**
 * Default authentic plans to seed on first load (when Firestore plans collection is empty).
 */
export const DEFAULT_PLANS_SEED = [
  {
    name: 'Monthly',
    price: 1000,
    durationDays: 30,
    admissionFee: 500,
    status: 'Active',
    description: 'Monthly gym membership. Admission fee: ₹500 (applicable only to Monthly plan).',
    features: ['Standard gym access', 'Cardio & strength floor', 'Locker & shower facilities', 'Introductory fitness assessment'],
  },
  {
    name: '3+1',
    price: 3500,
    durationDays: 120,
    admissionFee: 0,
    status: 'Active',
    description: '3+1 months membership plan. ₹0 admission fee.',
    features: ['4 full months training', 'Zero admission fee', 'Full facility access', 'Workout routine guidance'],
  },
  {
    name: '6 Months',
    price: 5000,
    durationDays: 180,
    admissionFee: 0,
    status: 'Active',
    description: '6 months membership plan. ₹0 admission fee.',
    features: ['Half-yearly disciplined access', 'Zero admission fee', 'Progressive strength coaching tips', 'Priority equipment access'],
  },
  {
    name: '1 Year',
    price: 8500,
    durationDays: 365,
    admissionFee: 0,
    status: 'Active',
    description: '1 year membership plan. ₹0 admission fee.',
    features: ['365 days unlimited training', 'Best annual value', 'Zero admission fee', 'Comprehensive physical conditioning support'],
  },
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
    description: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
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
 * Fetches all plans from Firestore (owner portal).
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
 * Fetches only Active plans for public website consumption.
 * Accessible to public unauthenticated visitors per firestore.rules.
 * @returns {Promise<Array>}
 */
export async function getActivePlans() {
  try {
    const plansRef = collection(db, PLANS_COLLECTION);
    const q = query(plansRef, where('status', '==', 'Active'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return DEFAULT_PLANS_SEED.map((p, index) => ({ id: `default-plan-${index + 1}`, ...p }));
    }

    const list = [];
    snapshot.forEach((d) => list.push(normalisePlan(d)));
    return list.sort((a, b) => a.durationDays - b.durationDays);
  } catch (err) {
    console.error('Error in getActivePlans:', err);
    throw err;
  }
}

/**
 * Adds a new plan to Firestore.
 * @param {Object} planData
 * @returns {Promise<Object>}
 */
export async function addPlan(planData) {
  const plansRef = collection(db, PLANS_COLLECTION);
  const payload = {
    name: String(planData.name || '').trim(),
    price: Number(planData.price) || 0,
    durationDays: Number(planData.durationDays) || 30,
    admissionFee: Number(planData.admissionFee || 0),
    description: String(planData.description || '').trim(),
    features: Array.isArray(planData.features) ? planData.features : [],
    status: 'Active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(plansRef, payload);
  return {
    id: docRef.id,
    ...payload,
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
  if (planData.description !== undefined)  payload.description  = String(planData.description).trim();
  if (planData.features !== undefined)     payload.features     = Array.isArray(planData.features) ? planData.features : [];
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
