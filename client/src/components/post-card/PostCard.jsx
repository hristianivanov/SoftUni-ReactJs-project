import { Link } from 'react-router-dom';
import { fallbackAvatar, fallbackImage, formatArticleDate, normalizeArticleId } from '../../utils/articles';
import styles from './postCard.module.css';

export default function PostCard({ article }) {
  const articleId = normalizeArticleId(article);
  const title = article?.title || 'Untitled article';
  const authorName = article?.authorName || 'Hristian Ivanov';
  const readingTime = article?.readingTime || 3;
  const imageUrl = article?.imageUrl || fallbackImage;
  const authorAvatar = article?.authorAvatar || fallbackAvatar;
  const createdOn = article?._createdOn || article?.createdOn;

  return (
    <article className={styles.postCard}>
      <Link to={`/articles/${articleId}`} className={styles.articleLink}>
        <div className={styles.articleImage}>
          <img src={imageUrl} alt={title} />
        </div>
        <h3 className={`${styles.articleTitle} sub-heading-2`}>{title}</h3>
      </Link>

      <div className={styles.articleMetaInfo}>
        <div className={styles.authorImage}>
          <img src={authorAvatar} alt={`${authorName} avatar`} />
        </div>
        <div className={styles.metaText}>
          <span className={`${styles.author} paragraph-3`}>{authorName}</span>
          <div className={`${styles.dateReadingTime} paragraph-4`}>
            <time dateTime={createdOn ? new Date(createdOn).toISOString() : undefined}>
              {formatArticleDate(createdOn)}
            </time>
            <span aria-hidden="true">.</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
