import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import AuthLinks from '../auth-links/AuthLinks.jsx';
import Logo from '../logo/Logo.jsx';
import styles from './header.module.css';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.container}>
      <div className={`${styles.wrapper} wrapper`}>
        <Logo />
        <nav className={styles.links} aria-label="Main navigation">
          <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} to="/articles">Articles</NavLink>
          {isAuthenticated && (
            <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} to="/articles/create">
              Write article
            </NavLink>
          )}
          <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} to="/contact">Contact</NavLink>
          <Link className={styles.searchContainer} to="/articles" aria-label="Search articles">
            <img className={styles.searchIcon} src="/svg/search.svg" alt="" />
            <span className={styles.link}>Search</span>
          </Link>
        </nav>
        <AuthLinks />
      </div>
    </header>
  );
}
