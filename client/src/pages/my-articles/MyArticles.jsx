import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import useAuth from '../../auth/useAuth';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import ConfirmationDialog from '../../components/confirmation-dialog/ConfirmationDialog.jsx';
import StatusMessage from '../../components/status-message/StatusMessage.jsx';
import usePageTitle from '../../hooks/usePageTitle';
import {
  fallbackImage,
  formatArticleDate,
  handleImageFallback,
  normalizeArticleId,
  resolveImageUrl,
  safeText,
  toDateTime,
} from '../../utils/articles';
import styles from './myArticles.module.css';

export default function MyArticles() {
  usePageTitle('My Articles');
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [status, setStatus] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const deletingRef = useRef('');

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      setLoading(true);
      setLoadError('');

      try {
        const result = await articleService.getByOwner(user._id);

        if (!ignore) {
          setArticles(result);
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, [user._id]);

  async function handleDelete() {
    const articleId = normalizeArticleId(deleteTarget);

    if (!articleId || deletingRef.current || !user?.accessToken) {
      return;
    }

    deletingRef.current = articleId;
    setDeletingId(articleId);
    setDeleteError('');

    try {
      await articleService.remove(articleId, user.accessToken);
      setArticles((current) => current.filter((article) => normalizeArticleId(article) !== articleId));
      setDeleteTarget(null);
      setStatus('Article deleted.');
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      deletingRef.current = '';
      setDeletingId('');
    }
  }

  const deleteTitle = safeText(deleteTarget?.title, 'this article');

  return (
    <main id="main-content" className={styles.container}>
      <section className={`${styles.hero} wrapper`}>
        <p className={styles.eyebrow}>Author dashboard</p>
        <h1 className="heading-1">My Articles</h1>
        <p className={`${styles.intro} paragraph-1`}>
          Review, open, edit, and remove the articles you created with the demo account.
        </p>
        <div className={styles.summary}>
          <strong>{articles.length}</strong>
          <span>{articles.length === 1 ? 'owned article' : 'owned articles'}</span>
        </div>
        <StatusMessage message={status} onClear={() => setStatus('')} />
      </section>

      <section className={`${styles.content} wrapper`}>
        {loading && <LoadingState message="Loading your articles..." />}
        {!loading && loadError && <ErrorState title="Could not load your articles" message={loadError} />}
        {!loading && !loadError && articles.length === 0 && (
          <div className={styles.empty}>
            <EmptyState
              title="No articles yet"
              message="Create your first article and it will appear in this dashboard."
            />
            <Link className={styles.createLink} to="/articles/create">Write Article</Link>
          </div>
        )}
        {!loading && !loadError && articles.length > 0 && (
          <div className={styles.grid}>
            {articles.map((article) => (
              <OwnedArticleCard
                key={normalizeArticleId(article)}
                article={article}
                isDeleting={deletingId === normalizeArticleId(article)}
                onDelete={() => {
                  setDeleteTarget(article);
                  setDeleteError('');
                }}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete this article?"
        description={`This will permanently delete "${deleteTitle}".`}
        confirmLabel="Delete article"
        isBusy={Boolean(deletingId)}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deletingId) {
            setDeleteTarget(null);
            setDeleteError('');
          }
        }}
      />
      {deleteTarget && deleteError && (
        <div className={`${styles.dialogError} wrapper`} role="alert">{deleteError}</div>
      )}
    </main>
  );
}

function OwnedArticleCard({ article, isDeleting, onDelete }) {
  const articleId = normalizeArticleId(article);
  const title = safeText(article.title, 'Untitled article');
  const category = safeText(article.category, 'General');
  const createdOn = article._createdOn || article.createdOn;
  const readingTime = Number.isFinite(Number(article.readingTime)) ? Number(article.readingTime) : 3;

  return (
    <article className={styles.card}>
      <Link className={styles.imageLink} to={`/articles/${articleId}`} aria-label={`View ${title}`}>
        <img
          src={resolveImageUrl(article.imageUrl)}
          alt={title}
          onError={(event) => handleImageFallback(event, fallbackImage)}
        />
      </Link>
      <div className={styles.cardBody}>
        <p className={styles.category}>{category}</p>
        <h2 className="sub-heading-2">{title}</h2>
        <div className={styles.meta}>
          <time dateTime={toDateTime(createdOn)}>{formatArticleDate(createdOn)}</time>
          <span aria-hidden="true">.</span>
          <span>{readingTime} min read</span>
        </div>
        <div className={styles.actions}>
          <Link to={`/articles/${articleId}`}>View</Link>
          <Link to={`/articles/${articleId}/edit`}>Edit</Link>
          <button type="button" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
