import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import styles from '../auth/authForm.module.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, authError, clearAuthError, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const errorRef = useRef(null);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const from = location.state?.from || { pathname: '/' };

  useEffect(() => {
    clearAuthError();
    return () => clearAuthError();
  }, [clearAuthError]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearAuthError();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    try {
      const session = await login(values.email.trim(), values.password);

      if (session) {
        setValues((current) => ({ ...current, password: '' }));
        navigate(from, { replace: true });
      }
    } catch {
      setValues((current) => ({ ...current, password: '' }));
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function focusFirstError(nextErrors) {
    if (nextErrors.email) {
      emailRef.current?.focus();
    } else if (nextErrors.password) {
      passwordRef.current?.focus();
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.panel}>
        <p className={styles.brand}>Hristian .Blog</p>
        <h1 className={styles.title}>Sign in to your account</h1>
        <p className={styles.intro}>Continue reading and prepare for authenticated article actions in the next milestone.</p>

        {authError && (
          <div ref={errorRef} tabIndex={-1} className={styles.errorSummary} role="alert">
            {authError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <span id="password-error" className={styles.fieldError}>{errors.password}</span>}
          </div>

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={styles.footer}>
          Not a member? <Link to="/register" state={{ from }}>Create an account</Link>
        </p>
      </section>
    </main>
  );
}

function validate(values) {
  const errors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}
