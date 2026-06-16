import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createArticlePayload, validateArticle } from './articleFormValidation';
import styles from './articleForm.module.css';

const emptyValues = {
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  category: '',
  readingTime: '',
  featured: false,
  authorName: '',
  authorAvatar: '',
};

export default function ArticleForm({
  mode,
  initialValues,
  onSubmit,
  cancelTo,
  serverError,
  isSaving,
  author,
}) {
  const [values, setValues] = useState(() => ({ ...emptyValues, ...initialValues }));
  const [errors, setErrors] = useState({});
  const submittingRef = useRef(false);
  const fieldRefs = {
    title: useRef(null),
    summary: useRef(null),
    content: useRef(null),
    imageUrl: useRef(null),
    category: useRef(null),
    readingTime: useRef(null),
  };

  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues });
  }, [initialValues]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submittingRef.current || isSaving) {
      return;
    }

    const nextErrors = validateArticle(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const [firstField] = Object.keys(nextErrors);
      fieldRefs[firstField]?.current?.focus();
      return;
    }

    submittingRef.current = true;

    try {
      await onSubmit(createArticlePayload(values, author));
    } finally {
      submittingRef.current = false;
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  const submitLabel = mode === 'edit' ? 'Save changes' : 'Create article';
  const loadingLabel = mode === 'edit' ? 'Saving changes...' : 'Creating article...';

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError && <div className={styles.errorSummary} role="alert">{serverError}</div>}

      <FormField id="title" label="Title" error={errors.title}>
        <input
          ref={fieldRefs.title}
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
      </FormField>

      <FormField id="summary" label="Summary" error={errors.summary}>
        <textarea
          ref={fieldRefs.summary}
          id="summary"
          name="summary"
          rows={4}
          value={values.summary}
          onChange={handleChange}
          aria-invalid={Boolean(errors.summary)}
          aria-describedby={errors.summary ? 'summary-error' : undefined}
        />
      </FormField>

      <FormField id="content" label="Content" error={errors.content}>
        <textarea
          ref={fieldRefs.content}
          id="content"
          name="content"
          rows={10}
          value={values.content}
          onChange={handleChange}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
      </FormField>

      <div className={styles.grid}>
        <FormField id="imageUrl" label="Image URL" error={errors.imageUrl}>
          <input
            ref={fieldRefs.imageUrl}
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            aria-invalid={Boolean(errors.imageUrl)}
            aria-describedby={errors.imageUrl ? 'imageUrl-error' : undefined}
          />
        </FormField>

        <FormField id="category" label="Category" error={errors.category}>
          <input
            ref={fieldRefs.category}
            id="category"
            name="category"
            type="text"
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
          />
        </FormField>

        <FormField id="readingTime" label="Reading time" error={errors.readingTime}>
          <input
            ref={fieldRefs.readingTime}
            id="readingTime"
            name="readingTime"
            type="number"
            min="1"
            max="120"
            step="1"
            value={values.readingTime}
            onChange={handleChange}
            aria-invalid={Boolean(errors.readingTime)}
            aria-describedby={errors.readingTime ? 'readingTime-error' : undefined}
          />
        </FormField>

        <label className={styles.checkbox}>
          <input
            name="featured"
            type="checkbox"
            checked={values.featured}
            onChange={handleChange}
          />
          Featured article
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={isSaving}>
          {isSaving ? loadingLabel : submitLabel}
        </button>
        <Link className={styles.cancel} to={cancelTo}>Cancel</Link>
      </div>
    </form>
  );
}

function FormField({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span id={`${id}-error`} className={styles.fieldError}>{error}</span>}
    </div>
  );
}
