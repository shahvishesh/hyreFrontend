import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * ProtectedRoute component for role-based access control
 * @param {Array<string>} allowedRoles - Array of roles that can access this route (optional)
 * @param {boolean} requireAll - If true, user must have ALL roles; if false, user needs ANY role (default: false)
 */
export default function ProtectedRoute({ allowedRoles = null, requireAll = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  try {
    const decodedToken = jwtDecode(token);
    
    const userRoles = decodedToken.roles || [];

    const hasAccess = requireAll
      ? allowedRoles.every(role => userRoles.includes(role)) // User must have ALL roles
      : allowedRoles.some(role => userRoles.includes(role));  // User needs ANY role

    return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
    
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
