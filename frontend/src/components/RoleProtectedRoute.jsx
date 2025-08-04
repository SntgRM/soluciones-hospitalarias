import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("userRole");

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;