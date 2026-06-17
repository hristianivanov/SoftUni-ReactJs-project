# Hristian Blog

Hristian Blog is a React blogging project for the SoftUni ReactJS course. It keeps the original Figma-inspired visual direction, but the app now runs as a real local full-stack demo: public article browsing, authentication, owner-managed articles, and comments all talk to the bundled SoftUni practice server.

## Features

- Public home page with featured and recent articles.
- Article catalog with category filtering and client-side search.
- Article detail pages with defensive loading, empty, error, and not-found states.
- Registration, login, logout, guest-only auth routes, and persisted sessions.
- Protected create/edit article routes.
- Owner-only article edit/delete controls.
- Authenticated comment creation and owner-only comment deletion.
- Accessible confirmation dialogs for destructive actions.
- Responsive desktop and mobile navigation with skip-link support.

## Tech Stack

- React 18, Vite, React Router, JavaScript.
- CSS Modules plus the existing Tailwind base setup.
- React Context for auth state.
- Native `fetch` wrapped by `client/src/api/requester.js`.
- Vitest, Testing Library, and Playwright for quality checks.
- Local SoftUni practice server from the `server` directory.

## Local Setup

Install root helper dependencies:

```powershell
npm install
```

Install client dependencies:

```powershell
cd client
npm install
```

Start the API server and Vite client from the repository root:

```powershell
npm run dev
```

The API runs at `http://localhost:3030` and the client runs at `http://localhost:5173`.

## Environment

The client reads the API URL from `VITE_API_BASE_URL`.

```powershell
Copy-Item client\.env.example client\.env.local
```

Default local value:

```env
VITE_API_BASE_URL=http://localhost:3030
```

## Development Data

With `npm run dev` running, seed the local server from a second terminal:

```powershell
npm run seed
```

The seed script is idempotent. It creates a demo author only when needed and skips duplicate article creation when articles already exist.

Local demo credentials:

- Email: `demo@local.test`
- Password: `demo123`

These credentials are for the local practice server only.

## Useful Commands

Run client lint:

```powershell
cd client
npm run lint
```

Run unit and component tests:

```powershell
cd client
npm run test:run
```

Run Playwright browser smoke tests:

```powershell
cd client
npm run test:e2e
```

Run the same client quality gate used by CI from the repository root:

```powershell
npm run ci:client
```

Build the client:

```powershell
cd client
npm run build
```

Seed local API data:

```powershell
npm run seed
```

When dependencies change, update and commit the matching `package-lock.json` from the same package directory. Use `npm ci` to reproduce CI installs locally; GitHub Actions runs the client checks on Node 22 with `npm ci --no-audit --no-fund`.

## Architecture

- `client/src/api` contains API service modules for auth, articles, comments, and requester errors.
- `client/src/auth` owns auth context and local session persistence.
- `client/src/pages` contains route-level screens.
- `client/src/components` contains shared UI such as forms, navigation, post cards, app states, and confirmation dialogs.
- `server/data/blog.json` is source material for the seed script.
- `server/server.js` is the generated SoftUni practice server and is intentionally left unchanged.

## API Surface

The app uses these local server endpoints:

- `POST /users/register`
- `POST /users/login`
- `GET /users/logout`
- `GET /data/articles`
- `GET /data/articles/:id`
- `POST /data/articles`
- `PUT /data/articles/:id`
- `DELETE /data/articles/:id`
- `GET /data/comments`
- `POST /data/comments`
- `DELETE /data/comments/:id`

## Authentication And Ownership

Sessions are stored in `localStorage` for this educational local-server project. The stored session contains `_id`, `email`, and `accessToken`; passwords are never stored.

The UI hides edit/delete controls from guests and non-owners, but the server remains the source of truth for authorization. Owner checks are duplicated in the UI only to keep the experience clear.

## Testing

The test suite covers:

- Requester success, structured server errors, and network failures.
- Auth session storage behavior.
- Protected and guest-only route guards.
- Login and registration form validation/server errors.
- Article form validation.
- Owner-only article/comment controls in the detail view.
- Browser smoke flows for public browsing, auth, create/edit/delete article, comments, mobile navigation, and responsive overflow checks.

## Deployment Status

This repository is not production-deployed yet. A frontend-only deploy would render the static app, but auth, article writes, and comments require a reachable API. See `DEPLOYMENT.md` for the exact blockers and suggested deployment milestone.

## Known Limitations

- No rich-text editor.
- No image upload or media storage.
- No likes, bookmarks, profile editing, or password recovery.
- No admin dashboard.
- Local practice server data is not a production persistence layer.

## Future Improvements

- Deploy or replace the API with a production-ready backend.
- Add screenshots after deployment URLs are stable.
- Add richer article formatting.
- Add profile pages and saved articles.
- Add API-level contract tests around ownership and error cases.
