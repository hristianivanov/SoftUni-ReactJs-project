import { Link } from 'react-router-dom';
import {
  fallbackAvatar,
  fallbackImage,
  formatArticleDate,
  handleImageFallback,
  normalizeArticleId,
  resolveImageUrl,
  safeText,
  toDateTime,
} from '../../utils/articles';
import styles from './postCard.module.css';

export default function PostCard({ article }) {
  const articleId = normalizeArticleId(article);
  const title = safeText(article?.title, 'Untitled article');
  const authorName = safeText(article?.authorName, 'Hristian Ivanov');
  const readingTime = Number.isFinite(Number(article?.readingTime)) ? Number(article.readingTime) : 3;
  const imageUrl = resolveImageUrl(article?.imageUrl);
  const authorAvatar = resolveImageUrl(article?.authorAvatar, fallbackAvatar);
  const createdOn = article?._createdOn || article?.createdOn;

  return (
    <article className={styles.postCard}>
      <Link to={articleId ? `/articles/${articleId}` : '/articles'} className={styles.articleLink}>
        <div className={styles.articleImage}>
          <img src={imageUrl} alt={title} onError={(event) => handleImageFallback(event, fallbackImage)} />
        </div>
        <h3 className={`${styles.articleTitle} sub-heading-2`}>{title}</h3>
      </Link>

      <div className={styles.articleMetaInfo}>
        <div className={styles.authorImage}>
          <img src={authorAvatar} alt={`${authorName} avatar`} onError={(event) => handleImageFallback(event, fallbackAvatar)} />
        </div>
        <div className={styles.metaText}>
          <span className={`${styles.author} paragraph-3`}>{authorName}</span>
          <div className={`${styles.dateReadingTime} paragraph-4`}>
            <time dateTime={toDateTime(createdOn)}>
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
