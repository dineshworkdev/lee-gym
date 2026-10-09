import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Clock,
  DollarSign,
  Snowflake,
  CheckCircle2,
  Filter,
  MessageCircle,
  Eye,
  Check,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { useOwnerGym, formatDate, CURRENT_DATE_STR } from '../../context/OwnerGymContext.jsx';
import { GYM_INFO } from '../../data/gymData.js';

export default function Notifications() {
  const { members, memberEvaluator, payments } = useOwnerGym();
  const [filterType, setFilterType] = useState('all'); // 'all', 'expiry', 'dues', 'frozen'
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('leegym_dismissed_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const dismissNotification = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem('leegym_dismissed_notifications', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  const clearAllDismissed = () => {
    setDismissedIds([]);
    try {
      localStorage.removeItem('leegym_dismissed_notifications');
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  // Generate dynamic, real alerts from members data
  const notificationsList = useMemo(() => {
    const alerts = [];

    members.forEach((m) => {
      const evalStatus = memberEvaluator(m);
      if (evalStatus.isArchived) return;

      // 1. Expiring Today Alert
      if (evalStatus.isExpiringToday) {
        alerts.push({
          id: `expiry-today-${m.id}`,
          type: 'expiry',
          severity: 'urgent',
          title: `Membership Expires Today: ${m.name}`,
          description: `${m.name} (${m.id}) membership under ${m.planName} reaches expiry today (${formatDate(m.expiryDate)}). Immediate renewal required.`,
          member: m,
          date: CURRENT_DATE_STR,
          actionLink: `/owner/members/${m.id}`,
          actionLabel: 'Renew Member',
          phone: m.mobile,
          whatsappMsg: `Hello ${m.name}, your ${m.planName} membership at ${GYM_INFO.name} expires today. Please visit the desk or contact us to renew your membership.`,
        });
      }

      // 2. Expiring in 1-3 Days Alert
      else if (evalStatus.isExpiringSoon) {
        alerts.push({
          id: `expiry-soon-${m.id}`,
          type: 'expiry',
          severity: 'warning',
          title: `Expiry in ${evalStatus.daysRemaining} Days: ${m.name}`,
          description: `${m.name} (${m.id}) membership will expire on ${formatDate(m.expiryDate)}. Follow up for smooth renewal.`,
          member: m,
          date: CURRENT_DATE_STR,
          actionLink: `/owner/members/${m.id}`,
          actionLabel: 'View Member',
          phone: m.mobile,
          whatsappMsg: `Hello ${m.name}, your ${m.planName} membership at ${GYM_INFO.name} will expire in ${evalStatus.daysRemaining} days on ${formatDate(m.expiryDate)}. Kindly renew on time to avoid interruption.`,
        });
      }

      // 3. Expired Membership Alert
      else if (evalStatus.isExpired) {
        alerts.push({
          id: `expired-${m.id}`,
          type: 'expiry',
          severity: 'urgent',
          title: `Expired Membership: ${m.name}`,
          description: `${m.name} (${m.id}) membership expired ${Math.abs(evalStatus.daysRemaining)} days ago on ${formatDate(m.expiryDate)}.`,
          member: m,
          date: CURRENT_DATE_STR,
          actionLink: `/owner/members/${m.id}`,
          actionLabel: 'Renew or Follow Up',
          phone: m.mobile,
          whatsappMsg: `Hello ${m.name}, your membership at ${GYM_INFO.name} has expired. We would love to have you continue training with us. Please contact the desk to renew!`,
        });
      }

      // 4. Outstanding Dues Alert
      if (evalStatus.isDue && evalStatus.dueAmount > 0) {
        alerts.push({
          id: `due-${m.id}`,
          type: 'dues',
          severity: 'dues',
          title: `Outstanding Balance: ₹${evalStatus.dueAmount} (${m.name})`,
          description: `${m.name} (${m.id}) has an unpaid balance of ₹${evalStatus.dueAmount} for ${m.planName} plan.`,
          member: m,
          date: CURRENT_DATE_STR,
          actionLink: `/owner/members/${m.id}`,
          actionLabel: 'Collect Due',
          phone: m.mobile,
          whatsappMsg: `Hello ${m.name}, this is a friendly reminder from ${GYM_INFO.name} regarding your pending fee balance of ₹${evalStatus.dueAmount}. Kindly settle at the gym reception.`,
        });
      }

      // 5. Frozen Member Alert
      if (evalStatus.isFrozen) {
        alerts.push({
          id: `frozen-${m.id}`,
          type: 'frozen',
          severity: 'info',
          title: `Account Frozen: ${m.name}`,
          description: `${m.name} (${m.id}) is on temporary freeze since ${formatDate(m.freezeInfo?.startDate)}. Reason: ${m.freezeInfo?.reason || 'Leave'}.`,
          member: m,
          date: CURRENT_DATE_STR,
          actionLink: `/owner/members/${m.id}`,
          actionLabel: 'View Freeze Status',
          phone: m.mobile,
        });
      }
    });

    return alerts;
  }, [members, memberEvaluator]);

  const activeAlerts = useMemo(() => {
    return notificationsList.filter((n) => !dismissedIds.includes(n.id));
  }, [notificationsList, dismissedIds]);

  const filteredAlerts = useMemo(() => {
    if (filterType === 'all') return activeAlerts;
    return activeAlerts.filter((n) => n.type === filterType);
  }, [activeAlerts, filterType]);

  const getWhatsAppLink = (phone, text) => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                letterSpacing: '0.04em',
                color: 'var(--color-charcoal, #252A2E)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              NOTIFICATIONS &amp; ALERTS
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.85rem', color: 'var(--color-slate, #4B555D)', margin: '0.3rem 0 0' }}>
            Real-time computed operational alerts for membership expirations, payment dues, and renewals
          </p>
        </div>

        {dismissedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAllDismissed}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(37, 42, 46, 0.15)',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-charcoal, #252A2E)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
          >
            Restore Dismissed Alerts ({dismissedIds.length})
          </button>
        )}
      </div>

      {/* ── FILTER BUTTONS ──────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-slate, #4B555D)', marginRight: '0.25rem' }}>
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Alerts', count: activeAlerts.length },
          { id: 'expiry', label: 'Expirations', count: activeAlerts.filter((n) => n.type === 'expiry').length },
          { id: 'dues', label: 'Overdue Balances', count: activeAlerts.filter((n) => n.type === 'dues').length },
          { id: 'frozen', label: 'Frozen Accounts', count: activeAlerts.filter((n) => n.type === 'frozen').length },
        ].map((tab) => {
          const isSelected = filterType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: isSelected ? '1px solid #252A2E' : '1px solid rgba(37, 42, 46, 0.12)',
                backgroundColor: isSelected ? '#252A2E' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : 'var(--color-charcoal, #252A2E)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 120ms ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(37, 42, 46, 0.08)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-charcoal, #252A2E)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── NOTIFICATION CARDS STREAM ───────────────────────────────── */}
      {filteredAlerts.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 42, 46, 0.08)',
            borderRadius: '8px',
            boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <CheckCircle2 size={36} color="#2F7D4A" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.75rem', color: '#2F7D4A', margin: 0 }}>
            NO PENDING NOTIFICATIONS
          </h3>
          <p style={{ color: 'var(--color-slate, #4B555D)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
            All member expirations and payment records are up to date!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredAlerts.map((alert) => {
            const isUrgent = alert.severity === 'urgent';
            const isDues = alert.severity === 'dues';
            const isWarning = alert.severity === 'warning';

            const borderHighlight = isUrgent || isDues ? 'rgba(168, 61, 61, 0.3)' : isWarning ? 'rgba(244, 196, 0, 0.5)' : 'rgba(37, 42, 46, 0.1)';

            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(37, 42, 46, 0.08)',
                  borderLeft: `4px solid ${borderHighlight}`,
                  borderRadius: '8px',
                  boxShadow: 'var(--portal-card-shadow, 0 1px 3px rgba(37,42,46,0.04))',
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                {/* Left Content */}
                <div style={{ flex: '1 1 500px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {isUrgent && <AlertTriangle size={18} color="#A83D3D" />}
                    {isDues && <DollarSign size={18} color="#A83D3D" />}
                    {isWarning && <Clock size={18} color="#C27803" />}
                    {alert.type === 'frozen' && <Snowflake size={18} color="#1D6F8A" />}

                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#252A2E' }}>
                      {alert.title}
                    </h4>
                  </div>

                  <p style={{ margin: '0.25rem 0 0.5rem 0', color: '#4B555D', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {alert.description}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#7A8288' }}>
                    Member: <strong>{alert.member?.name}</strong> ({alert.member?.id}) | Phone: {alert.member?.mobile}
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* WhatsApp Reminder Button */}
                  {alert.whatsappMsg && (
                    <a
                      href={getWhatsAppLink(alert.phone, alert.whatsappMsg)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.55rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                      }}
                      title="Send WhatsApp alert"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {/* Primary Link Button */}
                  <Link
                    to={alert.actionLink}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#252A2E',
                      color: '#FFFFFF',
                      padding: '0.55rem 0.9rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    <Eye size={15} />
                    <span>{alert.actionLabel}</span>
                  </Link>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onClick={() => dismissNotification(alert.id)}
                    style={{
                      padding: '0.55rem 0.75rem',
                      backgroundColor: '#FAF8F4',
                      border: '1px solid #252A2E',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#4B555D',
                    }}
                    title="Dismiss alert"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
