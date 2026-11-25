import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import EmptyState from './EmptyState';
import { LockIcon } from './Icons';

// Route guard.
//  - not logged in            -> sent to /login (we remember where they were going)
//  - logged in, wrong role    -> "access denied" screen
//  - allowed                  -> the page
// <ProtectedRoute>                         any logged in user
// <ProtectedRoute allowedRoles={['admin']}> admins only
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <EmptyState
        icon={<LockIcon className="h-6 w-6" />}
        title="Access denied"
        message="Your account does not have permission to open this page."
        actionLabel="Back to shop"
        actionTo="/"
      />
    );
  }

  return children;
}

export default ProtectedRoute;
