import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import Logo from '../logo/Logo.jsx';
import styles from './header.module.css';

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

const authLinks = [
  { to: '/', label: 'Home' },
  { to: '/articles', label: 'Articles' },
  { to: '/my-articles', label: 'My Articles' },
  { to: '/articles/create', label: 'Write Article' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, isAuthenticated, logout, isSubmitting } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const links = isAuthenticated ? authLinks : guestLinks;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const firstFocusable = drawerRef.current?.querySelector(
      'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
    );

    document.body.classList.add('mobile-menu-open');
    firstFocusable?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = drawerRef.current?.querySelectorAll(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleResize() {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate('/', { replace: true });
  }

  return (
    <header className={styles.container}>
      <div className={`${styles.wrapper} wrapper`}>
        <Logo />
        <nav className={styles.links} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <Link className={styles.searchContainer} to="/articles" aria-label="Search articles">
            <img className={styles.searchIcon} src="/svg/search.svg" alt="" />
            <span className={styles.link}>Search</span>
          </Link>
        </nav>
        <div className={styles.authActions}>
          {isAuthenticated ? (
            <>
              <span className={styles.userEmail} title={user.email}>{user.email}</span>
              <button className={styles.authButton} type="button" onClick={handleLogout} disabled={isSubmitting}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={styles.authButton} to="/login">Login</Link>
              <Link className={styles.authButton} to="/register">Register</Link>
            </>
          )}
        </div>
        <button
          ref={menuButtonRef}
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
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
      </div>
      {open && <button className={styles.backdrop} type="button" aria-label="Close navigation menu" onClick={closeMenu} />}
      <nav
        id="mobile-navigation"
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.active : ''}`}
            to={link.to}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        {isAuthenticated ? (
          <>
            <span className={styles.mobileUser} title={user.email}>{user.email}</span>
            <button className={styles.drawerButton} type="button" onClick={handleLogout} disabled={isSubmitting}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={styles.drawerLink} to="/login" onClick={closeMenu}>Login</Link>
            <Link className={styles.drawerLink} to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
