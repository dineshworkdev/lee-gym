import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Phone,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Snowflake,
  Archive,
} from 'lucide-react';
import { useOwnerGym, formatDate } from '../../context/OwnerGymContext.jsx';

export default function Members() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { members, memberEvaluator } = useOwnerGym();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const initialFilter = searchParams.get('filter') || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  // Sync state if query param changes
  useEffect(() => {
    const qFilter = searchParams.get('filter');
    if (qFilter && ['all', 'active', 'expired', 'due', 'today', 'soon', 'frozen', 'archived'].includes(qFilter)) {
      setActiveFilter(qFilter);
    }
  }, [searchParams]);

  // Update query param on filter change
  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setSearchParams(filterKey === 'all' ? {} : { filter: filterKey });
    setCurrentPage(1);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter and Search logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const evalStatus = memberEvaluator(member);

      // Handle archive filter explicitly: hide archived by default unless 'archived' filter is active
      if (activeFilter !== 'archived' && evalStatus.isArchived) {
        return false;
      }

      // 1. Filter match
      if (activeFilter === 'active' && !evalStatus.isActive) return false;
      if (activeFilter === 'expired' && !evalStatus.isExpired) return false;
      if (activeFilter === 'due' && !evalStatus.isDue) return false;
      if (activeFilter === 'today' && !evalStatus.isExpiringToday) return false;
      if (activeFilter === 'soon' && !evalStatus.isExpiringSoon) return false;
      if (activeFilter === 'frozen' && !evalStatus.isFrozen) return false;
      if (activeFilter === 'archived' && !evalStatus.isArchived) return false;

      // 2. Search match (name, mobile, member ID, plan)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (member.name || '').toLowerCase().includes(query);
        const matchesMobile = (member.mobile || '').includes(query);
        const matchesId = (member.id || '').toLowerCase().includes(query);
        const matchesPlan = (member.planName || '').toLowerCase().includes(query);
        if (!matchesName && !matchesMobile && !matchesId && !matchesPlan) {
          return false;
        }
      }

      return true;
    });
  }, [members, activeFilter, searchQuery, memberEvaluator]);

  // Compute total counts for filter pill badges
  const filterCounts = useMemo(() => {
    let all = 0;
    let active = 0;
    let expired = 0;
    let due = 0;
    let frozen = 0;
    let archived = 0;

    members.forEach((m) => {
      const evalStatus = memberEvaluator(m);
      if (evalStatus.isArchived) {
        archived++;
        return; // Don't count archived in regular active/due/expired counts
      }
      all++;
      if (evalStatus.isActive) active++;
      if (evalStatus.isExpired) expired++;
      if (evalStatus.isDue) due++;
      if (evalStatus.isFrozen) frozen++;
    });

    return { all, active, expired, due, frozen, archived };
  }, [members, memberEvaluator]);

  // Paginated slice
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── HEADER & ACTIONS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
              letterSpacing: '0.04em',
              color: '#252A2E',
              margin: 0,
              lineHeight: 1,
            }}
          >
            MEMBERS DIRECTORY
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.88rem', color: '#4B555D', margin: '0.35rem 0 0' }}>
            Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} in {activeFilter.toUpperCase()} view
          </p>
        </div>

        {/* + Add Member button */}
        <Link
          to="/owner/members/new"
          id="members-add-member-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            backgroundColor: '#F4C400',
            color: '#252A2E',
            border: '2px solid #252A2E',
            padding: '0.75rem 1.4rem',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '3px 3px 0px #252A2E',
            cursor: 'pointer',
          }}
        >
          <UserPlus size={18} />
          <span>+ ADD MEMBER</span>
        </Link>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ───────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #252A2E',
          boxShadow: '4px 4px 0px #252A2E',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input (Name, Mobile, ID) */}
        <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
          <div
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#4B555D',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search size={18} />
          </div>
          <input
            id="members-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, mobile, or member ID..."
            style={{
              width: '100%',
              padding: '0.65rem 2.2rem 0.65rem 2.4rem',
              border: '1.5px solid #252A2E',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.9rem',
              color: '#252A2E',
              backgroundColor: '#FAF8F4',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4B555D',
                padding: '0.2rem',
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#4B555D',
              marginRight: '0.25rem',
            }}
          >
            <Filter size={14} />
            <span>Filter:</span>
          </span>

          {[
            { id: 'all', label: 'All', count: filterCounts.all },
            { id: 'active', label: 'Active', count: filterCounts.active },
            { id: 'due', label: 'Due', count: filterCounts.due },
            { id: 'expired', label: 'Expired', count: filterCounts.expired },
            { id: 'frozen', label: 'Frozen', count: filterCounts.frozen },
            { id: 'archived', label: 'Archived', count: filterCounts.archived },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-btn-${tab.id}`}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                style={{
                  padding: '0.45rem 0.8rem',
                  border: '1.5px solid #252A2E',
                  backgroundColor: isSelected ? '#252A2E' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#252A2E',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 100ms ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? '#F4C400' : 'rgba(37, 42, 46, 0.1)',
                    color: '#252A2E',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.35rem',
                    borderRadius: '2px',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP MEMBER TABLE ────────────────────────────────────── */}
      <div
        className="hidden md:block"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #252A2E',
          boxShadow: '4px 4px 0px #252A2E',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {paginatedMembers.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <AlertCircle size={36} color="#4B555D" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.75rem', color: '#252A2E', margin: 0 }}>
              NO MEMBERS FOUND
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4B555D', margin: '0.4rem 0 1rem' }}>
              No members matched your search or active filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setSearchParams({});
              }}
              style={{
                backgroundColor: '#252A2E',
                color: '#FFFFFF',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#252A2E', color: '#FFFFFF' }}>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Member ID
                  </th>
                  <th style={{ padding: '0.9rem 0.75rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Photo
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Name
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Mobile
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Plan
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Expiry Date
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Payment Status
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, idx) => {
                  const evalStatus = memberEvaluator(member);
                  return (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4',
                        transition: 'background-color 100ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFBEA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4';
                      }}
                    >
                      {/* ID */}
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.85rem', color: '#252A2E' }}>
                        {member.id}
                      </td>

                      {/* Photo Thumbnail */}
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#252A2E',
                            color: '#F4C400',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                          }}
                        >
                          {member.photo || member.photoUrl ? (
                            <img
                              src={member.photo || member.photoUrl}
                              alt={member.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            member.name?.charAt(0) || 'L'
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#252A2E' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4B555D' }}>{member.gender || 'Member'}</div>
                      </td>

                      {/* Mobile */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#252A2E', fontFamily: 'monospace' }}>
                        {member.mobile}
                      </td>

                      {/* Plan */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.88rem', fontWeight: 600, color: '#252A2E' }}>
                        {member.planName}
                      </td>

                      {/* Expiry */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#252A2E' }}>
                          {formatDate(member.expiryDate)}
                        </div>
                        {evalStatus.isExpiringToday && (
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#F4C400',
                              color: '#252A2E',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.1rem 0.4rem',
                            }}
                          >
                            TODAY
                          </span>
                        )}
                      </td>

                      {/* Payment Status (Paid / Due) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {evalStatus.isDue ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#FDF2F2',
                              color: '#A83D3D',
                              border: '1px solid #A83D3D',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.6rem',
                            }}
                          >
                            Due: ₹{evalStatus.dueAmount}
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#F2F9F4',
                              color: '#2F7D4A',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.6rem',
                            }}
                          >
                            Paid
                          </span>
                        )}
                      </td>

                      {/* Membership Status Badge */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: evalStatus.badgeBg,
                            color: evalStatus.badgeColor,
                            border: `1px solid ${evalStatus.badgeColor}`,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {evalStatus.badgeLabel}
                        </span>
                      </td>

                      {/* Action -> View Details */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Link
                          to={`/owner/members/${member.id}`}
                          id={`member-view-btn-${member.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#252A2E',
                            color: '#FFFFFF',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            borderRadius: '2px',
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MOBILE MEMBER CARDS ─────────────────────────────────────── */}
      <div className="flex md:hidden flex-col gap-3 mb-6">
        {paginatedMembers.map((member) => {
          const evalStatus = memberEvaluator(member);
          return (
            <div
              key={member.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #252A2E',
                boxShadow: '3px 3px 0px #252A2E',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#252A2E',
                      color: '#F4C400',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {member.name?.charAt(0) || 'L'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#252A2E' }}>{member.name}</div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.75rem', color: '#4B555D' }}>
                      {member.id}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: evalStatus.badgeBg,
                    color: evalStatus.badgeColor,
                    border: `1px solid ${evalStatus.badgeColor}`,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                  }}
                >
                  {evalStatus.badgeLabel}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
                <div>Plan: <strong>{member.planName}</strong></div>
                <div>Expiry: <strong>{formatDate(member.expiryDate)}</strong></div>
                <div>Phone: <strong style={{ fontFamily: 'monospace' }}>{member.mobile}</strong></div>
                <div>
                  Payment:{' '}
                  {evalStatus.isDue ? (
                    <strong style={{ color: '#A83D3D' }}>Due ₹{evalStatus.dueAmount}</strong>
                  ) : (
                    <strong style={{ color: '#2F7D4A' }}>Paid</strong>
                  )}
                </div>
              </div>

              <Link
                to={`/owner/members/${member.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#252A2E',
                  color: '#FFFFFF',
                  padding: '0.65rem',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                <Eye size={16} />
                <span>View Full Profile</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── PAGINATION CONTROLS ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 0',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>
            Page {currentPage} of {totalPages} ({filteredMembers.length} total members)
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 0.9rem',
                border: '1.5px solid #252A2E',
                backgroundColor: '#FFFFFF',
                color: '#252A2E',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.55rem 0.9rem',
                border: '1.5px solid #252A2E',
                backgroundColor: '#FFFFFF',
                color: '#252A2E',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
