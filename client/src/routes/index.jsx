import { Routes, Route } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

import Home from '../pages/public/Home.jsx';
import About from '../pages/public/About.jsx';
import Programs from '../pages/public/Programs.jsx';
import Trainers from '../pages/public/Trainers.jsx';
import Membership from '../pages/public/Membership.jsx';
import Gallery from '../pages/public/Gallery.jsx';
import Contact from '../pages/public/Contact.jsx';

import Login from '../pages/Login.jsx';

import Dashboard from '../pages/admin/Dashboard.jsx';
import Members from '../pages/admin/Members.jsx';
import MemberDetail from '../pages/admin/MemberDetail.jsx';
import MemberNew from '../pages/admin/MemberNew.jsx';
import Payments from '../pages/admin/Payments.jsx';
import Plans from '../pages/admin/Plans.jsx';
import Notifications from '../pages/admin/Notifications.jsx';
import Settings from '../pages/admin/Settings.jsx';

// Routing architecture placeholder.
// Route protection/authentication logic is not implemented yet.
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth route */}
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="members/new" element={<MemberNew />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="payments" element={<Payments />} />
        <Route path="plans" element={<Plans />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
