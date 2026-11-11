# UniConnect testing deployment

The requested site is `https://unicomnect-test.vercel.app`. On 11 November 2026 that address returned Vercel `DEPLOYMENT_NOT_FOUND`. Hosting is being restored from branch `fix/restore-testing-site`; do not assume an old URL is working until its health checks pass.

## Safe hosting configuration

Deploy the frontend and Express API together from the repository root using `vercel.json`, Node 24, and the committed lockfiles. The API and isolated Neon testing database use Frankfurt. Hosted frontend requests use the same origin and authenticated HTTP polling.

Required server-only runtime variables: `DATABASE_URL`, separate private `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, and `CLIENT_URL` matching the final public origin. Set `TESTING_ENVIRONMENT=1` to label this particular test deployment. Never expose secrets as `VITE_*` variables. Never set local QA/app database flags on Vercel.

The new isolated database is `uniconnect-qa-20261111` on the existing Neon Free integration. The older `unicomnect-test-db` is not modified by this work. Do not connect test provisioning to the old database.

## First-time provision of the new empty testing database

Normal builds only compile the application and never initialize databases. `backend/deploy/provision-testing.ts` is an explicit one-time operation requiring `TESTING_ENVIRONMENT=1`, `DATABASE_MIGRATION_APPROVED=1`, the private connection URI, and a privately generated `DEMO_PASSWORD` of at least 16 characters. It refuses a database with existing application tables unless its own completion marker is present. It does not delete data or reset existing test accounts on subsequent runs.

An operator can run `node --import tsx deploy/provision-testing.ts` from `backend` after configuring those variables privately. For initial Vercel provisioning only, a one-off build command can run that command from backend before `node scripts/vercel-build.mjs`; afterwards restore the normal build command and remove the provisioning approval/password settings. This is authorized only for the newly created isolated database, not an existing production database.

The operation creates fictional role accounts, a software-testing course, assignments, submissions, announcements, a calendar event, discussion messages and fictional campus resources. Private credentials are handed to the project owner separately. Newly registered students can sign in immediately; newly registered instructors await admin approval.

Generic initialization separately requires `DATABASE_MIGRATION_APPROVED=1`. Existing databases require verified backups, staging review and explicit approval before schema changes. Never use initialization as a blind fix for permissions or connectivity.

## Verification

`/api/health` is process liveness. `/api/ready` verifies required configuration and authentication tables; 503 means configuration/schema/connectivity needs attention. `node scripts/diagnose-db.mjs` checks a privately supplied database URL using a read-only transaction and reports sanitized error codes and RLS/permission metadata.

The GitHub Application testing workflow installs dependencies, runs the isolated authentication suite, compiles both applications, and runs Playwright browser/functional/security checks. Reports are attached to each run. Those tests use disposable in-memory PostgreSQL and never target a hosted database.

After deployment, check readiness, public pages/catalogue, signup, student/instructor/admin login, session persistence, logout, course enrollment, assignments, grading and role restrictions against the isolated testing site. Use fictional data only. Site publication does not mean every possible edge case is defect-free; record new issues with reproducible steps and distinguish unsupported features such as password-reset email from regressions.

## Operating the test site

Data persists across deployments. Use unique test email addresses and prefix test-created coursework with your team/test case ID. Do not erase seeded records needed by teammates. Coordinate any reset with the team and take a restore point first; no public reset endpoint is provided. Store private test account credentials outside Git. Never upload actual student records or confidential documents.

Neon and Vercel free resources have usage limits and may sleep when idle. No paid upgrade is enabled by this setup. Review provider usage before load/performance testing; ordinary functional checks are the intended use.
