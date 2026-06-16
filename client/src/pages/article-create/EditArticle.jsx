import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import useAuth from '../../auth/useAuth';
import { ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import ArticleForm from '../../components/article-form/ArticleForm.jsx';
import styles from './articleEditor.module.css';

export default function EditArticle() {
  const { articleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      setLoading(true);
      setLoadError('');
      setNotFound(false);

      try {
        const result = await articleService.getById(articleId);

        if (!ignore) {
          if (!result) {
            setNotFound(true);
          } else {
            setArticle(result);
          }
        }
      } catch (error) {
        if (!ignore) {
          if (/not found|404/i.test(error.message)) {
            setNotFound(true);
          } else {
            setLoadError(error.message);
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

  const initialValues = useMemo(() => {
    if (!article) {
      return undefined;
    }

    return {
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      imageUrl: article.imageUrl || '',
      category: article.category || '',
      readingTime: article.readingTime || '',
      featured: Boolean(article.featured),
      authorName: article.authorName || '',
      authorAvatar: article.authorAvatar || '',
    };
  }, [article]);

  async function handleSubmit(payload) {
    if (isSaving || !user?.accessToken) {
      return;
    }

    setIsSaving(true);
    setServerError('');

    try {
      const updatedArticle = await articleService.update(articleId, payload, user.accessToken);
      navigate(`/articles/${updatedArticle._id || articleId}`, { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <main className={`${styles.container} wrapper`}>
        <LoadingState message="Loading article editor..." />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className={`${styles.container} wrapper`}>
        <ErrorState
          title="Article not found"
          message="This article is missing or was removed."
          actionLabel="Back to articles"
          actionTo="/articles"
        />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className={`${styles.container} wrapper`}>
        <ErrorState title="Could not load article" message={loadError} />
      </main>
    );
  }

  if (article._ownerId !== user?._id) {
    return (
      <main className={styles.container}>
        <section className={`${styles.panel} wrapper`}>
          <p className={styles.eyebrow}>Owner only</p>
          <h1 className="heading-1">You cannot edit this article</h1>
          <p className={`${styles.intro} paragraph-1`}>
            Only the author who created this article can edit it.
          </p>
          <Link className={styles.backLink} to={`/articles/${articleId}`}>Back to article</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={`${styles.panel} wrapper`}>
        <p className={styles.eyebrow}>Author workspace</p>
        <h1 className="heading-1">Edit Article</h1>
        <p className={`${styles.intro} paragraph-1`}>
          Update your article while keeping the server-managed ownership fields unchanged.
        </p>
        <ArticleForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          cancelTo={`/articles/${articleId}`}
          serverError={serverError}
          isSaving={isSaving}
        />
      </section>
    </main>
  );
}
