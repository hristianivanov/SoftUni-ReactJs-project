import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MarkdownEditor from '../markdown-editor/MarkdownEditor.jsx';
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

  function handleContentChange(nextValue) {
    setValues((current) => ({ ...current, content: nextValue }));
    setErrors((current) => ({ ...current, content: '' }));
  }

  const submitLabel = mode === 'edit' ? 'Save changes' : 'Create article';
  const loadingLabel = mode === 'edit' ? 'Saving changes...' : 'Creating article...';

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError && <div className={styles.errorSummary} role="alert">{serverError}</div>}

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <FormField id="title" label="Title" error={errors.title}>
            <input
              ref={fieldRefs.title}
              className={styles.titleInput}
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
              required
              aria-required="true"
              placeholder="A clear developer-focused title"
            />
          </FormField>

          <FormField
            id="summary"
            label="Summary"
            error={errors.summary}
            helper="Used as the article intro and card description."
          >
            <textarea
              ref={fieldRefs.summary}
              id="summary"
              name="summary"
              rows={4}
              value={values.summary}
              onChange={handleChange}
              aria-invalid={Boolean(errors.summary)}
              aria-describedby={errors.summary ? 'summary-error summary-counter' : 'summary-counter'}
              required
              aria-required="true"
              placeholder="Briefly explain what readers will learn"
            />
            <span id="summary-counter" className={styles.counter}>{values.summary.length} characters</span>
          </FormField>

          <FormField
            id="content"
            label="Content"
            error={errors.content}
            helper="Use Markdown shortcuts or the toolbar to format the article."
          >
            <MarkdownEditor
              value={values.content}
              onChange={handleContentChange}
              error={errors.content}
              required
              describedBy={errors.content ? 'content-error content-counter' : 'content-counter'}
              textareaRef={fieldRefs.content}
            />
          </FormField>
        </div>

        <aside className={styles.sideColumn} aria-label="Publishing settings">
          <div className={styles.sideHeader}>
            <p>Publishing settings</p>
            <span>Preview and organize the article before saving.</span>
          </div>

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
          required
          aria-required="true"
          placeholder="https://example.com/article-image.jpg"
        />
          <div className={styles.imagePreview}>
            {values.imageUrl ? (
              <img
                src={values.imageUrl}
                alt="Article preview"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
                onLoad={(event) => {
                  event.currentTarget.style.display = 'block';
                }}
              />
            ) : (
              <span>Image preview</span>
            )}
          </div>
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
          required
          aria-required="true"
          placeholder="React"
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
          required
          aria-required="true"
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
          <div className={styles.tips}>
            <strong>Writing tips</strong>
            <ul>
              <li>Start with the outcome readers get.</li>
              <li>Use headings to break long sections.</li>
              <li>Keep code examples short and readable.</li>
            </ul>
          </div>
        </aside>
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

function FormField({ id, label, error, helper, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {helper && <p className={styles.helper}>{helper}</p>}
      {children}
      {error && <span id={`${id}-error`} className={styles.fieldError}>{error}</span>}
    </div>
  );
}
