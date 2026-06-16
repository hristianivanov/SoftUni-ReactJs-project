# Deployment Notes

This project is ready for a deployment pass, but it is not honestly deployed yet.

## Current Status

- The React app is configured through `VITE_API_BASE_URL`.
- Local development expects the SoftUni practice server at `http://localhost:3030`.
- Auth, articles, and comments depend on that API being available.
- A frontend-only deploy would render the UI, but login, CRUD, and comments would fail unless the API URL points to a reachable backend.

## Required Before Production

1. Choose where the API will run.
2. Set `VITE_API_BASE_URL` for the frontend host.
3. Confirm CORS and auth headers work from the deployed frontend origin.
4. Decide how persistent API data should be stored and backed up.
5. Run `npm run lint`, `npm run test:run`, `npm run build`, and `npm run test:e2e` against the deployed API target.

## Suggested Milestone

The next deployment milestone should be:

- Deploy the SoftUni practice server or replace it with a small production API.
- Deploy the Vite build with `VITE_API_BASE_URL` pointing to that API.
- Add smoke checks for login, article create/edit/delete, and comment create/delete against the deployed URLs.

Until that milestone is complete, this repository should be described as a local full-stack demo rather than a production deployment.
