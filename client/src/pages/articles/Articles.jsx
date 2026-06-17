import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import CategoryCard from '../../components/category-card/CategoryCard.jsx';
import PostCard from '../../components/post-card/PostCard.jsx';
import StatusMessage from '../../components/status-message/StatusMessage.jsx';
import {
  filterArticles,
  getCategoryCounts,
  paginateArticles,
  sortArticles,
} from '../../utils/articles';
import usePageTitle from '../../hooks/usePageTitle';
import styles from './articles.module.css';

const pageSize = 6;
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title', label: 'Title A-Z' },
];

export default function Articles() {
  usePageTitle('Articles');
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(() => location.state?.message || '');

  const selectedCategory = searchParams.get('category') || '';
  const searchTerm = searchParams.get('search') || '';
  const sort = sortOptions.some((option) => option.value === searchParams.get('sort'))
    ? searchParams.get('sort')
    : 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    setStatus(location.state.message);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

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
  const matchingArticles = useMemo(() => filterArticles(articles, {
    searchTerm,
    category: selectedCategory,
  }), [articles, searchTerm, selectedCategory]);
  const sortedArticles = useMemo(() => sortArticles(matchingArticles, sort), [matchingArticles, sort]);
  const pagination = useMemo(() => paginateArticles(sortedArticles, page, pageSize), [page, sortedArticles]);

  const updateQuery = useCallback((updates, { replace = false, resetPage = false } = {}) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    if (resetPage) {
      nextParams.delete('page');
    }

    setSearchParams(nextParams, { replace });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (page === pagination.currentPage) {
      return;
    }

    updateQuery({ page: pagination.currentPage }, { replace: true });
  }, [loading, page, pagination.currentPage, updateQuery]);

  function handleCategory(category) {
    updateQuery({ category }, { resetPage: true });
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
            onChange={(event) => updateQuery({ search: event.target.value }, {
              replace: true,
              resetPage: true,
            })}
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
        <StatusMessage message={status} onClear={() => setStatus('')} />
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
              <div>
                <h2>{pagination.visibleArticles.length} visible of {matchingArticles.length} matching articles</h2>
                <p>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
              <label className={styles.sortControl} htmlFor="article-sort">
                <span>Sort</span>
                <select
                  id="article-sort"
                  value={sort}
                  onChange={(event) => updateQuery({ sort: event.target.value }, { resetPage: true })}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              {selectedCategory && (
                <button type="button" onClick={() => handleCategory('')}>
                  Clear {selectedCategory}
                </button>
              )}
            </div>
            {matchingArticles.length === 0 ? (
              <EmptyState
                title="No matching articles"
                message="Try a different search term or clear the category filter."
              />
            ) : (
              <>
                <div className={styles.grid}>
                  {pagination.visibleArticles.map((article) => <PostCard key={article._id} article={article} />)}
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(nextPage) => updateQuery({ page: nextPage })}
                />
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Article pagination">
      <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        Previous
      </button>
      <div className={styles.pageButtons}>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={pageNumber === currentPage ? styles.currentPage : ''}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Next
      </button>
    </nav>
  );
}
