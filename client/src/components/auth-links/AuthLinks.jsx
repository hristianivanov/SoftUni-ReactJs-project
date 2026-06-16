import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import styles from './authLinks.module.css';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

const authenticatedLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/articles/create', label: 'Write article' },
  { to: '/contact', label: 'Contact' },
];

export default function AuthLinks() {
  const { user, isAuthenticated, logout, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    document.body.classList.add('mobile-menu-open');

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    menuButtonRef.current?.focus();
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
        ref={menuButtonRef}
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
          {(isAuthenticated ? authenticatedLinks : publicLinks).map((link) => (
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
