import { Outlet } from 'react-router-dom';

// Placeholder layout for the owner/admin portal.
// No visual design has been implemented yet.
function AdminLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
