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
  CheckCircle2,
  XCircle,
  Calendar,
  X,
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
    if (qFilter && ['all', 'active', 'expired', 'due', 'today', 'soon'].includes(qFilter)) {
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
      const { isDue, isExpired, isActive, isExpiringToday, isExpiring1To3 } = memberEvaluator(member);

      // 1. Filter match
      if (activeFilter === 'active' && !isActive) return false;
      if (activeFilter === 'expired' && !isExpired) return false;
      if (activeFilter === 'due' && !isDue) return false;
      if (activeFilter === 'today' && !isExpiringToday) return false;
      if (activeFilter === 'soon' && !isExpiring1To3) return false;

      // 2. Search match (name, mobile, member ID)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (member.name || '').toLowerCase().includes(query);
        const matchesMobile = (member.mobile || '').includes(query);
        const matchesId = (member.id || '').toLowerCase().includes(query);
        if (!matchesName && !matchesMobile && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [members, activeFilter, searchQuery, memberEvaluator]);

  // Compute total counts for filter pill badges
  const filterCounts = useMemo(() => {
    let active = 0;
    let expired = 0;
    let due = 0;
    members.forEach((m) => {
      const { isDue, isExpired, isActive } = memberEvaluator(m);
      if (isActive) active++;
      if (isExpired) expired++;
      if (isDue) due++;
    });
    return { all: members.length, active, expired, due };
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
            MEMBERS
          </h1>
          <p style={{ fontFamily: 'var(--font-body, "Inter", sans-serif)', fontSize: '0.88rem', color: '#4B555D', margin: '0.35rem 0 0' }}>
            Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} in directory
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
            transition: 'transform 100ms ease, box-shadow 100ms ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(1px, 1px)';
            e.currentTarget.style.boxShadow = '2px 2px 0px #252A2E';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '3px 3px 0px #252A2E';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
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
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-btn-${tab.id}`}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  border: '1.5px solid #252A2E',
                  backgroundColor: isSelected ? '#252A2E' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#252A2E',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 100ms ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? '#F4C400' : 'rgba(37, 42, 46, 0.1)',
                    color: '#252A2E',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.4rem',
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
                    Expiry
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Payment Status
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Membership Status
                  </th>
                  <th style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, idx) => {
                  const { isDue, isExpired, isActive, isExpiringToday } = memberEvaluator(member);
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
                          }}
                        >
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            member.name.charAt(0)
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
                        {isExpiringToday && (
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
                        {isDue ? (
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
                            Due: ₹{member.amountDue}
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

                      {/* Membership Status (Active / Expired) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isActive ? (
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#2F7D4A',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#4B555D',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Link
                          to={`/owner/members/${member.id}`}
                          id={`view-member-${member.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: '#252A2E',
                            color: '#FFFFFF',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
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
        {paginatedMembers.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #252A2E',
              padding: '2.5rem 1rem',
              textAlign: 'center',
            }}
          >
            <AlertCircle size={32} color="#4B555D" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)', fontSize: '1.5rem', color: '#252A2E' }}>
              NO MEMBERS FOUND
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4B555D', margin: '0.4rem 0 0.8rem' }}>
              Try adjusting your search query or active filter.
            </p>
          </div>
        ) : (
          paginatedMembers.map((member) => {
            const { isDue, isActive, isExpiringToday } = memberEvaluator(member);
            return (
              <div
                key={member.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #252A2E',
                  boxShadow: '3px 3px 0px #252A2E',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
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
                        fontSize: '0.9rem',
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#252A2E' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#4B555D', fontFamily: 'monospace' }}>{member.id}</div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div>
                    {isActive ? (
                      <span style={{ backgroundColor: '#2F7D4A', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                        ACTIVE
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#4B555D', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
                        EXPIRED
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    padding: '0.65rem 0',
                    borderTop: '1px solid rgba(37, 42, 46, 0.08)',
                    borderBottom: '1px solid rgba(37, 42, 46, 0.08)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <span style={{ color: '#4B555D' }}>Mobile: </span>
                    <span style={{ fontWeight: 600, color: '#252A2E' }}>{member.mobile}</span>
                  </div>
                  <div>
                    <span style={{ color: '#4B555D' }}>Plan: </span>
                    <span style={{ fontWeight: 600, color: '#252A2E' }}>{member.planName}</span>
                  </div>
                  <div>
                    <span style={{ color: '#4B555D' }}>Expiry: </span>
                    <span style={{ fontWeight: 600, color: '#252A2E' }}>{formatDate(member.expiryDate)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#4B555D' }}>Payment: </span>
                    {isDue ? (
                      <span style={{ color: '#A83D3D', fontWeight: 800 }}>Due: ₹{member.amountDue}</span>
                    ) : (
                      <span style={{ color: '#2F7D4A', fontWeight: 700 }}>Paid</span>
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
                    width: '100%',
                    backgroundColor: '#252A2E',
                    color: '#FFFFFF',
                    padding: '0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  <Eye size={15} />
                  <span>View Member Profile</span>
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* ── PAGINATION CONTROLS ────────────────────────────────────── */}
      {filteredMembers.length > itemsPerPage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#FFFFFF',
            border: '2px solid #252A2E',
            boxShadow: '3px 3px 0px #252A2E',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#4B555D' }}>
            Showing{' '}
            <strong style={{ color: '#252A2E' }}>
              {(currentPage - 1) * itemsPerPage + 1}
            </strong>{' '}
            to{' '}
            <strong style={{ color: '#252A2E' }}>
              {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
            </strong>{' '}
            of <strong style={{ color: '#252A2E' }}>{filteredMembers.length}</strong> members
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.45rem 0.85rem',
                border: '1.5px solid #252A2E',
                backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                color: currentPage === 1 ? '#9CA3AF' : '#252A2E',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem' }}>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.45rem 0.85rem',
                border: '1.5px solid #252A2E',
                backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
                color: currentPage === totalPages ? '#9CA3AF' : '#252A2E',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
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
