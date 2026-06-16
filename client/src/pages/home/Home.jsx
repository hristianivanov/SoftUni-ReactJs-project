import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as articleService from '../../api/articleService';
import { EmptyState, ErrorState, LoadingState } from '../../components/app-state/AppState.jsx';
import CategoryCard from '../../components/category-card/CategoryCard.jsx';
import Hero from '../../components/hero/Hero.jsx';
import PostCard from '../../components/post-card/PostCard.jsx';
import SectionNameAndLink from '../../components/section-name-link/SectionNameAndLink.jsx';
import { getCategoryCounts } from '../../utils/articles';
import styles from './homePage.module.css';

const categoryIcons = {
  JavaScript: '/svg/css.svg',
  React: '/svg/hero.svg',
  API: '/svg/search.svg',
  Routing: '/svg/arrow.svg',
  Backend: '/svg/line.svg',
  UX: '/svg/scroll.svg',
};

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const featuredArticles = useMemo(() => {
    const featured = articles.filter((article) => article.featured);
    return (featured.length ? featured : articles).slice(0, 4);
  }, [articles]);

  const recentArticles = useMemo(() => articles.slice(0, 4), [articles]);

  const categories = useMemo(() => {
    const counts = getCategoryCounts(articles);
    return Object.entries(counts).slice(0, 5).map(([name, articleCount]) => ({
      name,
      articleCount,
      icon: categoryIcons[name] || '/svg/css.svg',
    }));
  }, [articles]);

  return (
    <main className={styles.container}>
      <Hero />
      <section className={styles.categoryContainer}>
        <img className={styles.scrollButton} src="/svg/scroll.svg" alt="" />
        <div className="wrapper">
          <SectionNameAndLink
            sectionNameText="Browse The Category"
            sectionLinkText="Categories"
            to="/articles"
          />
          {loading && <LoadingState message="Loading categories..." />}
          {!loading && error && (
            <ErrorState
              title="Could not load articles"
              message={error}
              actionLabel="Open catalog"
              actionTo="/articles"
            />
          )}
          {!loading && !error && categories.length === 0 && (
            <EmptyState
              title="No categories yet"
              message="Run the development seed script to populate public blog content."
            />
          )}
          {!loading && !error && categories.length > 0 && (
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  name={category.name}
                  icon={category.icon}
                  articleCount={category.articleCount}
                  destination={`/articles?category=${encodeURIComponent(category.name)}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className={styles.articlesContainer}>
        <div className={`${styles.wrapper} wrapper`}>
          <ArticleSection
            title="Featured Articles"
            articles={featuredArticles}
            loading={loading}
            error={error}
          />
          <ArticleSection
            title="Recent Articles"
            articles={recentArticles}
            loading={loading}
            error={error}
          />
          {!loading && !error && articles.length > 0 && (
            <Link to="/articles" className={styles.button}>More Articles</Link>
          )}
        </div>
      </section>
    </main>
  );
}

function ArticleSection({ title, articles, loading, error }) {
  return (
    <div className={styles.content}>
      <SectionNameAndLink sectionNameText={title} sectionLinkText="Articles" to="/articles" />
      {loading && <LoadingState message={`Loading ${title.toLowerCase()}...`} />}
      {!loading && error && <ErrorState title="Articles unavailable" message={error} />}
      {!loading && !error && articles.length === 0 && (
        <EmptyState
          title="No articles yet"
          message="Start the local server and run the seed script to fill this section."
        />
      )}
      {!loading && !error && articles.length > 0 && (
        <div className={styles.postCardList}>
          {articles.map((article) => <PostCard key={article._id} article={article} />)}
        </div>
      )}
    </div>
  );
}
