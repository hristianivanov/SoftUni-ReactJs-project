import { Link } from 'react-router-dom';
import styles from './sectionNameAndLink.module.css';

export default function SectionNameAndLink({
  sectionNameText,
  sectionLinkText,
  to = '/articles',
}) {
  return (
    <div className={styles.container}>
      <div className={styles.sectionName}>
        <h2 className="sub-heading-1">{sectionNameText}</h2>
        <img className={styles.line} src="/svg/line.svg" alt="" />
      </div>
      <Link to={to} className={styles.link}>
        <span className="sub-heading-2">See All {sectionLinkText}</span>
        <img className={styles.arrow} src="/svg/arrow.svg" alt="" />
      </Link>
    </div>
  );
}
