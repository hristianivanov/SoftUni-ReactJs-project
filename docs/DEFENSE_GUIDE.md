# Defense Guide

## 20-Minute Time Plan

0-3 minutes: Project overview, public/private parts, and what the app solves.

3-8 minutes: Demo catalog, details, comments, login, My Articles, create, edit, and delete.

8-13 minutes: Explain source structure, routing, AuthContext, services, route guards, and owner checks.

13-15 minutes: Show tests, CI, screenshots, README, and assignment compliance document.

15-20 minutes: Answer questions.

## Demo Flow

1. Guest opens Home.
2. Guest opens Articles.
3. Guest opens Details.
4. Guest cannot create article and is redirected to Login.
5. Login with `demo@local.test` / `demo123`.
6. Open My Articles.
7. Create article.
8. Edit article.
9. Comment on the article.
10. Delete own comment.
11. Delete own article.
12. Logout.

## Source Code Explanation Flow

1. Open `client/src/App.jsx` to show client-side routing and public/private route groups.
2. Open `client/src/routes/RequireAuth.jsx` and `client/src/routes/GuestOnlyRoute.jsx` to explain route guards.
3. Open `client/src/auth/AuthContext.jsx` to show Context API, session persistence, login, register, and logout.
4. Open `client/src/api/requester.js` and service files to show REST communication and token headers.
5. Open `client/src/pages/articles/Articles.jsx` to explain catalog state, URL query parameters, filtering, sorting, and pagination.
6. Open `client/src/pages/detail/Detail.jsx` to show details, comments, owner-only controls, and related articles.
7. Open `client/src/pages/article-create/EditArticle.jsx` to show the owner-only edit route.
8. Open `client/src/pages/my-articles/MyArticles.jsx` to show user-owned records.
9. Open `client/src/components/article-form/ArticleForm.jsx` and validation tests to show bound forms and validation.
10. Open `client/e2e/blog.spec.js` to show end-to-end assignment flows.

## Requirement Checklist

- Public part: Home, Articles, Details, Login, Register, Contact.
- Private part: My Articles, Create Article, Edit Article.
- Dynamic pages: Home, Catalog, Details, My Articles, Create Article, Edit Article.
- Catalog and details views are public and API-backed.
- Articles collection has create, read, update, and delete.
- Comments collection provides logged-in interaction with records.
- Author can edit/delete own articles and comments.
- Non-owners cannot edit/delete records through the UI or API.
- Guests can browse but cannot create, edit, delete, or comment.
- React Router provides more than 5 pages and 2 parameterized routes.
- AuthContext implements Context API state.
- Forms are bound and validated.
- External CSS files style the components.
- README and compliance docs cover the project.
- GitHub Actions verifies quality.

## Bonus Features

- URL-persisted catalog search, filters, sorting, and pagination.
- My Articles dashboard.
- Related articles on detail pages.
- Responsive hamburger drawer with focus management and Escape handling.
- Confirmation dialogs for destructive actions.
- Status messages for article and comment actions.
- Screenshot gallery and defense-oriented documentation.

## Likely Questions and Answers

**Why Context API instead of Redux?**
The assignment requires Context API and the app only needs global auth/session state. Redux would add unnecessary complexity for this scope.

**How does ownership work?**
The SoftUni server stores `_ownerId` on created records. The UI compares `_ownerId` with `user._id` before showing edit/delete controls, and the server rejects non-owner write requests.

**How do route guards work?**
`RequireAuth` redirects guests to `/login` and preserves the requested destination. `GuestOnlyRoute` redirects authenticated users away from Login and Register.

**How does REST communication work?**
Components call service modules in `client/src/api`. Those services use `requester.js`, which wraps native `fetch`, adds JSON headers, sends `X-Authorization` when needed, and normalizes errors.

**Why is localStorage used?**
It keeps the local demo session after refresh. This is acceptable for an educational practice app, but production auth would need stronger token handling and server-side security decisions.

**What would change in production?**
Deploy a real backend or hosted API, configure `VITE_API_BASE_URL`, add persistent storage, review auth security, confirm CORS, and run smoke tests against the deployed environment.

**How does validation prevent bad data?**
Login/Register validate email and passwords. ArticleForm validates title, summary, content, image URL, category, and reading time. Comments require a safe text length.

**How does the server reject non-owner operations?**
The SoftUni practice server checks the access token against the record owner for protected `PUT` and `DELETE` requests and returns 403 for non-owners.

**How are tests organized?**
Vitest and Testing Library cover services, validation, route guards, and components. Playwright covers real browser flows and direct API ownership checks.

**Why is the SoftUni server unchanged?**
The assignment expects REST communication with a service, and the generated server is sufficient as the local backend. Keeping it unchanged avoids mixing assignment client code with generated infrastructure.

## Files to Open Before Defense

- `README.md`
- `docs/ASSIGNMENT_COMPLIANCE.md`
- `docs/DEFENSE_GUIDE.md`
- `client/src/App.jsx`
- `client/src/routes/RequireAuth.jsx`
- `client/src/routes/GuestOnlyRoute.jsx`
- `client/src/auth/AuthContext.jsx`
- `client/src/api/requester.js`
- `client/src/api/articleService.js`
- `client/src/api/commentService.js`
- `client/src/pages/articles/Articles.jsx`
- `client/src/pages/detail/Detail.jsx`
- `client/src/pages/article-create/CreateArticle.jsx`
- `client/src/pages/article-create/EditArticle.jsx`
- `client/src/pages/my-articles/MyArticles.jsx`
- `client/e2e/blog.spec.js`
- `.github/workflows/ci.yml`
