import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import Logo from '../logo/Logo.jsx';
import styles from './footer.module.css';

const categories = ['JavaScript', 'React', 'API', 'Routing'];

export default function Footer() {
  const { isAuthenticated, logout, isSubmitting } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <footer className={styles.container}>
      <div className="wrapper">
        <div className={styles.topContainer}>
          <div className={styles.siteAbout}>
            <Logo />
            <p className="paragraph-2">Developer notes by Hristian Ivanov</p>
            <ul className={styles.socialLinks} aria-label="Contact links">
              <li><a className={styles.link} href="https://github.com/hristianivanov">GitHub</a></li>
              <li><a className={styles.link} href="https://hristianivanov.netlify.app/">Portfolio</a></li>
              <li><a className={styles.link} href="mailto:monstar.bog@gmail.com">Email</a></li>
            </ul>
          </div>
          <ul className={styles.navigation}>
            <li className={styles.navSection}>
              <h2 className={styles.navTitle}>Category</h2>
              <ul className={styles.navLinks}>
                {categories.map((category) => (
                  <li key={category}>
                    <Link className={styles.link} to={`/articles?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  </li>
                ))}
                <li><Link className={styles.link} to="/articles">All articles</Link></li>
              </ul>
            </li>
            <li className={styles.navSection}>
              <h2 className={styles.navTitle}>Explore</h2>
              <ul className={styles.navLinks}>
                <li><Link className={styles.link} to="/">Home</Link></li>
                <li><Link className={styles.link} to="/articles">Articles</Link></li>
                <li><Link className={styles.link} to="/contact">Contact</Link></li>
              </ul>
            </li>
            <li className={styles.navSection}>
              <h2 className={styles.navTitle}>Account</h2>
              <ul className={styles.navLinks}>
                {isAuthenticated ? (
                  <>
                    <li><Link className={styles.link} to="/articles/create">Write article</Link></li>
                    <li>
                      <button className={styles.footerButton} type="button" onClick={handleLogout} disabled={isSubmitting}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link className={styles.link} to="/login">Login</Link></li>
                    <li><Link className={styles.link} to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </li>
            <li className={styles.navSection}>
              <h2 className={styles.navTitle}>Get in touch</h2>
              <ul className={styles.navLinks}>
                <li><Link className={styles.link} to="/contact">Contact page</Link></li>
                <li><a className={styles.link} href="mailto:monstar.bog@gmail.com">Email Hristian</a></li>
              </ul>
            </li>
          </ul>
        </div>

        <div className={styles.bottomContainer}>
          <span>&copy; 2026 Hristian Blog</span>
          <span>Built as a ReactJS portfolio project</span>
        </div>
      </div>
    </footer>
  );
}
