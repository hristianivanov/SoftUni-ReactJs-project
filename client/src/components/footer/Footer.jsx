import { Link } from 'react-router-dom';
import Logo from '../logo/Logo.jsx';
import styles from './footer.module.css';

const categories = ['JavaScript', 'React', 'API', 'Routing'];

export default function Footer() {
  return (
    <footer className={styles.container}>
      <div className="wrapper">
        <div className={styles.topContainer}>
          <div className={styles.siteAbout}>
            <Logo />
            <p className="paragraph-2">Developer notes by Hristian Ivanov</p>
            <ul className={styles.socialLinks} aria-label="Social links">
              <li><a className={styles.link} href="https://github.com" aria-label="GitHub"><img src="/svg/monogram.svg" alt="" /></a></li>
              <li><a className={styles.link} href="https://twitter.com" aria-label="Twitter"><img src="/svg/twitter.svg" alt="" /></a></li>
              <li><a className={styles.link} href="https://instagram.com" aria-label="Instagram"><img src="/svg/instagram.svg" alt="" /></a></li>
              <li><a className={styles.link} href="https://linkedin.com" aria-label="LinkedIn"><img src="/svg/linkedin.svg" alt="" /></a></li>
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
                <li><Link className={styles.link} to="/login">Login</Link></li>
                <li><Link className={styles.link} to="/register">Register</Link></li>
              </ul>
            </li>
            <li className={styles.navSection}>
              <h2 className={styles.navTitle}>Get in touch</h2>
              <ul className={styles.navLinks}>
                <li><Link className={styles.link} to="/contact">Send a message</Link></li>
                <li><a className={styles.link} href="mailto:demo@local.test">demo@local.test</a></li>
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
