import { Link } from 'react-router-dom';
import AuthLinks from '../auth-links/AuthLinks.jsx';
import Logo from '../logo/Logo.jsx';
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={`${styles.wrapper} wrapper`}>
        <Logo />
        <nav className={styles.links} aria-label="Main navigation">
          <Link className={styles.link} to="/">Home</Link>
          <Link className={styles.link} to="/articles">Articles</Link>
          <Link className={styles.link} to="/contact">Contact</Link>
          <Link className={styles.searchContainer} to="/articles">
            <img className={styles.searchIcon} src="/svg/search.svg" alt="" />
            <span className={styles.link}>Search</span>
          </Link>
        </nav>
        <AuthLinks />
      </div>
    </header>
  );
}
