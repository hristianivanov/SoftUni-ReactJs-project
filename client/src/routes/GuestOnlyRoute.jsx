import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const fallback = location.state?.from || { pathname: '/' };

  if (isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
