import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import OwnerLayout from '../layouts/OwnerLayout.jsx';

import Home from '../pages/public/Home.jsx';
import About from '../pages/public/About.jsx';
import Programs from '../pages/public/Programs.jsx';
import Membership from '../pages/public/Membership.jsx';
import Gallery from '../pages/public/Gallery.jsx';
import Contact from '../pages/public/Contact.jsx';

// Dedicated Owner Portal Pages
import Login from '../pages/owner/Login.jsx';
import Dashboard from '../pages/owner/Dashboard.jsx';
import Members from '../pages/owner/Members.jsx';
import MemberDetail from '../pages/owner/MemberDetail.jsx';
import MemberNew from '../pages/owner/MemberNew.jsx';
import Plans from '../pages/owner/Plans.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes (Untouched) ──────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ── Auth Routes ────────────────────────────────────────────── */}
      <Route path="/owner/login" element={<Login />} />
      <Route path="/login" element={<Navigate to="/owner/login" replace />} />
      <Route path="/admin/login" element={<Navigate to="/owner/login" replace />} />

      {/* ── Dedicated Owner Workspace ──────────────────────────────── */}
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="members/new" element={<MemberNew />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="plans" element={<Plans />} />
      </Route>

      {/* ── Backward Compatibility / Admin Aliases ─────────────────── */}
      <Route path="/admin" element={<Navigate to="/owner/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/owner/dashboard" replace />} />
      <Route path="/admin/members" element={<Navigate to="/owner/members" replace />} />
      <Route path="/admin/members/new" element={<Navigate to="/owner/members/new" replace />} />
      <Route path="/admin/members/:id" element={<Navigate to="/owner/members" replace />} />
      <Route path="/admin/plans" element={<Navigate to="/owner/plans" replace />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
