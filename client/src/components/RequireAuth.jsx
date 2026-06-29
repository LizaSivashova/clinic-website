import { Navigate } from 'react-router-dom';
import { getToken } from '../hooks/useAuth';

// Gate for the admin dashboard — redirects to login when no token is present.
export default function RequireAuth({ children }) {
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
