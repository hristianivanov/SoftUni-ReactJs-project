import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isInvalidSessionError } from './authErrors';
import useAuth from './useAuth';

export default function useInvalidSessionRedirect() {
  const { handleInvalidSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback((error, from = location) => {
    if (!isInvalidSessionError(error)) {
      return false;
    }

    handleInvalidSession();
    navigate('/login', {
      replace: true,
      state: { from },
    });

    return true;
  }, [handleInvalidSession, location, navigate]);
}
