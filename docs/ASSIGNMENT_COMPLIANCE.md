# SoftUni Assignment Compliance

## Project Summary

Hristian Blog is a local React application for browsing, creating, editing, deleting, and discussing developer articles through the bundled SoftUni practice REST server. The client is custom React and CSS Modules code; `server/server.js` is intentionally unchanged and used only as the local backend.

## Requirement Coverage

| Requirement | Implementation | Evidence in project | Status |
| --- | --- | --- | --- |
| Public part accessible without authentication | Guests can open Home, Articles, Details, Login, Register, Contact, and Not Found. | `client/src/App.jsx`, `client/e2e/blog.spec.js` | Covered with tests |
| Private part accessible after successful login | My Articles, Create Article, and Edit Article are wrapped by `RequireAuth`. | `client/src/App.jsx`, `client/src/routes/RequireAuth.jsx` | Covered with tests |
| Start page | Home loads API-backed featured and recent articles. | `client/src/pages/home/Home.jsx` | Covered |
| Login | Guest-only login form authenticates with the API and redirects back to the requested route. | `client/src/pages/login/Login.jsx`, `client/src/routes/GuestOnlyRoute.jsx` | Covered with tests |
| Register | Guest-only register form validates input and persists a local session. | `client/src/pages/register/Register.jsx` | Covered with tests |
| Public records/catalog/details | Article catalog and article details are public read pages. | `client/src/pages/articles/Articles.jsx`, `client/src/pages/detail/Detail.jsx` | Covered with tests |
| User area after login | Authenticated users can open My Articles. | `client/src/pages/my-articles/MyArticles.jsx` | Covered with tests |
| User's own records or posts | My Articles loads records by `_ownerId`. | `client/src/api/articleService.js`, `client/src/pages/my-articles/MyArticles.jsx` | Covered with tests |
| At least 4 different dynamic pages | Home, Articles, Details, My Articles, Create Article, and Edit Article use data, state, route params, or forms. | `client/src/pages` | Covered |
| Catalog view | `/articles` has search, category filters, sort, and pagination. | `client/src/pages/articles/Articles.jsx` | Covered with tests |
| Details view | `/articles/:articleId` loads one article, comments, and related articles. | `client/src/pages/detail/Detail.jsx` | Covered with tests |
| At least one non-user collection with full CRUD | `articles` supports create, read, update, and delete. | `client/src/api/articleService.js` | Covered with tests |
| Logged-in users can create records | Authenticated users can create articles. | `client/src/pages/article-create/CreateArticle.jsx` | Covered with tests |
| Logged-in users can interact with records | Authenticated users can create comments on articles. | `client/src/pages/detail/Detail.jsx`, `client/src/api/commentService.js` | Covered with tests |
| Logged-in author can edit/delete own records | Owner controls appear only when `_ownerId === user._id`; server accepts owner write requests. | `client/src/pages/detail/Detail.jsx`, `client/src/pages/article-create/EditArticle.jsx` | Covered with tests |
| Guests can access basic information but not functional activities | Guests can read public pages but are redirected from create/edit and prompted to log in for comments. | `client/src/routes/RequireAuth.jsx`, `client/src/pages/detail/Detail.jsx` | Covered with tests |
| React client-side | The UI is a Vite React 18 app. | `client/package.json`, `client/src/main.jsx` | Covered |
| REST communication with a service | Service modules wrap `fetch` requests to the SoftUni API. | `client/src/api/requester.js`, `client/src/api` | Covered with tests |
| Authentication | Register, login, logout, AuthProvider, and local session persistence are implemented. | `client/src/auth`, `client/src/api/authService.js` | Covered with tests |
| Client-side routing to at least 5 pages | React Router defines `/`, `/articles`, `/articles/:articleId`, `/my-articles`, `/articles/create`, `/articles/:articleId/edit`, `/login`, `/register`, `/contact`, and `*`. | `client/src/App.jsx` | Covered |
| At least 2 routes with parameters | `/articles/:articleId` and `/articles/:articleId/edit`. | `client/src/App.jsx` | Covered |
| Meaningful GitHub commits for at least 3 days | Commit history includes project work from July/August 2024 and June 16-18, 2026. | `git log --date=short --pretty=format:"%h %ad %s"` | Covered |
| Error handling | Request errors, not-found states, auth errors, form errors, and action errors are rendered. | `client/src/api/requester.js`, `client/src/components/app-state`, route pages | Covered |
| Data validation | Login, register, article, and comment forms validate before submit. | `client/src/pages/login/Login.jsx`, `client/src/pages/register/Register.jsx`, `client/src/components/article-form` | Covered with tests |
| Divided into components | Shared form, state, card, header, footer, dialog, and status components are separated. | `client/src/components` | Covered |
| Appropriate folder structure | API, auth, routes, pages, hooks, utilities, and components are split by purpose. | `client/src` | Covered |
| Brief documentation as `.md` file | README, deployment notes, this compliance file, and defense guide are included. | `README.md`, `DEPLOYMENT.md`, `docs` | Covered |
| React Hooks | Hooks are used for state, effects, memoization, refs, callbacks, and page titles. | `client/src` | Covered |
| Context API | Auth state and actions are provided by `AuthProvider` and consumed through `useAuth`. | `client/src/auth/AuthContext.jsx`, `client/src/auth/useAuth.js` | Covered |
| Stateless and stateful components | Cards/status states are mostly stateless; route pages and forms own state. | `client/src/components`, `client/src/pages` | Covered |
| Bound forms | Login, Register, ArticleForm, and comment form bind values to React state. | `client/src/pages/login/Login.jsx`, `client/src/pages/register/Register.jsx`, `client/src/components/article-form/ArticleForm.jsx`, `client/src/pages/detail/Detail.jsx` | Covered |
| Synthetic events | Submit, change, click, keyboard, and route-triggered handlers drive the UI. | `client/src` | Covered |
| Component lifecycle behavior | Data loads in `useEffect`; effects include cleanup guards, scroll/focus cleanup, and event listener cleanup. | `client/src/pages`, `client/src/components/header/Header.jsx` | Covered |
| Component styling with external CSS files | CSS Modules and global CSS style the app outside component markup. | `client/src/**/*.module.css`, `client/src/global.css` | Covered |
| Route guards for private and public parts | `RequireAuth` and `GuestOnlyRoute` enforce access rules. | `client/src/routes` | Covered with tests |
| Good UI and UX | Responsive navigation, loading/empty/error states, confirmation dialogs, and screenshots support usability. | `README.md`, `docs/screenshots`, `client/src/components` | Covered |
| Public GitHub repository | Repository is `hristianivanov/SoftUni-ReactJs-project`. | GitHub remote and CI badge in `README.md` | Covered |
| Do not use the whole course workshop as the project | The application is a custom article/blog app with its own routes, components, tests, and docs. | `client/src`, `docs`, commit history | Covered |
| Do not use HTML and CSS structures from a SoftUni course | Visual direction was recreated from a Figma/community-inspired design and implemented with custom React/CSS Modules. | `client/src/**/*.module.css`, `README.md` | Covered |
| Redux bonus | Not added; Context API is sufficient for the assignment scope. | `client/src/auth` | Not applicable |

## Dynamic Pages

- Home, API-backed articles: `/`
- Article catalog: `/articles`
- Article details, parameterized: `/articles/:articleId`
- My Articles dashboard: `/my-articles`
- Create Article: `/articles/create`
- Edit Article, parameterized: `/articles/:articleId/edit`

Login, Register, and Contact exist, but they are not counted toward the 4 dynamic-page requirement.

## Routes

- `/` - public Home.
- `/articles` - public article catalog.
- `/articles/:articleId` - public article details.
- `/my-articles` - private user article dashboard.
- `/articles/create` - private create article page.
- `/articles/:articleId/edit` - private owner-only edit page.
- `/login` - guest-only login.
- `/register` - guest-only register.
- `/contact` - public contact page.
- `*` - public not-found page.

## CRUD Mapping

Collection: `articles`

- Create: `POST /data/articles` through Create Article.
- Read: `GET /data/articles` in the catalog and `GET /data/articles/:id` in details/edit.
- Update: `PUT /data/articles/:id` through Edit Article.
- Delete: `DELETE /data/articles/:id` through Details or My Articles.

Interaction collection: `comments`

- Create comment: `POST /data/comments` from the article details page.
- Delete comment: owner-only `DELETE /data/comments/:id` from the article details page.

## Auth and Ownership

- UI article actions are shown only when `_ownerId === user._id`.
- The edit route blocks non-owners with an owner-only message and does not render the edit form.
- Guests are redirected to `/login` for private routes, with the requested destination preserved in route state.
- Logged-in users are redirected away from `/login` and `/register`.
- The SoftUni practice server remains authoritative and rejects non-owner `PUT` and `DELETE` requests.
- Playwright tests verify non-owner API rejection, hidden owner controls, blocked edit-form access, and owner cleanup.

## React Concepts Mapping

- React Hooks: `useState`, `useEffect`, `useMemo`, and `useRef` are used for route data, form state, derived values, duplicate-submit guards, and focus management.
- Context API: `AuthProvider` stores the current user and exposes `useAuth`.
- Stateless components: `PostCard`, `StatusMessage`, and app state components render from props.
- Stateful components: `Articles`, `Detail`, `MyArticles`, and `ArticleForm` own local UI and data state.
- Bound forms: Login, Register, ArticleForm, and the comment form bind input values to React state.
- Synthetic events: form submit, input change, button click, keyboard, and navigation handlers drive interactions.
- Component lifecycle: route pages load data in `useEffect`; cleanup guards prevent stale updates; header effects clean up listeners and focus state.

## Tests and Quality Checks

- Unit/component tests cover request handling, session storage, validation, route guards, header navigation, article services, catalog behavior, detail ownership, and My Articles.
- Playwright covers guest browsing, auth, owner article/comment flows, My Articles, catalog URL state, mobile drawer accessibility, related articles, non-owner API rejection, and non-owner UI restrictions.
- GitHub Actions runs `Client quality` and `Browser smoke`.
- Local validation commands are documented in `README.md`.

## Restrictions Compliance

- The app uses a Figma/community-inspired visual direction and a custom React/CSS Modules implementation.
- The generated SoftUni practice server is used only as a local backend.
- The application code is not a copied SoftUni course workshop.
- `server/server.js` is intentionally unchanged.
- Redux was not added only for bonus points because the current Context API state is sufficient.

## Known Limitations

- The project is not production-deployed.
- Local practice server data is in-memory for each server process.
- Authentication is educational and stores the local demo session in `localStorage`.
- There is no rich-text editor, image upload, profile editing, password recovery, or admin dashboard.

## Defense Checklist

- Start the app with `npm run dev` and seed with `npm run seed`.
- Demonstrate guest Home, Catalog, Details, and blocked Create.
- Log in with `demo@local.test` / `demo123`.
- Demonstrate My Articles, Create, Edit, Comment, Delete Comment, and Delete Article.
- Open `client/src/App.jsx`, `client/src/auth/AuthContext.jsx`, `client/src/routes`, `client/src/api`, and the article pages.
- Show route guard, owner UI, and Playwright ownership tests.
- Show README, screenshots, this compliance file, and GitHub Actions.
