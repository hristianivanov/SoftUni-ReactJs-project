import { expect, request, test } from '@playwright/test';

const apiBaseUrl = 'http://localhost:3030';
const demoUser = { email: 'demo@local.test', password: 'demo123' };

test.beforeAll(async () => {
  const api = await request.newContext({ baseURL: apiBaseUrl });
  await ensureSeedData(api);
  await api.dispose();
});

test('guest public flow renders and filters content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /hi, i'm hristian/i })).toBeVisible();

  await page.goto('/articles');
  await expect(page.getByRole('heading', { name: /article catalog/i })).toBeVisible();
  await page.getByRole('searchbox', { name: /search articles/i }).fill('Routing');
  await expect(page.getByText(/matching articles/i)).toBeVisible();

  await page.goto('/articles?category=React');
  await expect(page.getByText(/matching articles/i)).toBeVisible();
  await expect(page.locator('button[aria-pressed="true"]', { hasText: 'React' })).toBeVisible();

  const articleLink = page.locator('article a').first();
  await articleLink.click();
  await expect(page.getByRole('heading', { name: 'Comments', exact: true })).toBeVisible();

  await page.goto('/articles/create');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('link', { name: /create an account/i })).toBeVisible();

  await page.goto('/contact');
  await expect(page.getByRole('link', { name: /github.com\/hristianivanov/i })).toBeVisible();

  await page.goto('/missing-route');
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
});

test('authentication flow persists session and logs out', async ({ page }) => {
  const email = `pw-${Date.now()}@local.test`;

  await page.goto('/register');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill('demo123');
  await page.getByLabel(/confirm password/i).fill('demo123');
  await page.getByRole('button', { name: /create account/i }).click();
  await expect(page.locator(`span[title="${email}"]`).first()).toBeVisible();

  await page.reload();
  await expect(page.locator(`span[title="${email}"]`).first()).toBeVisible();

  await page.getByRole('banner').getByRole('button', { name: /logout/i }).click();
  await expect(page.getByRole('banner').getByRole('link', { name: /login/i })).toBeVisible();

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(demoUser.email);
  await page.getByLabel(/password/i).fill(demoUser.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.locator(`span[title="${demoUser.email}"]`).first()).toHaveText('Demo Author');
  await expect(page.getByText(demoUser.email)).toHaveCount(0);
});

test('expired session redirects to login and recovers after re-authentication', async ({ page }) => {
  const title = `Recovered Session Article ${Date.now()}`;

  await login(page, demoUser.email, demoUser.password);
  await page.evaluate(() => {
    const key = 'hristian-blog-session';
    const session = JSON.parse(window.localStorage.getItem(key));
    window.localStorage.setItem(key, JSON.stringify({
      ...session,
      accessToken: 'stale-invalid-token',
    }));
  });

  await page.goto('/articles/create');
  await fillArticleForm(page, title, 'Expired session recovery verification.');
  await page.getByRole('button', { name: /create article/i }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('status')).toHaveText(/your session expired/i);
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('hristian-blog-session'))).toBeNull();
  await expect(page.getByRole('banner').getByRole('link', { name: /login/i })).toBeVisible();

  await page.getByLabel(/email/i).fill(demoUser.email);
  await page.getByLabel(/^password$/i).fill(demoUser.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/articles\/create$/);

  await fillArticleForm(page, title, 'Fresh login creates successfully after an expired session.');
  await page.getByRole('button', { name: /create article/i }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page.getByRole('button', { name: /^delete$/i }).click();
  await page.getByRole('button', { name: /delete article/i }).click();
  await expect(page).toHaveURL(/\/articles$/);
});

test('article and comment owner flow works', async ({ page }) => {
  const title = `Playwright Article ${Date.now()}`;

  await login(page, demoUser.email, demoUser.password);
  await page.getByRole('link', { name: /write article/i }).first().click();
  await page.getByRole('button', { name: /create article/i }).click();
  await expect(page.getByText(/title is required/i)).toBeVisible();

  await fillArticleForm(page, title, 'Original content for Playwright verification.');
  await page.getByRole('button', { name: /create article/i }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByRole('heading', { name: /verification heading/i })).toBeVisible();
  await expect(page.getByText('Toolbar')).toBeVisible();
  await expect(page.getByRole('link', { name: /edit/i })).toBeVisible();

  await page.getByRole('link', { name: /edit/i }).click();
  await page.getByLabel(/title/i).fill(`${title} Updated`);
  await page.getByRole('button', { name: /save changes/i }).click();
  await expect(page.getByRole('heading', { name: `${title} Updated` })).toBeVisible();

  const commentText = `Comment ${Date.now()}`;
  await page.getByLabel(/add a comment/i).fill(commentText);
  await page.getByRole('button', { name: /post comment/i }).click();
  await expect(page.getByText(commentText)).toBeVisible();
  await page.locator('li', { hasText: commentText }).getByRole('button', { name: /delete/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /delete comment/i }).click();
  await expect(page.getByText(commentText)).not.toBeVisible();

  await page.getByRole('button', { name: /^delete$/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /cancel/i }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: /^delete$/i }).click();
  await page.getByRole('button', { name: /delete article/i }).click();
  await expect(page).toHaveURL(/\/articles$/);
  await expect(page.getByRole('status')).toHaveText(/article deleted/i);
});

test('API rejects non-owner article update and delete requests', async () => {
  const api = await request.newContext({ baseURL: apiBaseUrl });
  const stamp = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  const userA = { email: `owner-a-${stamp}@local.test`, password: 'demo123' };
  const userB = { email: `owner-b-${stamp}@local.test`, password: 'demo123' };
  let userASession;
  let article;

  try {
    userASession = await registerApiUser(api, userA);
    const userBSession = await registerApiUser(api, userB);
    article = await createApiArticle(api, userASession.accessToken, `API Ownership ${stamp}`);

    const updateResponse = await api.put(`/data/articles/${article._id}`, {
      headers: { 'X-Authorization': userBSession.accessToken },
      data: {
        ...article,
        title: `Hijacked ${stamp}`,
      },
    });
    expect(updateResponse.status()).toBe(403);

    const deleteResponse = await api.delete(`/data/articles/${article._id}`, {
      headers: { 'X-Authorization': userBSession.accessToken },
    });
    expect(deleteResponse.status()).toBe(403);

    const ownerDeleteResponse = await api.delete(`/data/articles/${article._id}`, {
      headers: { 'X-Authorization': userASession.accessToken },
    });
    expect(ownerDeleteResponse.ok()).toBe(true);

    const missingResponse = await api.get(`/data/articles/${article._id}`);
    expect(missingResponse.status()).toBe(404);
    article = null;
  } finally {
    if (article?._id && userASession?.accessToken) {
      await api.delete(`/data/articles/${article._id}`, {
        headers: { 'X-Authorization': userASession.accessToken },
      });
    }

    await api.dispose();
  }
});

test('non-owner cannot see article owner controls or open the edit form', async ({ page }) => {
  const api = await request.newContext({ baseURL: apiBaseUrl });
  const stamp = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  const userA = { email: `ui-owner-a-${stamp}@local.test`, password: 'demo123' };
  const userB = { email: `ui-owner-b-${stamp}@local.test`, password: 'demo123' };
  let userASession;
  let article;

  try {
    userASession = await registerApiUser(api, userA);
    await registerApiUser(api, userB);
    article = await createApiArticle(api, userASession.accessToken, `UI Ownership ${stamp}`);

    await login(page, userB.email, userB.password);
    await page.goto(`/articles/${article._id}`);

    await expect(page.getByRole('heading', { name: article.title })).toBeVisible();
    await expect(page.getByRole('link', { name: /^edit$/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);

    await page.goto(`/articles/${article._id}/edit`);
    await expect(page.getByRole('heading', { name: /you cannot edit this article/i })).toBeVisible();
    await expect(page.getByText(/only the author who created this article can edit it/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /save changes/i })).toHaveCount(0);
    await expect(page.getByLabel(/summary/i)).toHaveCount(0);
  } finally {
    if (article?._id && userASession?.accessToken) {
      await api.delete(`/data/articles/${article._id}`, {
        headers: { 'X-Authorization': userASession.accessToken },
      });
    }

    await api.dispose();
  }
});

test('my articles dashboard manages owned articles', async ({ page }) => {
  const title = `My Articles E2E ${Date.now()}`;

  await login(page, demoUser.email, demoUser.password);
  await page.goto('/my-articles');
  await expect(page.getByRole('heading', { name: /my articles/i })).toBeVisible();
  await expect(page.getByText(/owned articles/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /routing public blog pages/i }).first()).toBeVisible();

  await page.getByRole('link', { name: /^view$/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Comments', exact: true })).toBeVisible();
  await page.goto('/my-articles');

  await page.getByRole('link', { name: /write article/i }).first().click();
  await fillArticleForm(page, title, 'My Articles dashboard verification.');
  await page.getByRole('button', { name: /create article/i }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.goto('/my-articles');
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page.locator('article', { hasText: title }).getByRole('button', { name: /delete/i }).click();
  await page.getByRole('button', { name: /delete article/i }).click();
  await expect(page.getByRole('status')).toHaveText(/article deleted/i);
  await expect(page.getByRole('heading', { name: title })).not.toBeVisible();
});

test('catalog URL state survives refresh', async ({ page }) => {
  await page.goto('/articles');
  await page.getByRole('searchbox', { name: /search articles/i }).fill('React');
  await expect(page).toHaveURL(/search=React/i);

  await page.getByRole('button').filter({ hasText: 'React' }).first().click();
  await expect(page).toHaveURL(/category=React/);

  await page.getByLabel(/sort/i).selectOption('oldest');
  await expect(page).toHaveURL(/sort=oldest/);

  await page.goto('/articles?sort=oldest');
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page).toHaveURL(/page=2/);
  await assertNoHorizontalOverflow(page);

  const url = page.url();
  await page.reload();
  await expect(page).toHaveURL(url);
  await expect(page.getByText(/page 2 of/i)).toBeVisible();
});

test('mobile drawer navigation is accessible for authenticated users', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page, demoUser.email, demoUser.password);
  await page.goto('/');

  const toggle = page.getByRole('button', { name: /toggle navigation menu/i });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: /close navigation menu/i })).toBeVisible();

  const drawer = page.getByRole('navigation', { name: /mobile navigation/i });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('link', { name: /my articles/i })).toBeVisible();
  await expect(drawer.getByRole('link', { name: /write article/i })).toBeVisible();
  await expect(drawer.getByTitle(demoUser.email)).toHaveText('Demo Author');
  await expect(drawer).not.toHaveText(demoUser.email);
  await expect(drawer.locator('a').first()).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();

  await toggle.click();
  await drawer.getByRole('link', { name: /my articles/i }).click();
  await expect(page).toHaveURL(/\/my-articles$/);
  await expect(drawer).not.toBeVisible();
  await assertNoHorizontalOverflow(page);
});

test('related articles appear without repeating the current article', async ({ page }) => {
  await page.goto('/articles?category=React');
  const title = await page.locator('article h3').first().textContent();
  await page.locator('article a').first().click();

  const related = page.getByRole('region', { name: /related articles/i });
  await expect(related).toBeVisible();
  await expect(related.getByRole('heading', { name: title.trim() })).toHaveCount(0);
});

test('responsive and accessibility smoke checks', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /hi, i'm hristian/i })).toBeVisible();
    const overflow = await page.evaluate(() => ({
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      offenders: Array.from(document.querySelectorAll('body *'))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            id: element.id,
            className: String(element.className || ''),
            text: element.textContent.trim().slice(0, 40),
            right: rect.right,
            left: rect.left,
          };
        })
        .filter((item) => item.right > window.innerWidth || item.left < 0)
        .slice(0, 5),
    }));
    if (overflow.hasOverflow) {
      throw new Error(`viewport ${width}px overflow: ${JSON.stringify(overflow)}`);
    }
    await expect(page.locator('main')).toHaveAttribute('id', 'main-content');
  }

  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: /toggle navigation menu/i }).click();
  await expect(page.getByRole('navigation', { name: /mobile navigation/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: /mobile navigation/i })).not.toBeVisible();

  await login(page, demoUser.email, demoUser.password);
  await page.goto('/articles/create');
  await expect(page.getByLabel(/title/i)).toBeVisible();
  await page.getByLabel(/image url/i).fill('https://images.unsplash.com/photo-1498050108023-c5249f4df085');
  await expect(page.getByAltText(/article preview/i)).toBeVisible();
});

async function login(page, email, password) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/');
  await expect.poll(
    () => page.evaluate(() => Boolean(window.localStorage.getItem('hristian-blog-session'))),
    { message: `session stored for ${email}` },
  ).toBe(true);
}

async function fillArticleForm(page, title, extraContent) {
  await page.getByLabel(/title/i).fill(title);
  await page.getByLabel(/summary/i).fill('A summary long enough for the article form validation.');
  const content = page.getByLabel(/^content$/i);
  await content.fill(`## Verification Heading\n\nToolbar text makes this article content long enough for validation. ${extraContent}`);
  await content.evaluate((element) => element.setSelectionRange(25, 32));
  await page.getByRole('button', { name: /bold/i }).click();
  await expect(content).toHaveValue(/\*\*Toolbar\*\*/);
  await page.getByLabel(/image url/i).fill('https://images.unsplash.com/photo-1498050108023-c5249f4df085');
  await expect(page.getByAltText(/article preview/i)).toBeVisible();
  await page.getByLabel(/category/i).fill('React');
  await page.getByLabel(/reading time/i).fill('5');
}

async function registerApiUser(api, user) {
  const response = await api.post('/users/register', { data: user });

  if (response.ok()) {
    return response.json();
  }

  const loginResponse = await api.post('/users/login', { data: user });
  expect(loginResponse.ok()).toBe(true);

  return loginResponse.json();
}

async function createApiArticle(api, accessToken, title) {
  const response = await api.post('/data/articles', {
    headers: { 'X-Authorization': accessToken },
    data: {
      title,
      summary: 'A summary long enough for ownership verification.',
      content: 'This article content is long enough for deterministic ownership verification.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      category: 'React',
      readingTime: 5,
      featured: false,
      authorName: 'ownership-test',
      authorAvatar: '/img/author.jpg',
    },
  });

  expect(response.ok()).toBe(true);

  return response.json();
}

async function ensureSeedData(api) {
  const articles = await api.get('/data/articles');

  if (articles.ok()) {
    const body = await articles.json();
    if (Array.isArray(body) && body.length >= seedArticles.length) {
      return;
    }
  } else {
    const message = await articles.text();
    if (!/collection does not exist|not found|404|resource/i.test(message)) {
      throw new Error(`Unable to read seed articles: ${message}`);
    }
  }

  let userResponse = await api.post('/users/register', { data: demoUser });
  if (!userResponse.ok()) {
    userResponse = await api.post('/users/login', { data: demoUser });
  }
  const user = await userResponse.json();

  const createdArticles = [];

  for (const article of seedArticles) {
    const created = await api.post('/data/articles', {
      headers: { 'X-Authorization': user.accessToken },
      data: article,
    });
    createdArticles.push(await created.json());
  }

  for (const article of createdArticles.slice(0, 3)) {
    await api.post('/data/comments', {
      headers: { 'X-Authorization': user.accessToken },
      data: {
        articleId: article._id,
        text: `Seed comment for ${article.title}`,
        authorName: 'demo',
        authorAvatar: '/img/author.jpg',
      },
    });
  }
}

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));

  if (overflow.hasOverflow) {
    throw new Error(`horizontal overflow: ${JSON.stringify(overflow)}`);
  }
}

const seedArticles = [
  {
    title: 'Routing Public Blog Pages',
    summary: 'Seeded article used by rendered browser tests.',
    content: 'This rendered test article provides enough content for detail pages, comments, and catalog checks.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    category: 'React',
    readingTime: 4,
    featured: true,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'React State Patterns',
    summary: 'Patterns for URL-backed state and local UI feedback.',
    content: 'React state becomes easier to reason about when durable state lives in URLs and transient status stays local.',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    category: 'React',
    readingTime: 5,
    featured: true,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'Accessible Mobile Navigation',
    summary: 'A practical look at focus, Escape handling, and responsive drawers.',
    content: 'Mobile navigation should use real buttons, clear landmarks, focus management, and predictable closing behavior.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    category: 'UX',
    readingTime: 6,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'REST Services and AJAX',
    summary: 'How clients talk to local practice APIs with fetch.',
    content: 'A small requester module can keep components focused on rendering and leave transport concerns in one place.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    category: 'API',
    readingTime: 6,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'Search and Category Filters',
    summary: 'Client-side search and category filters for article catalogs.',
    content: 'Search and filters help readers narrow a catalog without requiring backend complexity in a local demo.',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
    category: 'UX',
    readingTime: 4,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'Article Ownership Rules',
    summary: 'How owner-only controls keep CRUD interfaces clear.',
    content: 'The client can hide controls for non-owners while the server remains the source of truth for authorization.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    category: 'React',
    readingTime: 5,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'Pagination That Stays Shareable',
    summary: 'Keeping catalog pages in sync with query parameters.',
    content: 'Pagination belongs in the URL when readers need to refresh or share filtered catalog views.',
    imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    category: 'JavaScript',
    readingTime: 3,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
  {
    title: 'Designing Useful Empty States',
    summary: 'Loading, error, and empty states make demos feel complete.',
    content: 'Clear state design helps users understand whether data is loading, missing, filtered, or unavailable.',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    category: 'UX',
    readingTime: 3,
    featured: false,
    authorName: 'demo',
    authorAvatar: '/img/author.jpg',
  },
];
