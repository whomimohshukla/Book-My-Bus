import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import Unauthorized from "../Unauthorized/Unauthorized";

const ProtectedRoute = ({ allowedRoles, children }) => {
	const { user, isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-Darkgreen'></div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		console.log("Not authenticated, redirecting to login");
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	if (children) {
		return children;
	}

	if (!allowedRoles) {
		return <Outlet />;
	}

	const userRole = user.role?.toLowerCase();
	const hasAllowedRole = allowedRoles.some(
		(role) => role.toLowerCase() === userRole
	);

	if (!hasAllowedRole) {
		console.log("Access denied - role not allowed");
		return <Unauthorized />;
	}

	console.log("Access granted");
	return <Outlet />;
};

export default ProtectedRoute;
