import { useIsAuthenticated } from "react-auth-kit";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
