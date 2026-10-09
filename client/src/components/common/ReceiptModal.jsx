import React from 'react';
import { X, Printer, Dumbbell, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../context/OwnerGymContext.jsx';
import { GYM_INFO } from '../../data/gymData.js';

export default function ReceiptModal({ payment, member, onClose }) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNum = payment.receiptNumber || 'LEE-RECEIPT';
  const payDate = formatDate(payment.paymentDate || payment.createdAt);
  const memberName = payment.memberName || member?.name || 'Gym Member';
  const memberCode = payment.memberCode || payment.memberId || member?.id || 'LEE';
  const memberMobile = payment.memberPhone || member?.mobile || '—';
  const planName = payment.planName || member?.planName || 'General Access';
  const amountPaid = Number(payment.amountPaid || 0);
  const remainingDue = Number(payment.remainingDueAmount !== undefined ? payment.remainingDueAmount : (member?.dueAmount || 0));
  const previousDue = Number(payment.previousDueAmount || (amountPaid + remainingDue));
  const admissionFee = Number(payment.admissionFee || 0);
  const mode = payment.paymentMode || 'Cash';
  const notes = payment.notes || '';

  return (
    <div
      id="receipt-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(37, 42, 46, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
    >
      <div
        id="receipt-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid rgba(37, 42, 46, 0.1)',
          borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Action Bar (hidden when printing) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#252A2E',
            color: '#FFFFFF',
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F4C400' }}>
            Official Payment Receipt
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#F4C400',
                color: '#252A2E',
                border: '1px solid #D4A900',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Printer size={15} />
              <span>PRINT</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div
          id="printable-receipt"
          style={{
            padding: '2rem',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            color: '#252A2E',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Gym Header */}
          <div style={{ borderBottom: '2px solid #252A2E', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: '#F4C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={18} color="#252A2E" />
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
                      fontSize: '2.2rem',
                      letterSpacing: '0.04em',
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    LEE <span style={{ color: '#C27803' }}>GYM</span>
                  </h2>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4B555D', lineHeight: 1.4, maxWidth: '320px' }}>
                  {GYM_INFO.address}
                  <br />
                  Phone: <strong>{GYM_INFO.phone}</strong> | Email: {GYM_INFO.email}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#252A2E',
                    color: '#F4C400',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    padding: '0.25rem 0.6rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  {receiptNum}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#4B555D' }}>Date: <strong>{payDate}</strong></div>
                <div style={{ fontSize: '0.75rem', color: '#4B555D' }}>Mode: <strong>{mode.toUpperCase()}</strong></div>
              </div>
            </div>
          </div>

          {/* Member & Subscription Details */}
          <div
            style={{
              backgroundColor: '#FAF8F4',
              border: '1.5px solid #252A2E',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#7A8288', textTransform: 'uppercase', fontWeight: 700 }}>
                Billed To
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '0.1rem' }}>{memberName}</div>
              <div style={{ color: '#4B555D', fontSize: '0.8rem' }}>Member ID: <strong>{memberCode}</strong></div>
              <div style={{ color: '#4B555D', fontSize: '0.8rem' }}>Mobile: {memberMobile}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#7A8288', textTransform: 'uppercase', fontWeight: 700 }}>
                Membership Details
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '0.1rem' }}>{planName}</div>
              {payment.membershipStartDate && (
                <div style={{ color: '#4B555D', fontSize: '0.78rem' }}>
                  Valid: {formatDate(payment.membershipStartDate)} to {formatDate(payment.membershipExpiryDate)}
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #252A2E', backgroundColor: '#F0ECE1' }}>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Description
                </th>
                <th style={{ textAlign: 'right', padding: '0.6rem 0.75rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {admissionFee > 0 && (
                <tr style={{ borderBottom: '1px solid rgba(37,42,46,0.1)' }}>
                  <td style={{ padding: '0.6rem 0.75rem' }}>One-time Admission Fee</td>
                  <td style={{ textAlign: 'right', padding: '0.6rem 0.75rem' }}>₹{admissionFee.toLocaleString('en-IN')}</td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid rgba(37,42,46,0.1)' }}>
                <td style={{ padding: '0.6rem 0.75rem' }}>Gym Membership Fee ({planName})</td>
                <td style={{ textAlign: 'right', padding: '0.6rem 0.75rem' }}>₹{(previousDue - admissionFee).toLocaleString('en-IN')}</td>
              </tr>
              <tr style={{ borderBottom: '2px solid #252A2E', backgroundColor: '#FDFCF9', fontWeight: 700 }}>
                <td style={{ padding: '0.65rem 0.75rem' }}>Total Amount Due Prior</td>
                <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem' }}>₹{previousDue.toLocaleString('en-IN')}</td>
              </tr>
              <tr style={{ backgroundColor: '#F2F9F4', fontWeight: 900 }}>
                <td style={{ padding: '0.75rem', color: '#2F7D4A', fontSize: '1.05rem' }}>
                  AMOUNT RECEIVED
                </td>
                <td style={{ textAlign: 'right', padding: '0.75rem', color: '#2F7D4A', fontSize: '1.25rem' }}>
                  ₹{amountPaid.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid #252A2E', fontWeight: 700 }}>
                <td style={{ padding: '0.6rem 0.75rem', color: remainingDue > 0 ? '#A83D3D' : '#2F7D4A' }}>
                  Remaining Balance Outstanding
                </td>
                <td style={{ textAlign: 'right', padding: '0.6rem 0.75rem', color: remainingDue > 0 ? '#A83D3D' : '#2F7D4A', fontSize: '0.95rem' }}>
                  ₹{remainingDue.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {notes && (
            <div style={{ fontSize: '0.78rem', color: '#7A8288', marginBottom: '1.25rem', fontStyle: 'italic' }}>
              Note: {notes}
            </div>
          )}

          {/* Footer Notice & Signature */}
          <div style={{ borderTop: '1px dashed #252A2E', paddingTop: '1.25rem', marginTop: '1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#4B555D', maxWidth: '300px' }}>
              <div style={{ fontWeight: 700, color: '#252A2E', marginBottom: '0.2rem' }}>Train Hard. Live Strong.</div>
              This is an authorized computer-generated payment receipt from Lee Gym, Pallapalayam.
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #252A2E', width: '130px', height: '35px', marginBottom: '0.35rem' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Authorized Signatory</div>
              <div style={{ fontSize: '0.65rem', color: '#7A8288' }}>Lee Gym Management</div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-receipt, #printable-receipt * {
              visibility: visible;
            }
            #printable-receipt {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20mm;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        ` }} />
      </div>
    </div>
  );
}
