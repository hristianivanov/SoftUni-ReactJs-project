import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import CategoryCard from '../../components/category-card/CategoryCard.jsx';
import PostCard from '../../components/post-card/PostCard.jsx';
import { filterArticles, getCategoryCounts } from '../../utils/articles';
import usePageTitle from '../../hooks/usePageTitle';
import styles from './articles.module.css';

export default function Articles() {
  usePageTitle('Articles');
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      try {
        const result = await articleService.getAll();

        if (!ignore) {
          setArticles(result);
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
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
  }, []);

  const categoryCounts = useMemo(() => getCategoryCounts(articles), [articles]);
  const visibleArticles = useMemo(() => filterArticles(articles, {
    searchTerm,
    category: selectedCategory,
  }), [articles, searchTerm, selectedCategory]);

  function handleCategory(category) {
    const nextParams = new URLSearchParams(searchParams);

    if (category) {
      nextParams.set('category', category);
    } else {
      nextParams.delete('category');
    }

    setSearchParams(nextParams);
  }

  return (
    <main id="main-content" className={styles.container}>
      <section className={`${styles.hero} wrapper`}>
        <div>
          <p className={styles.eyebrow}>Developer articles</p>
          <h1 className="heading-1">Article Catalog</h1>
          <p className="paragraph-1">
            Browse practical notes about React, JavaScript, APIs, routing, and UI states.
          </p>
        </div>
        <form className={styles.search} onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="article-search">Search articles</label>
          <input
            id="article-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, summary, or author"
          />
        </form>
      </section>

      <section className={`${styles.filters} wrapper`} aria-label="Article filters">
        <button
          className={`${styles.filterButton} ${!selectedCategory ? styles.active : ''}`}
          type="button"
          onClick={() => handleCategory('')}
        >
          All
        </button>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <CategoryCard
            key={category}
            name={category}
            articleCount={count}
            onClick={() => handleCategory(category)}
          />
        ))}
      </section>

      <section className={`${styles.results} wrapper`}>
        {loading && <LoadingState message="Loading articles..." />}
        {!loading && error && <ErrorState title="Could not load articles" message={error} />}
        {!loading && !error && articles.length === 0 && (
          <EmptyState
            title="No articles have been published"
            message="Start the server and run npm run seed from the repository root."
          />
        )}
        {!loading && !error && articles.length > 0 && (
          <>
            <div className={styles.resultSummary}>
              <h2>{visibleArticles.length} matching articles</h2>
              {selectedCategory && (
                <button type="button" onClick={() => handleCategory('')}>
                  Clear {selectedCategory}
                </button>
              )}
            </div>
            {visibleArticles.length === 0 ? (
              <EmptyState
                title="No matching articles"
                message="Try a different search term or clear the category filter."
              />
            ) : (
              <div className={styles.grid}>
                {visibleArticles.map((article) => <PostCard key={article._id} article={article} />)}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
