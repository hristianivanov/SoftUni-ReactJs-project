# Hristian Blog

Developer blogging platform built for the SoftUni ReactJS course. The project keeps the original Figma-derived template and connects the public blog experience to the local SoftUni practice server.

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

The seed script is idempotent. It creates a local demo author only when needed, skips duplicate article creation when `/data/articles` already has records, and uses obvious local credentials:

- Email: `demo@local.test`
- Password: `demo123`

You can override the API URL with `API_BASE_URL` or `VITE_API_BASE_URL`.

## Features

- Home page with featured articles, recent articles, and category cards.
- Article catalog at `/articles`.
- Client-side search by title, summary, category, and author.
- Category filtering through `/articles?category=React`.
- Article detail pages at `/articles/:articleId`.
- Comments list on article details.
- Loading, error, empty, article not-found, and wildcard not-found states.
- Responsive navigation with an accessible mobile menu.

## Architecture

- React 18, Vite, React Router, JavaScript, and CSS Modules.
- Native `fetch` through `client/src/api/requester.js`.
- Public content uses the protected SoftUni collection endpoints `/data/articles` and `/data/comments`.
- `server/data/blog.json` remains source material for development seed data.
- The generated `server/server.js` is intentionally unchanged.

## Package Layout

The Vite application owns its dependencies in `client/package.json`. The root package remains as a thin workspace helper for starting both the server and client and for running the development seed script.
