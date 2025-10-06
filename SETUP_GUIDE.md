# Mountain Mixology Setup Guide

Mountain Mixology now ships with a lightweight SQLite backend handled entirely
inside the Next.js application. Booking requests and admin accounts are stored
locally, with no external services required.

## 1. Prerequisites

- Node.js 18 or newer
- npm (bundled with Node) or your preferred package manager

## 2. Configure Environment

Copy the example file and adjust values if desired:

```bash
cp .env.example .env
```

Key settings:

- `DATABASE_PATH` (optional): filesystem path for the SQLite database file.
- `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` (optional): credentials
  created automatically in development when no admin exists.

## 3. Install Dependencies

```bash
npm install
```

This step downloads native modules such as `better-sqlite3`. If installation
fails on macOS, ensure Command Line Tools are available (`xcode-select --install`).

## 4. Seed an Admin Account (Optional)

During development, the app creates a default admin using the bootstrap
credentials. In production (or to add additional accounts) run:

```bash
npm run create:admin -- admin@example.com "SuperSecurePassword!"
```

## 5. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/login
to access the admin dashboard. Booking requests submitted through the contact
form will appear immediately in `/admin` for authenticated users.

## 6. Production Build (Optional)

```bash
npm run build
npm run start
```

Ensure you supply production-ready admin credentials and secure the database
location before deploying.

## Need Help?

- Open an issue in the repository if you run into problems
- Drop us a line: mountainmixologyca@gmail.com

Happy mixing!
