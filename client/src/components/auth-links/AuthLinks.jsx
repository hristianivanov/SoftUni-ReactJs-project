import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import styles from './authLinks.module.css';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

export default function AuthLinks() {
  const { user, isAuthenticated, logout, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate('/', { replace: true });
  }

  return (
    <>
      <div className={styles.container}>
        {isAuthenticated ? (
          <>
            <span className={styles.userEmail} title={user.email}>{user.email}</span>
            <button className={styles.link} type="button" onClick={handleLogout} disabled={isSubmitting}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={styles.link} to="/login">Login</Link>
            <Link className={styles.link} to="/register">Register</Link>
          </>
        )}
      </div>
      <button
        className={styles.burger}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>
      {open && (
        <nav id="mobile-navigation" className={styles.responsiveMenu} aria-label="Mobile navigation">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              className={styles.cta}
              to={link.to}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <span className={styles.mobileUser}>{user.email}</span>
              <button className={styles.ctaButton} type="button" onClick={handleLogout} disabled={isSubmitting}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={styles.cta} to="/login" onClick={closeMenu}>Login</Link>
              <Link className={styles.cta} to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </nav>
      )}
    </>
  );
}
