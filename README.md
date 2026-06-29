# Clinic Website

Full-stack landing site for a private therapy clinic with a private admin dashboard for managing contact-form submissions.

- **Frontend:** React + Vite + Tailwind CSS (RTL, Hebrew)
- **Backend:** Node.js + Express, written in **TypeScript** (layered architecture)
- **Database:** SQLite via `better-sqlite3` (zero external services)
- **Email:** Nodemailer over Gmail SMTP
- **Auth:** JWT access tokens + rotating refresh tokens in httpOnly cookies, RBAC, bcrypt
- **Hardening:** Helmet, CORS, Zod request validation, per-route rate limiting, central error handling, structured logging (pino)
- **Quality:** strict TypeScript, Vitest + Supertest tests, GitHub Actions CI

---

## Project structure

```
clinic-website/
├── client/                # React + Vite frontend
│   └── src/
│       ├── pages/         # LandingPage, AdminLogin, AdminDashboard
│       ├── components/    # Navbar, Hero, ContactForm, Timeline, dashboard/*
│       ├── hooks/         # useScrollAnimation, useAuth
│       └── utils/         # date formatting
├── server/                # Express backend (TypeScript)
│   ├── src/
│   │   ├── config/        # env.ts (Zod-validated environment)
│   │   ├── db/            # database + repositories
│   │   ├── services/      # contact / stats / settings / auth business logic
│   │   ├── middleware/    # validate, auth (JWT+RBAC), rateLimit, error
│   │   ├── schemas/       # Zod request schemas
│   │   ├── routes/        # contact + admin routers
│   │   ├── email/         # mailer (Nodemailer)
│   │   ├── app.ts         # Express app factory (used by tests too)
│   │   └── server.ts      # entry point (listen + graceful shutdown)
│   ├── tests/             # Vitest + Supertest
│   └── scripts/           # hash-password.ts
├── .github/workflows/     # CI (typecheck, test, build)
├── .env.example
└── package.json           # root scripts (run both apps together)
```

### Backend scripts (run inside `/server`)

```bash
npm run dev         # tsx watch — hot-reloading dev server
npm start           # run the server (tsx)
npm run typecheck   # tsc --noEmit
npm test            # Vitest + Supertest
```

---

## 1. Generate a Gmail App Password

The contact form emails the clinic owner on every submission. Gmail requires an **App
Password** (a 16-character token), not your normal password.

1. Go to <https://myaccount.google.com/security>.
2. Enable **2-Step Verification** (required before App Passwords appear).
3. Visit <https://myaccount.google.com/apppasswords>.
4. Choose **Mail** as the app, give it a name, and click **Create**.
5. Copy the 16-character password (shown as `xxxx xxxx xxxx xxxx`). You'll paste
   it into `.env` as `GMAIL_APP_PASSWORD`. Spaces are fine.

> If you can't see the App Passwords page, 2-Step Verification isn't fully
> enabled yet, or the account is a managed Workspace account with it disabled.

---

## 2. Create the `.env` file

From the project root:

```bash
cp .env.example .env
```

Then edit `.env`:

```ini
PORT=4000
JWT_SECRET=<long random string — e.g. run: openssl rand -hex 32>

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<generated in step 4>

GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_NOTIFICATION_EMAIL=your@gmail.com
```

The `.env` file lives at the **project root** and is read by the server.

---

## 3. Install & run locally

Install all dependencies (root, server, client):

```bash
npm run install:all
```

> Or manually: `npm install` in the root, then `npm install` inside both
> `server/` and `client/`.

### Run both apps together (recommended for development)

```bash
npm run dev
```

- Client (Vite): <http://localhost:5173>
- Server (Express API): <http://localhost:4000>

The Vite dev server proxies `/api/*` to the Express server, so the contact
form and admin dashboard work seamlessly during development.

- Public site: <http://localhost:5173/>
- Admin login: <http://localhost:5173/admin/login>

### Run each app separately

```bash
npm run dev:server   # Express on :4000
npm run dev:client   # Vite on :5173
```

### Production build

```bash
npm run build        # builds client into client/dist
npm start            # Express serves the API + the built client on :4000
```

In production the Express server serves the built front-end, so everything
runs from <http://localhost:4000>.

---

## 4. Hash the initial admin password

Generate a bcrypt hash for the admin password and place it in `.env`:

```bash
npm --prefix server run hash-password -- "your-chosen-password"
```

It prints a line like:

```
ADMIN_PASSWORD_HASH=$2a$12$....
```

Copy that whole line into `.env`. Restart the server to apply.

> **Changing the password later:** the Settings tab in the dashboard verifies
> your current password and outputs a fresh `ADMIN_PASSWORD_HASH=...` line.
> Paste it into `.env` and restart the server. (The password isn't stored in
> the database — only the hash in `.env` — so this is intentional.)

---

## API routes

| Method | Route                     | Auth | Description                                        |
|--------|---------------------------|------|----------------------------------------------------|
| GET    | `/api/health`             | —    | Health check                                       |
| POST   | `/api/contact`            | —    | Save submission, email the clinic (rate-limited)   |
| POST   | `/api/admin/login`        | —    | Access token + sets httpOnly refresh cookie        |
| POST   | `/api/admin/refresh`      | 🍪   | Rotate refresh cookie, return access token         |
| POST   | `/api/admin/logout`       | 🍪   | Revoke refresh token, clear cookie                 |
| GET    | `/api/admin/submissions`  | ✅   | All submissions                                    |
| GET    | `/api/admin/stats`        | ✅   | Aggregated dashboard stats                         |
| GET    | `/api/admin/settings`     | ✅   | Current settings                                   |
| PUT    | `/api/admin/settings`     | ✅   | Update email / toggle / password                   |

✅ routes require an `Authorization: Bearer <accessToken>` header (15-min
access token). 🍪 routes use the httpOnly refresh cookie (7-day, rotated on
each use, revocable in the DB). The client keeps the access token in
`localStorage` and silently calls `/refresh` on a 401 before retrying.

---

## Notes

- The SQLite database file is created automatically on first run and is git-ignored. Tests use an in-memory database.
- If Gmail credentials are missing, the server still runs and saves
  submissions — it just logs a warning and skips sending email.
- Email notifications can be toggled on/off and the destination address changed
  from the **Settings** tab without touching `.env`.
