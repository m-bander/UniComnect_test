# UniConnect application guide

The default project is a persistent working website. The testing workspace is optional.

## Normal use

1. Create an account at https://unicomnect-test.vercel.app/signup.
2. Sign in. Students use the catalogue to join courses and access their materials, assignments,
   calendars, announcements, polls, notifications, and discussions.
3. Instructors register individually and wait for the owner to approve their account.
4. Administrators use their own account to manage users, instructor approvals, courses, and statistics.
5. After an administrator changes an account role, sign out and sign in again to load the correct workspace.

The owner's existing account has administrator access. Its password is private and is not stored in this repository.
Shared privileged starter logins are disabled on the hosted deployment after a real owner is present.
Illustrative course content remains available and can be managed through the ordinary application.

## Local development

Run npm install, npm run setup, and npm run dev. Open http://127.0.0.1:5173.
The database and session signing secrets persist under .data/. Restarting does not remove accounts,
coursework, uploads, or valid login sessions. Keep .data private and back it up if local data matters.
Local copies do not synchronize with the hosted website or with other devices.
The hosted site persists in Neon PostgreSQL.

Normal startup is backend/app/start.ts. Shared schema and seed source are in backend/database/.
Application permissions apply by default. Only the explicit legacy baseline can disable the hosted guards,
and that mode is for isolated historical comparison.

## Separate testing

Install browsers with npm run setup:testing when you want browser tests.
Stop normal local processes before npm test, which launches isolated fixtures without changing .data/.
Use npm run dev:qa for a disposable populated QA environment and npm run test:campus for local
workflow checks. These workflows can create synthetic accounts and coursework.
The original defect baseline is available only through npm run test:baseline.
The public health command npm run test:public is read-only.

For graduation work, develop a test plan and scenarios against a separate copy of this working app.
Keep functional requirements, exploratory findings, defects, retests, and regression results as test artifacts.
Do not present historical baseline failures as current website defects without reproducing them.

## Current operating limits

PDF and selected image uploads are supported up to 1 MiB per file. Current storage quotas are
20 MiB per owner and 100 MiB total. Video storage, forgotten-password email delivery,
institutional email verification, and a multi-university registrar system are not implemented.
Do not describe these as working features. Hosted discussion and announcement updates use polling.

The older 14-page documentation remains a source-versioned reference for the architecture,
API groups, database relationships, and original testing evidence. Use this guide for current
startup, persistence, administrator access, and testing separation.
