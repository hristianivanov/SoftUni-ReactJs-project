import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import * as commentService from '../../api/commentService';
import useAuth from '../../auth/useAuth';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import {
  fallbackAvatar,
  fallbackImage,
  formatArticleDate,
  normalizeArticleId,
} from '../../utils/articles';
import { createAuthorFromUser } from '../../utils/authors';
import styles from './detailPage.module.css';

function Detail() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
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
  const articleDeleteRef = useRef(false);
  const commentSaveRef = useRef(false);
  const commentDeleteRef = useRef('');

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
      navigate('/articles', { replace: true });
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
      setComments((current) => current.filter((comment) => (comment._id || comment.id) !== commentId));
      setCommentDeleteConfirmId('');
    } catch (err) {
      setCommentDeleteError(err.message);
    } finally {
      commentDeleteRef.current = '';
      setDeletingCommentId('');
    }
  }

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
  const isOwner = Boolean(user && article._ownerId === user._id);

  return (
    <main className={styles.container}>
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

        {showDeleteConfirm && (
          <section className={styles.confirmBox} aria-live="polite">
            <h2>Delete this article?</h2>
            <p>
              This will permanently delete <strong>{article.title}</strong>.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" onClick={handleArticleDelete} disabled={isDeletingArticle}>
                {isDeletingArticle ? 'Deleting...' : 'Confirm delete'}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={isDeletingArticle}>
                Cancel
              </button>
            </div>
          </section>
        )}

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
              aria-invalid={Boolean(commentError)}
              aria-describedby={commentError ? 'comment-error' : undefined}
            />
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
            {comments.map((comment) => {
              const commentId = comment._id || comment.id;
              const isCommentOwner = Boolean(user && comment._ownerId === user._id);

              return (
                <li key={commentId} className={styles.comment}>
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
                  {isCommentOwner && (
                    <div className={styles.commentActions}>
                      {commentDeleteConfirmId === commentId ? (
                        <>
                          <span>Delete this comment?</span>
                          <button
                            type="button"
                            onClick={() => handleCommentDelete(commentId)}
                            disabled={deletingCommentId === commentId}
                          >
                            {deletingCommentId === commentId ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentDeleteConfirmId('')}
                            disabled={deletingCommentId === commentId}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setCommentDeleteConfirmId(commentId)}>
                          Delete
                        </button>
                      )}
                    </div>
                  )}
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

export default Detail;
