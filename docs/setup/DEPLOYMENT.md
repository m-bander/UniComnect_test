# UniConnect testing deployment

The testing deployment uses `https://unicomnect-test-test11-04d8.vercel.app` and branch `fix/restore-testing-site`. The old requested address `https://unicomnect-test.vercel.app` returned `DEPLOYMENT_NOT_FOUND` and Vercel reports it assigned to another project, so it cannot be reclaimed from this account. Verify the new deployment health before use.

## Safe hosting configuration

Deploy the frontend and Express API together from the repository root using `vercel.json`, Node 24, and the committed lockfiles. The API and isolated Neon testing database use Frankfurt. Hosted frontend requests use the same origin and authenticated HTTP polling.

Required server-only runtime variables: `DATABASE_URL`, separate private `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, and `CLIENT_URL` matching the final public origin. Set `TESTING_ENVIRONMENT=1` to label this particular test deployment. Never expose secrets as `VITE_*` variables. Never set local QA/app database flags on Vercel.

The new isolated database is `uniconnect-qa-20261111` on the existing Neon Free integration. The older `unicomnect-test-db` is not modified by this work. Do not connect test provisioning to the old database.

## First-time provision of the new empty testing database

Normal builds only compile the application. They never initialize databases unless an operator explicitly enables the one-time testing provisioning flag described below. `backend/deploy/provision-testing.ts` is an explicit one-time operation requiring `TESTING_ENVIRONMENT=1`, `DATABASE_MIGRATION_APPROVED=1`, the private connection URI, and a privately generated `DEMO_PASSWORD` of at least 16 characters. It refuses a database with existing application tables unless its own completion marker is present. It does not delete data or reset existing test accounts on subsequent runs.

An operator can run `node --import tsx deploy/provision-testing.ts` from `backend` after configuring those variables privately. For initial Vercel provisioning only, set `TESTING_PROVISION_ONCE=1` alongside those approval settings. The build invokes the guarded provisioner explicitly; afterwards remove `TESTING_PROVISION_ONCE`, `DATABASE_MIGRATION_APPROVED`, and `DEMO_PASSWORD` from deployment settings. Subsequent normal builds never touch database contents. This is authorized only for the newly created isolated database, not an existing production database.

The operation creates fictional role accounts, a software-testing course, assignments, submissions, announcements, a calendar event, discussion messages and fictional campus resources. Private credentials are handed to the project owner separately. Newly registered students can sign in immediately; newly registered instructors await admin approval.

Generic initialization separately requires `DATABASE_MIGRATION_APPROVED=1`. Existing databases require verified backups, staging review and explicit approval before schema changes. Never use initialization as a blind fix for permissions or connectivity.

## Verification

`/api/health` is process liveness. `/api/ready` verifies required configuration and authentication tables; 503 means configuration/schema/connectivity needs attention. `node scripts/diagnose-db.mjs` checks a privately supplied database URL using a read-only transaction and reports sanitized error codes and RLS/permission metadata.

The GitHub Application testing workflow installs dependencies, runs the isolated authentication suite, compiles both applications, and runs Playwright browser/functional/security checks. Reports are attached to each run. Those tests use disposable in-memory PostgreSQL and never target a hosted database.

After deployment, check readiness, public pages/catalogue, signup, student/instructor/admin login, session persistence, logout, course enrollment, assignments, grading and role restrictions against the isolated testing site. Use fictional data only. Site publication does not mean every possible edge case is defect-free; record new issues with reproducible steps and distinguish unsupported features such as password-reset email from regressions.

## Operating the test site

Data persists across deployments. Use unique test email addresses and prefix test-created coursework with your team/test case ID. Do not erase seeded records needed by teammates. Coordinate any reset with the team and take a restore point first; no public reset endpoint is provided. Store private test account credentials outside Git. Never upload actual student records or confidential documents.

Neon and Vercel free resources have usage limits and may sleep when idle. No paid upgrade is enabled by this setup. Review provider usage before load/performance testing; ordinary functional checks are the intended use.
