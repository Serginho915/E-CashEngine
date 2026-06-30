# E-CashEngine

Production-ready full-stack blog with admin publishing, AI article generation, PostgreSQL runtime storage, secure admin auth, Docker dev/prod environments, and CI.

## Stack

- Frontend: Vite, React, TypeScript, SCSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Service dependency: Redis
- AI: OpenRouter API
- Email/newsletter: Nodemailer SMTP-ready env
- Infra: Docker, Docker Compose

## Project Structure

- `backend/src/index.ts` wires middleware, routes, scheduler, schema bootstrap, and error handling.
- `backend/src/routes/*` contains API route modules wrapped with `asyncHandler`.
- `backend/src/services/*` contains PostgreSQL stores, auth, OpenRouter, sanitization, audit logging, and scheduler logic.
- `frontend/src/App.tsx` contains the small SPA router, pages, and reusable UI sections.
- `frontend/src/styles.scss` contains the e-CashEngine visual system.

Runtime data lives in PostgreSQL, not JSON files or container filesystems.

## Features

- Blog list, search, article pages, newsletter, and admin UI
- Newsletter subscription endpoint
- Admin login with JWT access token and httpOnly refresh cookie
- Refresh token hashes stored in PostgreSQL
- CSRF check on refresh
- CRUD for generated/admin posts
- Admin generation settings and Generate now button
- OpenRouter generation with sanitized HTML before storage
- Audit events for login, settings, post changes, and generation

## Local Development Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- PostgreSQL and Redis run inside Docker.

The `admin-seed` service creates a local superadmin and may exit with code `0`. Defaults:

- Email: `admin@ecashengine.local`
- Password: `MySecretPassword123!`

Override with `LOCAL_SUPERADMIN_EMAIL` and `LOCAL_SUPERADMIN_PASSWORD`.

## Admin Setup

For local Docker, `admin-seed` runs automatically. Without Docker:

```bash
cd backend
npm install
npm run create-superadmin
```

Admin users are stored in PostgreSQL. The app does not use `ADMIN_USERNAME`, `ADMIN_PASSWORD`, or `ADMIN_PASSWORD_HASH` for runtime login.

## Auth Troubleshooting

- `Invalid email or password`: run `npm run create-superadmin` with the same `DATABASE_URL`.
- `Session expired`: sign in again; access tokens are intentionally short-lived.
- Refresh requires the httpOnly cookie and `x-csrf-token`.
- In production, `JWT_SECRET` and `REFRESH_TOKEN_SECRET` must be different, stable, and at least 32 characters.

## Production Secrets

Generate secrets:

```bash
npm run generate-secrets
npm run setup:prod-env
```

`JWT_SECRET` signs short-lived access tokens. `REFRESH_TOKEN_SECRET` hashes refresh tokens before storage. Keep both stable across deploys; rotating them logs users out.

Edit:

- root `.env.production` for PostgreSQL and public frontend URLs
- `backend/.env.production` for backend secrets, CORS, OpenRouter, SMTP
- root `.env.production` uses `VITE_API_URL` for the browser API endpoint.

Production refuses to start if required secrets are missing, equal, too short, or production URLs point to localhost.

## Production Deployment Docker

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

Production ports:

- Frontend: host `8080` -> container `3000`
- Backend: host `4000` -> container `4000`
- PostgreSQL and Redis are not published to the host.

## Local Development Without Docker

Start PostgreSQL and Redis locally, then:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API Summary

- `GET /api/health`
- `GET /api/posts`
- `GET /api/posts/search?q=term`
- `GET /api/posts/:slug`
- `POST /api/subscribe`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `PUT /api/admin/posts/:slug`
- `DELETE /api/admin/posts/:slug`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `POST /api/ai/generate-article`

## Backups

PostgreSQL volumes hold users, posts, settings, subscribers, refresh tokens, and audit events. `docker compose up -d --build` is safe for data. `docker compose down -v` deletes the database volume. Use PostgreSQL backups or managed Postgres for production.

## Verification

Useful checks:

```bash
docker compose config
docker compose up -d --build
curl http://localhost:4000/api/health
curl -I http://localhost:3000/
curl http://localhost:4000/api/posts
docker compose --env-file .env.production -f docker-compose.prod.yml config
```
