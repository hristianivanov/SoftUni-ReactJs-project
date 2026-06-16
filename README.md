# Hristian Blog

Developer blogging platform built for the SoftUni ReactJS course. The project keeps the original Figma-derived template and connects the public blog, authentication, owner-managed articles, and comments to the local SoftUni practice server.

## Setup

Install the client dependencies:

```powershell
cd client
npm install
```

Start the local server and Vite client from the repository root:

```powershell
npm run dev
```

The server runs at `http://localhost:3030` and the client runs at `http://localhost:5173`.

## Development Data

With `npm run dev` running, seed the public article data from a second terminal:

```powershell
npm run seed
```

The seed script is idempotent. It creates a local demo author only when needed, skips duplicate article creation when `/data/articles` already has records, and uses obvious local credentials for the local practice server only:

- Email: `demo@local.test`
- Password: `demo123`

Seeded articles and seeded comments are created through authenticated API requests, so the demo account owns them and can edit/delete them. You can override the API URL with `API_BASE_URL` or `VITE_API_BASE_URL`.

## Authentication

The app supports registration, login, logout, guest-only login/register routes, auth-aware desktop and mobile navigation, and persisted sessions. Sessions are stored in `localStorage` for this educational local-server project. Only `_id`, `email`, and `accessToken` are stored; passwords are never stored.

Login and registration validate required fields, email format, and password requirements before submitting. Server errors, such as duplicate registration or invalid credentials, are displayed in the form. Refreshing the browser restores the authenticated navigation from the stored session.

## Articles And Comments

Authenticated users can create articles at `/articles/create`. Article creation validates title, summary, content, image URL, category, reading time, and featured status. New articles derive the author name from the signed-in email and let the server assign `_ownerId` and timestamps.

Article owners can edit their articles at `/articles/:articleId/edit` and delete them from the article details page after confirmation. Non-owners do not see owner controls in the UI, and the server remains the authority for rejecting unauthorized writes.

Authenticated users can create comments on article details. Comment owners can delete their own comments after confirmation. Guests see a login prompt instead of the comment form.

## Features

- Home page with featured articles, recent articles, and category cards.
- Article catalog at `/articles`.
- Client-side search by title, summary, category, and author.
- Category filtering through `/articles?category=React`.
- Article detail pages at `/articles/:articleId`.
- Loading, error, empty, article not-found, and wildcard not-found states.
- Responsive navigation with an accessible mobile menu.
- Registration, login, logout, persisted sessions, and guest route protection.
- Protected article create/edit routes.
- Owner-only article edit/delete controls.
- Authenticated comment creation and owner-only comment deletion.

## Architecture

- React 18, Vite, React Router, JavaScript, and CSS Modules.
- React Context for authentication state.
- Native `fetch` through `client/src/api/requester.js`.
- API calls live in service modules under `client/src/api`.
- Session storage is isolated in `client/src/auth/sessionStorage.js`.
- Public and write content uses the protected SoftUni collection endpoints `/data/articles` and `/data/comments`.
- Authentication uses `/users/register`, `/users/login`, and `/users/logout`.
- `server/data/blog.json` remains source material for development seed data.
- The generated `server/server.js` is intentionally unchanged.

## Package Layout

The Vite application owns its dependencies in `client/package.json`. The root package remains as a thin workspace helper for starting both the server and client and for running the development seed script.

## Current Limitations

There is no rich-text editor, image upload, likes, bookmarks, profile editing, password recovery, admin dashboard, deployment configuration, or automated browser test suite yet.

## Next Milestone Scope

The next pass should focus on responsive polish, accessibility review, visual QA, optional service/form tests, and final README screenshots or deployment notes.
