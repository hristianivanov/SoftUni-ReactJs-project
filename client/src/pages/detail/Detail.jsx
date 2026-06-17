import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import * as commentService from '../../api/commentService';
import useAuth from '../../auth/useAuth';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import ConfirmationDialog from '../../components/confirmation-dialog/ConfirmationDialog.jsx';
import PostCard from '../../components/post-card/PostCard.jsx';
import StatusMessage from '../../components/status-message/StatusMessage.jsx';
import usePageTitle from '../../hooks/usePageTitle';
import {
  fallbackAvatar,
  fallbackImage,
  formatArticleDate,
  getParagraphs,
  handleImageFallback,
  normalizeArticleId,
  resolveImageUrl,
  safeText,
  toDateTime,
} from '../../utils/articles';
import { createAuthorFromUser } from '../../utils/authors';
import styles from './detailPage.module.css';

function Detail() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoadError, setCommentLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);
  const [articleActionError, setArticleActionError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentServerError, setCommentServerError] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [commentDeleteConfirmId, setCommentDeleteConfirmId] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState('');
  const [commentDeleteError, setCommentDeleteError] = useState('');
  const [status, setStatus] = useState(() => location.state?.message || '');
  const articleDeleteRef = useRef(false);
  const commentSaveRef = useRef(false);
  const commentDeleteRef = useRef('');

  usePageTitle(article?.title || 'Article details');

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    setStatus(location.state.message);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      setLoading(true);
      setError('');
      setNotFound(false);
      setArticleActionError('');

      try {
        const articleResult = await articleService.getById(articleId);

        if (!ignore) {
          if (!articleResult) {
            setNotFound(true);
          } else {
            setArticle(articleResult);
          }
        }
      } catch (err) {
        if (!ignore) {
          if (err.status === 404) {
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

  useEffect(() => {
    let ignore = false;

    async function loadRelatedArticles() {
      if (!article?.category) {
        setRelatedArticles([]);
        return;
      }

      try {
        const result = await articleService.getByCategory(article.category);

        if (!ignore) {
          setRelatedArticles(result
            .filter((candidate) => normalizeArticleId(candidate) !== articleId)
            .slice(0, 3));
        }
      } catch {
        if (!ignore) {
          setRelatedArticles([]);
        }
      }
    }

    loadRelatedArticles();

    return () => {
      ignore = true;
    };
  }, [article, articleId]);

  useEffect(() => {
    let ignore = false;

    async function loadComments() {
      setCommentsLoading(true);
      setCommentLoadError('');

      try {
        const commentResult = await commentService.getByArticleId(articleId);

        if (!ignore) {
          setComments(commentResult);
        }
      } catch (err) {
        if (!ignore) {
          setCommentLoadError(err.message);
        }
      } finally {
        if (!ignore) {
          setCommentsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      ignore = true;
    };
  }, [articleId]);

  async function handleArticleDelete() {
    if (articleDeleteRef.current || !user?.accessToken) {
      return;
    }

    articleDeleteRef.current = true;
    setIsDeletingArticle(true);
    setArticleActionError('');

    try {
      await articleService.remove(articleId, user.accessToken);
      navigate('/articles', { replace: true, state: { message: 'Article deleted.' } });
    } catch (err) {
      setArticleActionError(err.message);
    } finally {
      articleDeleteRef.current = false;
      setIsDeletingArticle(false);
    }
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (commentSaveRef.current || isSavingComment || !user?.accessToken) {
      return;
    }

    const text = commentText.trim();
    setCommentError('');
    setCommentServerError('');

    if (text.length < 3) {
      setCommentError('Comment must be at least 3 characters.');
      return;
    }

    if (text.length > 1000) {
      setCommentError('Comment cannot be longer than 1000 characters.');
      return;
    }

    commentSaveRef.current = true;
    setIsSavingComment(true);

    try {
      const author = createAuthorFromUser(user);
      const createdComment = await commentService.create({
        articleId,
        text,
        authorName: author.authorName,
      }, user.accessToken);

      setComments((current) => [...current, createdComment]);
      setCommentText('');
      setStatus('Comment posted.');
    } catch (err) {
      setCommentServerError(err.message);
    } finally {
      commentSaveRef.current = false;
      setIsSavingComment(false);
    }
  }

  async function handleCommentDelete(commentId) {
    if (commentDeleteRef.current || !user?.accessToken) {
      return;
    }

    commentDeleteRef.current = commentId;
    setDeletingCommentId(commentId);
    setCommentDeleteError('');

    try {
      await commentService.remove(commentId, user.accessToken);
      setComments((current) => current.filter((comment, index) => getCommentKey(comment, index) !== commentId));
      setCommentDeleteConfirmId('');
      setStatus('Comment deleted.');
    } catch (err) {
      setCommentDeleteError(err.message);
    } finally {
      commentDeleteRef.current = '';
      setDeletingCommentId('');
    }
  }

  if (loading) {
    return (
      <main id="main-content" className={`${styles.container} wrapper`}>
        <LoadingState message="Loading article..." />
      </main>
    );
  }

  if (notFound) {
    return (
      <main id="main-content" className={`${styles.container} wrapper`}>
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
      <main id="main-content" className={`${styles.container} wrapper`}>
        <ErrorState title="Could not load article" message={error} />
      </main>
    );
  }

  const createdOn = article._createdOn || article.createdOn;
  const title = safeText(article.title, 'Untitled article');
  const summary = safeText(article.summary, 'No summary is available for this article.');
  const authorName = safeText(article.authorName, 'Hristian Ivanov');
  const category = safeText(article.category, 'General');
  const readingTime = Number.isFinite(Number(article.readingTime)) ? Number(article.readingTime) : 3;
  const articleKey = normalizeArticleId(article) || articleId;
  const paragraphs = getParagraphs(article.content);
  const isOwner = Boolean(user && article._ownerId === user._id);

  return (
    <main id="main-content" className={styles.container}>
      <article className={`${styles.article} wrapper`}>
        <div className={styles.topBar}>
          <Link className={styles.backLink} to="/articles">Back to articles</Link>
          {isOwner && (
            <div className={styles.ownerActions}>
              <Link className={styles.ownerLink} to={`/articles/${articleId}/edit`}>Edit</Link>
              <button
                className={styles.dangerButton}
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeletingArticle}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {articleActionError && <div className={styles.actionError} role="alert">{articleActionError}</div>}
        <StatusMessage message={status} onClear={() => setStatus('')} />

        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          title="Delete this article?"
          description={`This will permanently delete "${title}".`}
          confirmLabel="Delete article"
          isBusy={isDeletingArticle}
          onConfirm={handleArticleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />

        <header className={styles.header}>
          <p className={styles.category}>{category}</p>
          <h1 className="heading-1">{title}</h1>
          <p className={`${styles.summary} paragraph-1`}>{summary}</p>
          <div className={styles.meta}>
            <img
              src={resolveImageUrl(article.authorAvatar, fallbackAvatar)}
              alt={`${authorName} avatar`}
              onError={(event) => handleImageFallback(event, fallbackAvatar)}
            />
            <div>
              <strong>{authorName}</strong>
              <div className={styles.metaText}>
                <time dateTime={toDateTime(createdOn)}>
                  {formatArticleDate(createdOn)}
                </time>
                <span aria-hidden="true">.</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.imageContainer}>
          <img
            src={resolveImageUrl(article.imageUrl)}
            alt={title}
            onError={(event) => handleImageFallback(event, fallbackImage)}
          />
        </div>
        <div className={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <p key={`${articleKey}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className={`${styles.related} wrapper`} aria-labelledby="related-heading">
          <div className={styles.relatedHeader}>
            <p className={styles.eyebrow}>Keep reading</p>
            <h2 id="related-heading" className="sub-heading-1">Related Articles</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedArticles.map((relatedArticle) => (
              <PostCard key={normalizeArticleId(relatedArticle)} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      <section className={`${styles.comments} wrapper`} aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="sub-heading-1">Comments</h2>

        {isAuthenticated ? (
          <form className={styles.commentForm} onSubmit={handleCommentSubmit} noValidate>
            <label htmlFor="comment-text">Add a comment</label>
            <textarea
              id="comment-text"
              value={commentText}
              onChange={(event) => {
                setCommentText(event.target.value);
                setCommentError('');
              }}
              rows={4}
              maxLength={1000}
              required
              aria-required="true"
              aria-invalid={Boolean(commentError)}
              aria-describedby={commentError ? 'comment-error comment-counter' : 'comment-counter'}
            />
            <span id="comment-counter" className={styles.counter}>{commentText.length}/1000 characters</span>
            {commentError && <span id="comment-error" className={styles.fieldError}>{commentError}</span>}
            {commentServerError && <div className={styles.actionError} role="alert">{commentServerError}</div>}
            <button type="submit" disabled={isSavingComment}>
              {isSavingComment ? 'Posting comment...' : 'Post comment'}
            </button>
          </form>
        ) : (
          <div className={styles.guestCommentPrompt}>
            <p>Login to join the discussion on this article.</p>
            <Link to="/login" state={{ from: { pathname: `/articles/${articleId}` } }}>Login to comment</Link>
          </div>
        )}

        {commentsLoading && <LoadingState message="Loading comments..." />}
        {!commentsLoading && commentLoadError && (
          <ErrorState title="Could not load comments" message={commentLoadError} />
        )}
        {!commentsLoading && !commentLoadError && comments.length === 0 && (
          <EmptyState
            title="No comments yet"
            message="Be the first authenticated reader to leave a useful comment."
          />
        )}
        {!commentsLoading && !commentLoadError && comments.length > 0 && (
          <ul className={styles.commentList}>
            {comments.map((comment, index) => {
              const commentId = getCommentKey(comment, index);
              const isCommentOwner = Boolean(user && comment._ownerId === user._id);
              const commentAuthor = safeText(comment.authorName, 'Reader');
              const text = safeText(comment.text || comment.content, 'This comment has no readable text.');

              return (
                <li key={commentId} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <img
                      src={resolveImageUrl(comment.authorAvatar, fallbackAvatar)}
                      alt={`${commentAuthor} avatar`}
                      onError={(event) => handleImageFallback(event, fallbackAvatar)}
                    />
                    <div>
                      <strong>{commentAuthor}</strong>
                      <time dateTime={toDateTime(comment._createdOn)}>
                        {formatArticleDate(comment._createdOn)}
                      </time>
                    </div>
                  </div>
                  <p>{text}</p>
                  {isCommentOwner && (
                    <div className={styles.commentActions}>
                      <button type="button" onClick={() => setCommentDeleteConfirmId(commentId)}>
                        Delete
                      </button>
                    </div>
                  )}
                  <ConfirmationDialog
                    isOpen={commentDeleteConfirmId === commentId}
                    title="Delete this comment?"
                    description="This will permanently delete your comment from this article."
                    confirmLabel="Delete comment"
                    isBusy={deletingCommentId === commentId}
                    onConfirm={() => handleCommentDelete(commentId)}
                    onCancel={() => setCommentDeleteConfirmId('')}
                  />
                  {commentDeleteConfirmId === commentId && commentDeleteError && (
                    <div className={styles.actionError} role="alert">{commentDeleteError}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

function getCommentKey(comment, index) {
  return comment._id || comment.id || `comment-${index}`;
}

export default Detail;
