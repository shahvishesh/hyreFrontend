import { jwtDecode } from "jwt-decode";

/**
 * Get the current user's roles from JWT token
 * @returns {Array<string>} Array of role strings
 */
export const getUserRoles = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];
    
    const decoded = jwtDecode(token);
    return decoded.roles || [];
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
};

/**
 * Check if user has at least one of the specified roles
 * @param {Array<string>} allowedRoles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasRole = (allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  const userRoles = getUserRoles();
  return allowedRoles.some(role => userRoles.includes(role));
};

/**
 * Check if user has all of the specified roles
 * @param {Array<string>} requiredRoles - Array of roles to check
 * @returns {boolean} True if user has all roles
 */
export const hasAllRoles = (requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  
  const userRoles = getUserRoles();
  return requiredRoles.every(role => userRoles.includes(role));
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Get decoded token data
 * @returns {object|null} Decoded token or null
 */
export const getTokenData = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
