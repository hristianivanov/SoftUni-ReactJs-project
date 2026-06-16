import { Link } from 'react-router-dom';
import styles from './appState.module.css';

export function LoadingState({ message = 'Loading content...' }) {
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, actionLabel, actionTo }) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && <Link to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className={styles.state}>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
    </div>
  );
}
