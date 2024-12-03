import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Unauthorized from "../components/Unauthorized/Unauthorized";

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = useAuth();
  const location = useLocation();

  // // Debug log
  // console.log('ProtectedRoute check:', {
  //   isAuthenticated: auth?.isAuthenticated,
  //   currentRole: auth?.user?.role,
  //   allowedRoles,
  //   path: location.pathname
  // });

  // Not authenticated
  if (!auth?.isAuthenticated || !auth?.user) {
    // console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No roles specified = authenticated users only
  if (!allowedRoles) {
    return <Outlet />;
  }

  // Check if user's role is allowed
  const hasAllowedRole = allowedRoles.includes(auth.user.role);
  // console.log('Role check:', { hasAllowedRole, userRole: auth.user.role });

  if (!hasAllowedRole) {
    console.log('Unauthorized role');
    return <Unauthorized />;
  }

  // All checks passed
  return <Outlet />;
};

export default ProtectedRoute;