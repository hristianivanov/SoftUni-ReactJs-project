import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import useAuth from '../../auth/useAuth';
import ArticleForm from '../../components/article-form/ArticleForm.jsx';
import { createAuthorFromUser } from '../../utils/authors';
import usePageTitle from '../../hooks/usePageTitle';
import styles from './articleEditor.module.css';

export default function CreateArticle() {
  usePageTitle('Create article');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(payload) {
    if (isSaving || !user?.accessToken) {
      return;
    }

    setIsSaving(true);
    setServerError('');

    try {
      const createdArticle = await articleService.create(payload, user.accessToken);
      navigate(`/articles/${createdArticle._id}`, { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main id="main-content" className={styles.container}>
      <section className={`${styles.panel} wrapper`}>
        <p className={styles.eyebrow}>Author workspace</p>
        <h1 className="heading-1">Create Article</h1>
        <p className={`${styles.intro} paragraph-1`}>
          Publish a developer article with a clear summary, readable content, and a useful image.
        </p>
        <ArticleForm
          mode="create"
          onSubmit={handleSubmit}
          cancelTo="/articles"
          serverError={serverError}
          isSaving={isSaving}
          author={createAuthorFromUser(user)}
        />
      </section>
    </main>
  );
}
