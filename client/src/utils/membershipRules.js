/**
 * Lee Gym — Centralized Membership Business Logic & Date Calculations
 *
 * Expiry Rule:
 * Expiry date is inclusive (the member is permitted to train through 23:59:59 of their expiry date).
 * On expiryDate + 1 day, the membership is considered Expired.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 * @returns {string} e.g. "2026-10-09"
 */
export function getTodayDateStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes any date value (string, Date, Firestore Timestamp) to "YYYY-MM-DD"
 * @param {string|Date|Object} dateVal 
 * @returns {string} "YYYY-MM-DD" or ""
 */
export function normalizeDateStr(dateVal) {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    if (dateVal.includes('T')) return dateVal.split('T')[0];
    return dateVal;
  }
  if (dateVal?.toDate && typeof dateVal.toDate === 'function') {
    const d = dateVal.toDate();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, '0');
    const day = String(dateVal.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(dateVal);
}

/**
 * Parses YYYY-MM-DD into a local Date object set to noon (avoids DST/timezone midnight edge-cases)
 * @param {string} dateStr 
 * @returns {Date}
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = clean.split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }
  return new Date(dateStr);
}

/**
 * Formats a date nicely for UI presentation, e.g. "09 Oct 2026"
 * @param {string|Date|Object} dateVal 
 * @returns {string}
 */
export function formatDateDisplay(dateVal) {
  if (!dateVal) return '—';
  const cleanStr = normalizeDateStr(dateVal);
  const d = parseLocalDate(cleanStr);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Adds an integer number of days to a YYYY-MM-DD date string
 * @param {string} dateStr 
 * @param {number} days 
 * @returns {string} YYYY-MM-DD
 */
export function addDaysToDate(dateStr, days) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + Number(days));
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates days difference: targetDate - baseDate (in whole days)
 * Positive if targetDate is in the future.
 * @param {string|Date} targetDateVal 
 * @param {string|Date} baseDateVal 
 * @returns {number}
 */
export function getDaysDifference(targetDateVal, baseDateVal = getTodayDateStr()) {
  const target = parseLocalDate(normalizeDateStr(targetDateVal));
  const base = parseLocalDate(normalizeDateStr(baseDateVal));
  const diffMs = target.getTime() - base.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculates expiry date given a start date and duration in days.
 * An inclusive duration of N days:
 * If a 30-day plan starts on 2026-10-01, day 1 is Oct 1, day 30 is Oct 30.
 * (start + durationDays - 1) gives inclusive end date.
 * If 1 month plan starts on Oct 1 and runs 30 days -> expires Oct 30.
 * @param {string} startDateStr 
 * @param {number} durationDays 
 * @returns {string} YYYY-MM-DD
 */
export function calculateExpiryDate(startDateStr, durationDays) {
  const days = Math.max(1, Number(durationDays) || 30);
  return addDaysToDate(startDateStr, days - 1);
}

/**
 * Calculates renewal start date and new expiry date.
 * Rules:
 * - If currently active (expiryDate >= today), renewals start seamlessly on (expiryDate + 1 day).
 * - If expired (expiryDate < today), renewal starts on today (or chosen custom start date).
 * - If owner explicitly chooses a customStartDate, that takes precedence.
 *
 * @param {string} currentExpiryDateStr 
 * @param {number} durationDays 
 * @param {string} [customStartDate] 
 * @param {string} [todayStr] 
 * @returns {{ startDate: string, expiryDate: string }}
 */
export function calculateRenewalDates(currentExpiryDateStr, durationDays, customStartDate = null, todayStr = getTodayDateStr()) {
  const normExpiry = normalizeDateStr(currentExpiryDateStr);
  const isCurrentlyActive = normExpiry && normExpiry >= todayStr;

  let renewalStart;
  if (customStartDate) {
    renewalStart = customStartDate;
  } else if (isCurrentlyActive) {
    // Starts the very next day after previous expiry
    renewalStart = addDaysToDate(normExpiry, 1);
  } else {
    // Expired membership: restart from today
    renewalStart = todayStr;
  }

  const newExpiry = calculateExpiryDate(renewalStart, durationDays);
  return {
    startDate: renewalStart,
    expiryDate: newExpiry,
  };
}

/**
 * Calculates extended expiry date when resuming a frozen membership.
 * Days frozen = difference between freezeStartDate and resumeDate.
 * New expiry date = currentExpiryDate + actualDaysFrozen.
 *
 * @param {string} currentExpiryDateStr 
 * @param {string} freezeStartDateStr 
 * @param {string} resumeDateStr 
 * @returns {{ actualFrozenDays: number, newExpiryDate: string }}
 */
export function calculateResumeExtension(currentExpiryDateStr, freezeStartDateStr, resumeDateStr) {
  const normExpiry = normalizeDateStr(currentExpiryDateStr);
  const frozenDays = Math.max(1, getDaysDifference(resumeDateStr, freezeStartDateStr));
  const newExpiry = addDaysToDate(normExpiry, frozenDays);
  return {
    actualFrozenDays: frozenDays,
    newExpiryDate: newExpiry,
  };
}

/**
 * Centralized, authoritative member status evaluation.
 * Derives comprehensive status flags without duplicating logic across components.
 *
 * @param {Object} member 
 * @param {string} [todayStr] 
 * @returns {Object} Evaluated status
 */
export function evaluateMemberStatus(member, todayStr = getTodayDateStr()) {
  if (!member) {
    return {
      statusKey: 'unknown',
      badgeLabel: 'UNKNOWN',
      badgeColor: '#7A8288',
      badgeBg: '#F0F0F0',
      isActive: false,
      isExpired: false,
      isExpiringSoon: false,
      isExpiringToday: false,
      isFrozen: false,
      isArchived: false,
      isDue: false,
      daysRemaining: -999,
      dueAmount: 0,
    };
  }

  // 1. Archival check
  if (member.isArchived || member.status === 'archived') {
    return {
      statusKey: 'archived',
      badgeLabel: 'ARCHIVED',
      badgeColor: '#7A8288',
      badgeBg: '#E9ECEF',
      isActive: false,
      isExpired: false,
      isExpiringSoon: false,
      isExpiringToday: false,
      isFrozen: false,
      isArchived: true,
      isDue: false,
      daysRemaining: 0,
      dueAmount: 0,
    };
  }

  // 2. Freeze check
  if (member.isFrozen || member.status === 'frozen') {
    return {
      statusKey: 'frozen',
      badgeLabel: 'FROZEN',
      badgeColor: '#1D6F8A',
      badgeBg: '#E1F3F8',
      isActive: false,
      isExpired: false,
      isExpiringSoon: false,
      isExpiringToday: false,
      isFrozen: true,
      isArchived: false,
      isDue: Number(member.dueAmount || member.amountDue || 0) > 0,
      daysRemaining: getDaysDifference(member.expiryDate, todayStr),
      dueAmount: Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0)),
    };
  }

  // 3. Date evaluation
  const normExpiry = normalizeDateStr(member.expiryDate);
  const daysRemaining = normExpiry ? getDaysDifference(normExpiry, todayStr) : -999;
  const isExpiringToday = daysRemaining === 0;
  const isExpiringSoon = daysRemaining >= 1 && daysRemaining <= 3;
  const isActive = daysRemaining >= 0;
  const isExpired = daysRemaining < 0;

  // 4. Financial evaluation
  const dueAmount = Number(member.dueAmount !== undefined ? member.dueAmount : (member.amountDue || 0));
  const isDue = dueAmount > 0;

  let statusKey = 'active';
  let badgeLabel = 'ACTIVE';
  let badgeColor = '#2F7D4A';
  let badgeBg = '#EAF6EE';

  if (isExpired) {
    statusKey = 'expired';
    badgeLabel = 'EXPIRED';
    badgeColor = '#A83D3D';
    badgeBg = '#FDF2F2';
  } else if (isExpiringToday) {
    statusKey = 'today';
    badgeLabel = 'EXPIRES TODAY';
    badgeColor = '#B38E00';
    badgeBg = '#FFF9E6';
  } else if (isExpiringSoon) {
    statusKey = 'soon';
    badgeLabel = `EXPIRES IN ${daysRemaining}D`;
    badgeColor = '#C27803';
    badgeBg = '#FFF5E5';
  }

  return {
    statusKey,
    badgeLabel,
    badgeColor,
    badgeBg,
    isActive,
    isExpired,
    isExpiringSoon,
    isExpiringToday,
    isFrozen: false,
    isArchived: false,
    isDue,
    daysRemaining,
    dueAmount,
  };
}

/**
 * Calculates financial amounts for registration or renewal
 *
 * @param {Object} params
 * @param {number} [params.admissionFee=0]
 * @param {number} [params.planPrice=0]
 * @param {number} [params.discount=0]
 * @param {number} [params.amountCollected=0]
 * @returns {{ originalTotal: number, discount: number, amountPayable: number, amountCollected: number, dueAmount: number }}
 */
export function calculateFinancials({ admissionFee = 0, planPrice = 0, discount = 0, amountCollected = 0 }) {
  const adm = Math.max(0, Number(admissionFee) || 0);
  const plan = Math.max(0, Number(planPrice) || 0);
  const disc = Math.max(0, Number(discount) || 0);
  const originalTotal = adm + plan;
  const amountPayable = Math.max(0, originalTotal - disc);
  const collected = Math.max(0, Number(amountCollected) || 0);
  const dueAmount = Math.max(0, amountPayable - collected);

  return {
    originalTotal,
    discount: disc,
    amountPayable,
    amountCollected: collected,
    dueAmount,
  };
}
