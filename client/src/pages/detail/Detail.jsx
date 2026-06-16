import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import * as commentService from '../../api/commentService';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import {
  fallbackAvatar,
  fallbackImage,
  formatArticleDate,
  normalizeArticleId,
} from '../../utils/articles';
import styles from './detailPage.module.css';

function Detail() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      try {
        const [articleResult, commentResult] = await Promise.all([
          articleService.getById(articleId),
          commentService.getByArticleId(articleId),
        ]);

        if (!ignore) {
          if (!articleResult) {
            setNotFound(true);
          } else {
            setArticle(articleResult);
            setComments(commentResult);
          }

          setError('');
        }
      } catch (err) {
        if (!ignore) {
          if (/not found|404/i.test(err.message)) {
            setNotFound(true);
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      ignore = true;
    };
  }, [articleId]);

  if (loading) {
    return (
      <main className={`${styles.container} wrapper`}>
        <LoadingState message="Loading article..." />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className={`${styles.container} wrapper`}>
        <ErrorState
          title="Article not found"
          message="The article you are looking for is missing or was removed."
          actionLabel="Back to articles"
          actionTo="/articles"
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className={`${styles.container} wrapper`}>
        <ErrorState title="Could not load article" message={error} />
      </main>
    );
  }

  const createdOn = article._createdOn || article.createdOn;
  const authorName = article.authorName || 'Hristian Ivanov';
  const articleKey = normalizeArticleId(article);

  return (
    <main className={styles.container}>
      <article className={`${styles.article} wrapper`}>
        <Link className={styles.backLink} to="/articles">Back to articles</Link>
        <header className={styles.header}>
          <p className={styles.category}>{article.category || 'General'}</p>
          <h1 className="heading-1">{article.title}</h1>
          <p className={`${styles.summary} paragraph-1`}>{article.summary}</p>
          <div className={styles.meta}>
            <img src={article.authorAvatar || fallbackAvatar} alt={`${authorName} avatar`} />
            <div>
              <strong>{authorName}</strong>
              <div className={styles.metaText}>
                <time dateTime={createdOn ? new Date(createdOn).toISOString() : undefined}>
                  {formatArticleDate(createdOn)}
                </time>
                <span aria-hidden="true">.</span>
                <span>{article.readingTime || 3} min read</span>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.imageContainer}>
          <img src={article.imageUrl || fallbackImage} alt={article.title} />
        </div>
        <div className={styles.content}>
          {article.content.split('\n').map((paragraph) => (
            <p key={`${articleKey}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className={`${styles.comments} wrapper`} aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="sub-heading-1">Comments</h2>
        {comments.length === 0 ? (
          <EmptyState
            title="No comments yet"
            message="Commenting will be available after authentication is connected."
          />
        ) : (
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment._id || comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <img src={comment.authorAvatar || fallbackAvatar} alt={`${comment.authorName || 'Reader'} avatar`} />
                  <div>
                    <strong>{comment.authorName || 'Reader'}</strong>
                    <time dateTime={comment._createdOn ? new Date(comment._createdOn).toISOString() : undefined}>
                      {formatArticleDate(comment._createdOn)}
                    </time>
                  </div>
                </div>
                <p>{comment.text || comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Detail;
