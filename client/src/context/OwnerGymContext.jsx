import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Anchor date: 2026-09-26 (matching system date and prompt specifications)
export const CURRENT_DATE_STR = '2026-09-26';
export const CURRENT_DATE = new Date('2026-09-26T00:00:00');

// Initial Membership Plans
export const INITIAL_PLANS = [
  { id: 'plan-1', name: 'Monthly', price: 800, durationDays: 30, status: 'Active' },
  { id: 'plan-2', name: '3 Months', price: 2000, durationDays: 90, status: 'Active' },
  { id: 'plan-3', name: '6 Months', price: 3500, durationDays: 180, status: 'Active' },
  { id: 'plan-4', name: '1 Year', price: 6000, durationDays: 365, status: 'Active' },
];

// Helper to format date nicely
export function formatDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Helper to add days to a date string YYYY-MM-DD
export function addDaysToDate(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Calculate days difference between date and current date
export function getDaysDiffFromCurrent(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const diffTime = d.getTime() - CURRENT_DATE.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Generate realistic seed members matching the target metrics:
// Total: 210, Active: 186, Expired: 24, Due: 12, Expiring Today: 3, Expiring in 1-3 Days: 7
function generateInitialMembers() {
  const members = [];

  // Key required members from prompt specifications
  members.push({
    id: 'LEE-0001',
    name: 'Arun Kumar',
    mobile: '9876543210',
    gender: 'Male',
    dobOrAge: '28 Yrs',
    height: '178',
    weight: '76',
    address: '14, Cross Street, Anna Nagar, Chennai',
    photo: null,
    planId: 'plan-1',
    planName: 'Monthly',
    joiningDate: '2026-09-26',
    expiryDate: '2026-10-26',
    paymentDate: '2026-09-26',
    admissionAmount: 500,
    planAmount: 800,
    amountPayable: 1300,
    amountCollected: 1300,
    amountDue: 0,
    paymentMode: 'Cash',
    sendInvoice: true,
  });

  members.push({
    id: 'LEE-0002',
    name: 'Ravi Kumar',
    mobile: '9843214567',
    gender: 'Male',
    dobOrAge: '31 Yrs',
    height: '172',
    weight: '82',
    address: '22/B, Gandhi Road, T. Nagar, Chennai',
    photo: null,
    planId: 'plan-2',
    planName: '3 Months',
    joiningDate: '2026-06-30',
    expiryDate: '2026-09-28', // Expiring in 2 days!
    paymentDate: '2026-06-30',
    admissionAmount: 0,
    planAmount: 2000,
    amountPayable: 2000,
    amountCollected: 1500,
    amountDue: 500, // Due!
    paymentMode: 'Online',
    sendInvoice: false,
  });

  members.push({
    id: 'LEE-0003',
    name: 'Suresh',
    mobile: '9998887776',
    gender: 'Male',
    dobOrAge: '25 Yrs',
    height: '180',
    weight: '70',
    address: '8, 2nd Main Road, Velachery, Chennai',
    photo: null,
    planId: 'plan-1',
    planName: 'Monthly',
    joiningDate: '2026-08-20',
    expiryDate: '2026-09-20', // Expired 6 days ago!
    paymentDate: '2026-08-20',
    admissionAmount: 500,
    planAmount: 800,
    amountPayable: 1300,
    amountCollected: 1300,
    amountDue: 0,
    paymentMode: 'Cash',
    sendInvoice: true,
  });

  // Expiring Today members (3 total: 0004, 0005, 0006)
  const expiringTodayNames = [
    { name: 'Karthik Raja', mobile: '9840123451', gender: 'Male', plan: 'Monthly', fee: 800 },
    { name: 'Priya Sundaram', mobile: '9840123452', gender: 'Female', plan: 'Monthly', fee: 800 },
    { name: 'Manoj Prabhakar', mobile: '9840123453', gender: 'Male', plan: '3 Months', fee: 2000 },
  ];
  expiringTodayNames.forEach((item, idx) => {
    const num = 4 + idx;
    const padId = `LEE-${String(num).padStart(4, '0')}`;
    members.push({
      id: padId,
      name: item.name,
      mobile: item.mobile,
      gender: item.gender,
      dobOrAge: '27 Yrs',
      height: '175',
      weight: '74',
      address: `${num * 3}, Main Bazaar, Guindy, Chennai`,
      photo: null,
      planId: item.plan === 'Monthly' ? 'plan-1' : 'plan-2',
      planName: item.plan,
      joiningDate: '2026-08-26',
      expiryDate: '2026-09-26', // Today!
      paymentDate: '2026-08-26',
      admissionAmount: 0,
      planAmount: item.fee,
      amountPayable: item.fee,
      amountCollected: item.fee,
      amountDue: 0,
      paymentMode: idx % 2 === 0 ? 'Cash' : 'Online',
      sendInvoice: true,
    });
  });

  // Expiring in 1-3 Days members (7 total: LEE-0002 is 1, need 6 more: 0007 to 0012)
  const expiringSoonNames = [
    { name: 'Deepak Chandran', mobile: '9840234501', days: 1, due: 0 },
    { name: 'Ananya Krishnan', mobile: '9840234502', days: 1, due: 300 }, // Also Due!
    { name: 'Vignesh Subramanian', mobile: '9840234503', days: 2, due: 0 },
    { name: 'Divya Ramesh', mobile: '9840234504', days: 2, due: 0 },
    { name: 'Balaji Natarajan', mobile: '9840234505', days: 3, due: 500 }, // Also Due!
    { name: 'Sneha Balan', mobile: '9840234506', days: 3, due: 0 },
  ];
  expiringSoonNames.forEach((item, idx) => {
    const num = 7 + idx;
    const padId = `LEE-${String(num).padStart(4, '0')}`;
    const expDate = addDaysToDate('2026-09-26', item.days);
    members.push({
      id: padId,
      name: item.name,
      mobile: item.mobile,
      gender: idx % 2 === 0 ? 'Male' : 'Female',
      dobOrAge: '26 Yrs',
      height: '170',
      weight: '68',
      address: `${num * 5}, Lake View Road, Adyar, Chennai`,
      photo: null,
      planId: 'plan-1',
      planName: 'Monthly',
      joiningDate: addDaysToDate(expDate, -30),
      expiryDate: expDate,
      paymentDate: addDaysToDate(expDate, -30),
      admissionAmount: 500,
      planAmount: 800,
      amountPayable: 1300,
      amountCollected: 1300 - item.due,
      amountDue: item.due,
      paymentMode: 'Online',
      sendInvoice: true,
    });
  });

  // Expired members (24 total: LEE-0003 is 1, need 23 more: 0013 to 0035)
  const sampleExpiredFirstNames = [
    'Rajesh', 'Ganesh', 'Saravanan', 'Manikandan', 'Bhuvanesh',
    'Swetha', 'Keerthana', 'Aravind', 'Praveen', 'Siddharth',
    'Meenakshi', 'Nandini', 'Gowtham', 'Hariharan', 'Jagadeesh',
    'Pavithra', 'Sanjay', 'Dharani', 'Madhan', 'Aakash',
    'Sindhu', 'Naveen', 'Rohit'
  ];
  sampleExpiredFirstNames.forEach((name, idx) => {
    const num = 13 + idx;
    const padId = `LEE-${String(num).padStart(4, '0')}`;
    const daysAgo = (idx % 20) + 1;
    const expDate = addDaysToDate('2026-09-26', -daysAgo);
    // Let 2 of the expired members have outstanding due balance as well
    const isDue = idx < 2;
    const dueAmount = isDue ? 400 : 0;

    members.push({
      id: padId,
      name: `${name} ${['V', 'K', 'S', 'R', 'M'][idx % 5]}`,
      mobile: `98403${String(num).padStart(5, '0')}`,
      gender: ['Swetha', 'Keerthana', 'Meenakshi', 'Nandini', 'Pavithra', 'Dharani', 'Sindhu'].includes(name) ? 'Female' : 'Male',
      dobOrAge: `${22 + (idx % 15)} Yrs`,
      height: `${165 + (idx % 20)}`,
      weight: `${65 + (idx % 25)}`,
      address: `${num}, West Mambalam, Chennai`,
      photo: null,
      planId: idx % 2 === 0 ? 'plan-1' : 'plan-2',
      planName: idx % 2 === 0 ? 'Monthly' : '3 Months',
      joiningDate: addDaysToDate(expDate, -30),
      expiryDate: expDate,
      paymentDate: addDaysToDate(expDate, -30),
      admissionAmount: 500,
      planAmount: 800,
      amountPayable: 1300,
      amountCollected: 1300 - dueAmount,
      amountDue: dueAmount,
      paymentMode: 'Cash',
      sendInvoice: false,
    });
  });

  // Current count now: 35 members.
  // We need total 210 members.
  // Active required = 186.
  // Currently Active:
  // - LEE-0001 (Active)
  // - LEE-0002 (Active)
  // - 0004..0006 (3 Active expiring today)
  // - 0007..0012 (6 Active expiring in 1-3 days)
  // Total active created so far: 1 + 1 + 3 + 6 = 11.
  // Remaining active needed = 186 - 11 = 175 active members (from index 36 to 210).
  // Total due needed = 12.
  // Due members created so far:
  // - LEE-0002 (500)
  // - LEE-0008 (300)
  // - LEE-0011 (500)
  // - LEE-0013 (400 - Expired)
  // - LEE-0014 (400 - Expired)
  // Total due so far = 5. Remaining due needed = 12 - 5 = 7.
  // We will assign due amount to exactly 7 of the remaining active members.

  const tamilFirstNames = [
    'Surya', 'Vijay', 'Ajith', 'Dhanush', 'Sivakarthikeyan', 'Karthi', 'Vikram',
    'Jayanth', 'Nithya', 'Harini', 'Lavanya', 'Gayathri', 'Kavitha', 'Abirami',
    'Varun', 'Ashwin', 'Prasanna', 'Shankar', 'Ramesh', 'Santhosh', 'Vimal',
    'Selvam', 'Murugan', 'Thirumalai', 'Sathish', 'Kishore', 'Vasanth', 'Venkatesh',
    'Shalini', 'Rashmika', 'Anjali', 'Deepika', 'Keerthi', 'Janani', 'Kalyani',
    'Niranjan', 'Mukesh', 'Harish', 'Gokul', 'Raghav', 'Tarun', 'Pradeep',
    'Akshaya', 'Sandhya', 'Madhumitha', 'Swathi', 'Archana', 'Pavani', 'Monisha'
  ];

  let remainingDueCount = 7;

  for (let num = 36; num <= 210; num++) {
    const padId = `LEE-${String(num).padStart(4, '0')}`;
    const nameSeed = tamilFirstNames[num % tamilFirstNames.length];
    const initial = ['K', 'R', 'S', 'M', 'N', 'P', 'V', 'A', 'T', 'B'][num % 10];
    const fullName = `${nameSeed} ${initial}.`;
    
    // Active: expiry is between 4 days and 300 days in the future
    const daysFuture = 4 + ((num * 7) % 290);
    const expDate = addDaysToDate('2026-09-26', daysFuture);
    const joinDate = addDaysToDate(expDate, -90);

    // Assign due amount to exactly 7 members
    let due = 0;
    if (remainingDueCount > 0 && num % 25 === 0) {
      due = 500;
      remainingDueCount--;
    } else if (remainingDueCount > 0 && num === 205) {
      due = 400;
      remainingDueCount--;
    }

    const plans = [
      { id: 'plan-1', name: 'Monthly', fee: 800 },
      { id: 'plan-2', name: '3 Months', fee: 2000 },
      { id: 'plan-3', name: '6 Months', fee: 3500 },
      { id: 'plan-4', name: '1 Year', fee: 6000 },
    ];
    const chosenPlan = plans[num % plans.length];
    const admission = num % 3 === 0 ? 500 : 0;
    const payable = admission + chosenPlan.fee;
    const collected = payable - due;

    members.push({
      id: padId,
      name: fullName,
      mobile: `9841${String(num).padStart(6, '0')}`,
      gender: ['Nithya', 'Harini', 'Lavanya', 'Gayathri', 'Kavitha', 'Abirami', 'Shalini', 'Rashmika', 'Anjali', 'Deepika', 'Keerthi', 'Janani', 'Kalyani', 'Akshaya', 'Sandhya', 'Madhumitha', 'Swathi', 'Archana', 'Pavani', 'Monisha'].includes(nameSeed) ? 'Female' : 'Male',
      dobOrAge: `${20 + (num % 22)} Yrs`,
      height: `${160 + (num % 28)}`,
      weight: `${58 + (num % 35)}`,
      address: `${num}, 1st Avenue, Anna Nagar East, Chennai`,
      photo: null,
      planId: chosenPlan.id,
      planName: chosenPlan.name,
      joiningDate: joinDate,
      expiryDate: expDate,
      paymentDate: joinDate,
      admissionAmount: admission,
      planAmount: chosenPlan.fee,
      amountPayable: payable,
      amountCollected: collected,
      amountDue: due,
      paymentMode: num % 2 === 0 ? 'Cash' : 'Online',
      sendInvoice: num % 2 === 0,
    });
  }

  return members;
}

const OwnerGymContext = createContext(null);

const STORAGE_MEMBERS_KEY = 'lee_gym_owner_members_v1';
const STORAGE_PLANS_KEY = 'lee_gym_owner_plans_v1';
const STORAGE_AUTH_KEY = 'lee_gym_owner_auth_v1';

export function OwnerGymProvider({ children }) {
  // Authentication mock state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      return stored ? JSON.parse(stored) : true; // Default logged in for smooth developer/owner preview
    } catch {
      return true;
    }
  });

  const [ownerProfile] = useState({
    name: 'Marcus Lee',
    role: 'Gym Owner',
    email: 'owner@leegym.com',
    gymName: 'LEE GYM',
    tagline: 'Train Hard. Live Strong.',
  });

  // Plans state
  const [plans, setPlans] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PLANS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PLANS;
    } catch {
      return INITIAL_PLANS;
    }
  });

  // Members state
  const [members, setMembers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MEMBERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return generateInitialMembers();
    } catch {
      return generateInitialMembers();
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
      console.warn('Storage error for plans:', e);
    }
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(members));
    } catch (e) {
      console.warn('Storage error for members:', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.warn('Storage error for auth:', e);
    }
  }, [isAuthenticated]);

  // Auth actions
  const login = (email, password) => {
    // Mock login verification: accepts owner credentials or any reasonable input for testing
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    // Accept valid format
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Generate next member ID
  const getNextMemberId = () => {
    const maxNum = members.reduce((max, m) => {
      const match = m.id.match(/LEE-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 210);
    return `LEE-${String(maxNum + 1).padStart(5, '0')}`;
  };

  // Add new member
  const addMember = (newMemberData) => {
    const memberId = newMemberData.id || getNextMemberId();
    const admission = Number(newMemberData.admissionAmount || 0);
    const planFee = Number(newMemberData.planAmount || 0);
    const payable = admission + planFee;
    const collected = Number(newMemberData.amountCollected || 0);
    const due = Math.max(0, payable - collected);

    const fullMember = {
      ...newMemberData,
      id: memberId,
      admissionAmount: admission,
      planAmount: planFee,
      amountPayable: payable,
      amountCollected: collected,
      amountDue: due,
      createdAt: new Date().toISOString(),
    };

    setMembers((prev) => [fullMember, ...prev]);
    return fullMember;
  };

  // Update existing member
  const updateMember = (id, updatedFields) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const admission = updatedFields.admissionAmount !== undefined ? Number(updatedFields.admissionAmount) : m.admissionAmount;
        const planFee = updatedFields.planAmount !== undefined ? Number(updatedFields.planAmount) : m.planAmount;
        const payable = admission + planFee;
        const collected = updatedFields.amountCollected !== undefined ? Number(updatedFields.amountCollected) : m.amountCollected;
        const due = Math.max(0, payable - collected);

        return {
          ...m,
          ...updatedFields,
          admissionAmount: admission,
          planAmount: planFee,
          amountPayable: payable,
          amountCollected: collected,
          amountDue: due,
        };
      })
    );
  };

  // Record payment for member
  const recordPayment = (memberId, paymentAmount, paymentMode = 'Cash') => {
    const amt = Number(paymentAmount);
    if (isNaN(amt) || amt <= 0) return { success: false, message: 'Invalid payment amount' };

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const newCollected = m.amountCollected + amt;
        const newDue = Math.max(0, m.amountPayable - newCollected);
        return {
          ...m,
          amountCollected: newCollected,
          amountDue: newDue,
          paymentMode,
          lastPaymentDate: CURRENT_DATE_STR,
        };
      })
    );
    return { success: true };
  };

  // Add plan
  const addPlan = (planData) => {
    const newId = `plan-${Date.now()}`;
    const newPlan = {
      id: newId,
      name: planData.name.trim(),
      price: Number(planData.price),
      durationDays: Number(planData.durationDays),
      status: 'Active',
    };
    setPlans((prev) => [...prev, newPlan]);
    return newPlan;
  };

  // Update plan
  const updatePlan = (id, planData) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...planData, price: Number(planData.price), durationDays: Number(planData.durationDays) } : p))
    );
  };

  // Toggle plan active status
  const togglePlanStatus = (id) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
    );
  };

  // Intelligent Status Classifications
  // Classification logic as specified in prompt:
  // DUE: amountDue > 0
  // EXPIRING TODAY: expiry date = CURRENT_DATE_STR
  // EXPIRING IN 1–3 DAYS: diff between 1 and 3 days inclusive
  // ACTIVE: expiry date >= CURRENT_DATE_STR
  // EXPIRED: expiry date < CURRENT_DATE_STR
  // TOTAL: all members
  const memberEvaluator = (member) => {
    const diff = getDaysDiffFromCurrent(member.expiryDate);
    const isExpired = diff < 0;
    const isActive = diff >= 0;
    const isExpiringToday = diff === 0;
    const isExpiring1To3 = diff >= 1 && diff <= 3;
    const isDue = Number(member.amountDue) > 0;

    return {
      isExpired,
      isActive,
      isExpiringToday,
      isExpiring1To3,
      isDue,
      diff,
      membershipStatus: isActive ? 'Active' : 'Expired',
      paymentStatus: isDue ? 'Due' : 'Paid',
    };
  };

  // Metrics calculation
  const dashboardMetrics = useMemo(() => {
    let dueMembers = 0;
    let expiringToday = 0;
    let expiringSoon = 0;
    let activeMembers = 0;
    let expiredMembers = 0;

    members.forEach((m) => {
      const { isDue, isExpiringToday, isExpiring1To3, isActive, isExpired } = memberEvaluator(m);
      if (isDue) dueMembers++;
      if (isExpiringToday) expiringToday++;
      if (isExpiring1To3) expiringSoon++;
      if (isActive) activeMembers++;
      if (isExpired) expiredMembers++;
    });

    return {
      dueMembers,
      expiringToday,
      expiringSoon,
      activeMembers,
      expiredMembers,
      totalMembers: members.length,
    };
  }, [members]);

  return (
    <OwnerGymContext.Provider
      value={{
        isAuthenticated,
        ownerProfile,
        login,
        logout,
        plans,
        addPlan,
        updatePlan,
        togglePlanStatus,
        members,
        addMember,
        updateMember,
        recordPayment,
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
