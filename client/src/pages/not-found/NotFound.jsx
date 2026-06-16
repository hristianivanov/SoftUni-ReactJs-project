import { Link } from 'react-router-dom';
import styles from './notFound.module.css';

export default function NotFound() {
  return (
    <main className={`${styles.container} wrapper`}>
      <section className={styles.content}>
        <p>404</p>
        <h1 className="heading-1">Page not found</h1>
        <span className="paragraph-1">
          The page you requested does not exist. The article catalog is a good place to get back on track.
        </span>
        <Link to="/articles">Browse articles</Link>
      </section>
    </main>
  );
}
