import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpiryDate,
  calculateRenewalDates,
  calculateResumeExtension,
  evaluateMemberStatus,
  calculateFinancials,
  addDaysToDate,
  getDaysDifference,
} from './membershipRules.js';

describe('Membership Date & Expiry Calculations', () => {
  test('calculateExpiryDate handles standard 30 day duration', () => {
    // 30 days starting on 2026-10-01 is inclusive through 2026-10-30
    const expiry = calculateExpiryDate('2026-10-01', 30);
    assert.equal(expiry, '2026-10-30');
  });

  test('calculateExpiryDate handles month-end and leap years', () => {
    // 2028 is a leap year (Feb 29 days). Starting Feb 1 for 29 days should end Feb 29.
    const leapExpiry = calculateExpiryDate('2028-02-01', 29);
    assert.equal(leapExpiry, '2028-02-29');

    // 2027 is non-leap (Feb 28 days). 28 days starting Feb 1 ends Feb 28.
    const nonLeapExpiry = calculateExpiryDate('2027-02-01', 28);
    assert.equal(nonLeapExpiry, '2027-02-28');
  });

  test('addDaysToDate correctly spans month and year boundaries', () => {
    assert.equal(addDaysToDate('2026-12-31', 1), '2027-01-01');
    assert.equal(addDaysToDate('2026-02-28', 1), '2026-03-01');
  });

  test('getDaysDifference returns exact day distance', () => {
    assert.equal(getDaysDifference('2026-10-15', '2026-10-10'), 5);
    assert.equal(getDaysDifference('2026-10-10', '2026-10-15'), -5);
    assert.equal(getDaysDifference('2026-10-10', '2026-10-10'), 0);
  });
});

describe('Membership Renewal Workflow', () => {
  test('Active member renews seamlessly from next day after current expiry', () => {
    const today = '2026-10-09';
    const currentExpiry = '2026-10-20'; // Active, 11 days remaining
    const renewal = calculateRenewalDates(currentExpiry, 30, null, today);

    // Renewal must start on 2026-10-21 (day after current expiry)
    assert.equal(renewal.startDate, '2026-10-21');
    // 30 days inclusive from 2026-10-21 ends 2026-11-19
    assert.equal(renewal.expiryDate, '2026-11-19');
  });

  test('Expired member renews starting from today', () => {
    const today = '2026-10-09';
    const currentExpiry = '2026-09-30'; // Expired 9 days ago
    const renewal = calculateRenewalDates(currentExpiry, 30, null, today);

    assert.equal(renewal.startDate, '2026-10-09');
    assert.equal(renewal.expiryDate, '2026-11-07');
  });

  test('Explicit custom start date takes priority', () => {
    const today = '2026-10-09';
    const currentExpiry = '2026-10-20';
    const renewal = calculateRenewalDates(currentExpiry, 30, '2026-11-01', today);

    assert.equal(renewal.startDate, '2026-11-01');
    assert.equal(renewal.expiryDate, '2026-11-30');
  });
});

describe('Membership Freeze & Resume Extension', () => {
  test('Extends expiry date by exact frozen duration', () => {
    // Current expiry is 2026-11-15.
    // Frozen from 2026-10-10 to 2026-10-20 (10 days frozen).
    const resume = calculateResumeExtension('2026-11-15', '2026-10-10', '2026-10-20');
    assert.equal(resume.actualFrozenDays, 10);
    assert.equal(resume.newExpiryDate, '2026-11-25');
  });
});

describe('Centralized Member Status Evaluation', () => {
  const today = '2026-10-09';

  test('Evaluates Active member with > 3 days left', () => {
    const member = { expiryDate: '2026-10-25', dueAmount: 0 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isActive, true);
    assert.equal(status.isExpired, false);
    assert.equal(status.isExpiringSoon, false);
    assert.equal(status.statusKey, 'active');
    assert.equal(status.badgeLabel, 'ACTIVE');
  });

  test('Evaluates Expiring Soon member (1-3 days left)', () => {
    const member = { expiryDate: '2026-10-11', dueAmount: 0 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isActive, true);
    assert.equal(status.isExpiringSoon, true);
    assert.equal(status.statusKey, 'soon');
    assert.equal(status.badgeLabel, 'EXPIRES IN 2D');
  });

  test('Evaluates Expiring Today member (0 days left)', () => {
    const member = { expiryDate: '2026-10-09', dueAmount: 0 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isActive, true);
    assert.equal(status.isExpiringToday, true);
    assert.equal(status.badgeLabel, 'EXPIRES TODAY');
  });

  test('Evaluates Expired member (< 0 days left)', () => {
    const member = { expiryDate: '2026-10-05', dueAmount: 0 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isActive, false);
    assert.equal(status.isExpired, true);
    assert.equal(status.statusKey, 'expired');
    assert.equal(status.badgeLabel, 'EXPIRED');
  });

  test('Evaluates Frozen member', () => {
    const member = { expiryDate: '2026-10-25', isFrozen: true, dueAmount: 0 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isFrozen, true);
    assert.equal(status.isActive, false);
    assert.equal(status.badgeLabel, 'FROZEN');
  });

  test('Evaluates Archived member', () => {
    const member = { expiryDate: '2026-10-25', isArchived: true };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isArchived, true);
    assert.equal(status.badgeLabel, 'ARCHIVED');
  });

  test('Evaluates Due balance accurately', () => {
    const member = { expiryDate: '2026-10-25', dueAmount: 500 };
    const status = evaluateMemberStatus(member, today);
    assert.equal(status.isDue, true);
    assert.equal(status.dueAmount, 500);
  });
});

describe('Financial Calculations', () => {
  test('Calculates full payment with zero dues', () => {
    const res = calculateFinancials({
      admissionFee: 500,
      planPrice: 1000,
      discount: 0,
      amountCollected: 1500,
    });
    assert.equal(res.originalTotal, 1500);
    assert.equal(res.amountPayable, 1500);
    assert.equal(res.amountCollected, 1500);
    assert.equal(res.dueAmount, 0);
  });

  test('Calculates partial payment with remaining dues', () => {
    const res = calculateFinancials({
      admissionFee: 0,
      planPrice: 3500,
      discount: 500,
      amountCollected: 2000,
    });
    assert.equal(res.originalTotal, 3500);
    assert.equal(res.discount, 500);
    assert.equal(res.amountPayable, 3000);
    assert.equal(res.amountCollected, 2000);
    assert.equal(res.dueAmount, 1000);
  });
});
