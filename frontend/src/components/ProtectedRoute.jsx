import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("🔥 ProtectedRoute - User:", user, "Required role:", role, "Current path:", location.pathname);

  // If no user is logged in, redirect to login
  if (!user) {
    console.log("🔥 ProtectedRoute - No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Special handling for admin/manager routes
  if (role === 'admin' && location.pathname.startsWith('/admin')) {
    // If user is manager but trying to access admin routes, redirect to manager equivalent
    if (user.role === 'manager') {
      const managerPath = location.pathname.replace('/admin', '/manager');
      console.log("🔥 ProtectedRoute - Manager accessing admin route, redirecting to:", managerPath);
      return <Navigate to={managerPath} replace />;
    }
    
    // If user is not admin or manager, redirect to home
    if (user.role !== 'admin') {
      console.log("🔥 ProtectedRoute - User role mismatch for admin route. User role:", user.role);
      return <Navigate to="/" replace />;
    }
  }

  // For manager routes, allow both manager and admin
  if (role === 'manager' && location.pathname.startsWith('/manager')) {
    if (user.role !== 'manager' && user.role !== 'admin') {
      console.log("🔥 ProtectedRoute - User role mismatch for manager route. User role:", user.role);
      return <Navigate to="/" replace />;
    }
  }

  // Standard role check for other routes
  if (role && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/manager')) {
    if (user.role !== role) {
      console.log("🔥 ProtectedRoute - User role mismatch. User role:", user.role, "Required:", role);
      return <Navigate to="/" replace />;
    }
  }

  console.log("🔥 ProtectedRoute - Access granted");
  return children;
};

export default ProtectedRoute; 