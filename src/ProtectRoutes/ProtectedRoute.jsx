import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../src/ProtectRoutes/ProtectedRoute";

const ProtectedRoute = ({ roles }) => {
  const { auth } = useAuth();

  if (!auth.token) return <Navigate to="/login" />;

  if (roles && !roles.includes(auth.role))
    return <Navigate to="/unauthorized" />;

  return <Outlet />;
};
