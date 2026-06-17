import { useEffect } from 'react';
import styles from './statusMessage.module.css';

export default function StatusMessage({ message, onClear, tone = 'success', timeout = 5000 }) {
  useEffect(() => {
    if (!message || !onClear) {
      return undefined;
    }

    const timer = window.setTimeout(onClear, timeout);

    return () => window.clearTimeout(timer);
  }, [message, onClear, timeout]);

  if (!message) {
    return null;
  }

  return (
    <p className={`${styles.message} ${styles[tone] || styles.success}`} role="status">
      {message}
    </p>
  );
}
