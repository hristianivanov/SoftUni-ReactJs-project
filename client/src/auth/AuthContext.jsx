import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as authService from '../api/authService';
import { clearSession, getSession, setSession } from './sessionStorage';
import AuthContext from './authContext';

export const SESSION_EXPIRED_MESSAGE = 'Your session expired. Please sign in again.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [authError, setAuthError] = useState('');
  const [sessionMessage, setSessionMessage] = useState('');
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
        setSessionMessage('');
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
      setSessionMessage('');
    }
  }, [user?.accessToken]);

  const handleInvalidSession = useCallback((reason = SESSION_EXPIRED_MESSAGE) => {
    clearSession();

    if (mountedRef.current) {
      setUser(null);
      setAuthError('');
      setSessionMessage(reason);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError('');
  }, []);

  const clearSessionMessage = useCallback(() => {
    setSessionMessage('');
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    handleInvalidSession,
    authError,
    clearAuthError,
    sessionMessage,
    clearSessionMessage,
    isSubmitting,
  }), [
    authError,
    clearAuthError,
    clearSessionMessage,
    handleInvalidSession,
    isSubmitting,
    login,
    logout,
    register,
    sessionMessage,
    user,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
