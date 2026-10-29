# Hosted deployment

The root vercel.json builds the frontend and exposes the Express/Socket.IO HTTP server through api/index.ts.
The frontend uses the same public origin for /api and /socket.io. Local QA mode continues to use localhost.

Required server-only environment variables:
- DATABASE_URL: managed PostgreSQL connection string (pooled URL recommended).
- ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET: separate random secrets.
- UNICONNECT_PUBLIC_HOST=1: enable hosted record permissions and password-field removal.
- CLIENT_URL: exact public frontend origin.
- Hosted uploads use PostgreSQL and do not require an UploadThing account.
- UPLOADTHING_TOKEN is only needed when using the original external uploader outside hosted mode.

The Vercel project must use the repository root, not frontend/ or backend/.
Never set UNICONNECT_LOCAL_QA on Vercel: an in-memory fixture database is not shared or durable.
A hosted PostgreSQL database must be initialized before verifying login.
See initialize.ts for the non-destructive fresh-database initializer.

The hosted demo uses authenticated HTTP and refreshes chat and announcements every ten seconds.
Socket transport is disabled in hosted builds; local QA retains its original Socket.IO behavior.
This avoids cross-instance socket state and unauthenticated broadcast leaks.

The local QA baseline deliberately keeps original defect behavior. UNICONNECT_PUBLIC_HOST enables the
internet-facing protections without rewriting or hiding the original reports.

The initializer applies additive SQL migrations and seeds the expanded fictional campus once,
under a transaction and advisory lock. Existing users and coursework are preserved.
`app_migration` records the content migration; subsequent builds do not reseed deleted records.
Course categories and descriptions can be edited in the original course form.
Hosted files use unguessable download links. Anyone who has a download link can open it,
so do not use this shared sample campus for confidential submissions.
Uploads support PDF, PNG, JPEG and WebP, with a 1 MB per-file limit, 20 MB per account,
and a 100 MB application-wide quota. Video uploads require separate storage and are not enabled.
