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

  const articleLink = page.locator('article a').first();
  await articleLink.click();
  await expect(page.getByRole('heading', { name: /comments/i })).toBeVisible();

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
  await expect(page.getByText(email)).toBeVisible();

  await page.reload();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole('banner').getByRole('button', { name: /logout/i }).click();
  await expect(page.getByRole('banner').getByRole('link', { name: /login/i })).toBeVisible();

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(demoUser.email);
  await page.getByLabel(/password/i).fill(demoUser.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByText(demoUser.email)).toBeVisible();
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
  await page.getByLabel(/content/i).fill(`This article content is long enough for validation. ${extraContent}`);
  await page.getByLabel(/image url/i).fill('https://images.unsplash.com/photo-1498050108023-c5249f4df085');
  await page.getByLabel(/category/i).fill('React');
  await page.getByLabel(/reading time/i).fill('5');
}

async function ensureSeedData(api) {
  const articles = await api.get('/data/articles');

  if (articles.ok()) {
    const body = await articles.json();
    if (Array.isArray(body) && body.length > 0) {
      return;
    }
  }

  let userResponse = await api.post('/users/register', { data: demoUser });
  if (!userResponse.ok()) {
    userResponse = await api.post('/users/login', { data: demoUser });
  }
  const user = await userResponse.json();

  await api.post('/data/articles', {
    headers: { 'X-Authorization': user.accessToken },
    data: {
      title: 'Playwright Seed Article',
      summary: 'Seeded article used by rendered browser tests.',
      content: 'This rendered test article provides enough content for detail pages, comments, and catalog checks.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      category: 'React',
      readingTime: 4,
      featured: true,
      authorName: 'demo',
      authorAvatar: '/img/author.jpg',
    },
  });
}
