import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as authService from '../api/authService';
import { clearSession, getSession, setSession } from './sessionStorage';
import AuthContext from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const runAuthRequest = useCallback(async (request) => {
    if (submittingRef.current) {
      return null;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setAuthError('');

    try {
      const session = await request();
      setSession(session);

      if (mountedRef.current) {
        setUser(session);
      }

      return session;
    } catch (error) {
      if (mountedRef.current) {
        setAuthError(error.message);
      }

      throw error;
    } finally {
      submittingRef.current = false;

      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, []);

  const register = useCallback((email, password) => (
    runAuthRequest(() => authService.register(email, password))
  ), [runAuthRequest]);

  const login = useCallback((email, password) => (
    runAuthRequest(() => authService.login(email, password))
  ), [runAuthRequest]);

  const logout = useCallback(async () => {
    const token = user?.accessToken;

    try {
      if (token) {
        await authService.logout(token);
      }
    } catch {
      // Client state must be cleared even if the local practice server rejects logout.
    } finally {
      clearSession();
      setUser(null);
      setAuthError('');
    }
  }, [user?.accessToken]);

  const clearAuthError = useCallback(() => {
    setAuthError('');
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    authError,
    clearAuthError,
    isSubmitting,
  }), [authError, clearAuthError, isSubmitting, login, logout, register, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
