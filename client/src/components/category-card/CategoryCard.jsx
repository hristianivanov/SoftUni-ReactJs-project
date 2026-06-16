import { Link } from 'react-router-dom';
import styles from './categoryCard.module.css';

export default function CategoryCard({
  name,
  icon = '/svg/css.svg',
  articleCount = 0,
  destination,
  onClick,
}) {
  const content = (
    <>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={icon} alt={`${name} category`} />
      </div>
      <div className={styles.text}>
        <div className={`${styles.name} sub-heading-2`}>{name}</div>
        <div className={styles.count}>{articleCount} articles</div>
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      {destination ? (
        <Link className={styles.content} to={destination}>
          {content}
        </Link>
      ) : (
        <button className={styles.content} type="button" onClick={onClick}>
          {content}
        </button>
      )}
      <div className={styles.background} aria-hidden="true" />
    </div>
  );
}
