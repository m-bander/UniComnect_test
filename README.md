# UniComnect_test

A combined UniConnect frontend, backend and software testing project.
Clone this repository once: both applications, fixtures, test cases and reports are included.
No Docker, PostgreSQL installation, database credentials or UploadThing account is required for local QA mode.

## Requirements

- Node.js 24 LTS or newer, including npm.
- Git (or download the repository ZIP).
- Internet access for the initial package/browser download.
- Free local ports 3000 and 5173.
- Windows, macOS or Linux. Linux browser automation may require system libraries:
  after setup, run `cd backend && node node_modules/@playwright/test/cli.js install --with-deps chromium`.
  This may ask for administrator access to install OS libraries.

## Get started

```sh
git clone https://github.com/mohamedhany-44/UniComnect_test.git
cd UniComnect_test
npm install
npm run setup
npm run dev
```

Open **http://localhost:5173**. The backend runs at http://localhost:3000.
Stop both servers with Ctrl+C. Restarting recreates a clean database with sample data.
Each teammate gets an independent local database; this is not a shared hosted app.
Run setup only once, or after dependency changes. It preserves an existing frontend/.env.local.

## Test accounts

All accounts use password **UniConnect123!**. These are synthetic local test credentials.

| Email | Role |
|---|---|
| student@uniconnect.test | Student |
| student2@uniconnect.test | Second student for ownership tests |
| instructor@uniconnect.test | Instructor |
| admin@uniconnect.test | Administrator |
| representative@uniconnect.test | Class representative |
| head@uniconnect.test | Course head |
| pending@uniconnect.test | Instructor awaiting approval; login must fail |

The database includes QA-101 Software Testing, course members, an assignment, a graded
submission, an announcement, an event and a chat message.

## Automated tests

Stop `npm run dev` first to start tests from fresh fixtures.

```sh
npm test
npm run test:report
```

The tests start and stop both applications automatically. Chromium is the default browser,
installed by setup, so Microsoft Edge is not required.
If Chromium fails to launch on Linux, install its system dependencies using the command above.

- `npm run test:smoke`: functional API + browser checks.
- `npm test`: all 34 checks, including known defect checks.
- `npm run test:report`: view the latest HTML report.
- `npm run build`: compile the backend and build the frontend.

The existing baseline has **25 passed and 9 failed tests**.
A full test run returns a nonzero exit code while the known defects remain.
These are real required-behavior failures; they are not marked as expected failures.
The packaged copy was verified on Windows with Chromium: 25 passed and 9 known defect failures.
See [packaged verification](backend/qa/reports/PACKAGED-VERIFICATION.md).
The commands are designed for macOS and Linux too; those operating systems were not executed in this verification.

## Project layout

- frontend/: React/TypeScript/Vite app.
- backend/: Express/TypeScript app.
- backend/qa/: isolated PostgreSQL-compatible PGlite database, fixtures, tests and SQL schema.
- backend/qa/DEFECTS.md: reproduced issues and proposed remediation.
- backend/qa/reports/: recorded baseline and test inventory.
- TESTING.md: detailed scope, accounts and testing guidance.
- scripts/manage.mjs: portable setup, launch, build and test commands.

Generated database fixtures, tokens, browser traces, dependencies, .env files and build
outputs are excluded from Git. Reports are generated locally after running the tests.

## Known limitations

This is a local testing baseline, not a production deployment.
Uploads are disabled in QA mode and several original database stored procedures are missing,
so some statistics and notification workflows do not work. Security defects are intentionally
preserved for testing and before/after comparison. See [the defect register](backend/qa/DEFECTS.md).
Standalone PostgreSQL, real file uploads and sustained production load have not been certified.

The frozen pnpm lockfiles in each application record the dependencies used for testing.
The setup command runs that pinned package manager automatically; do not run npm install inside
frontend/ or backend/ against their older npm lockfiles.

## Team access

This repository is private. The owner can invite teammates from **Settings → Collaborators → Add people**.
Each teammate must accept the invitation and authenticate with GitHub before cloning.
Never put GitHub tokens or production credentials in the repository.

## Original authors and source

The application was developed by Moslem Ahmed, Marwan Mohammed and Abdulrhman Jalal.
This repository combines their application with a separate local testing environment and QA work.
Original source references:

- [UniConnectFrontEnd](https://github.com/MoslemAhmed1/UniConnectFrontEnd), commit 57e1f72e6a9c23e415e41f44ebdec153728d7914.
- [UniConnectBackEnd](https://github.com/MoslemAhmed1/UniConnectBackEnd), commit a0295ffdce0b526ed8fcbfd2904444aaa4c77a0a.

The original frontend README is retained in frontend/README.md.
This repository does not relicense upstream source code.

## Public hosted demo

Hosting configuration is provided in vercel.json. Use the repository root as the Vercel project root and connect a managed PostgreSQL database. See [hosting configuration](backend/deploy/README.md) and [verification](backend/qa/reports/HOSTING-VERIFICATION.md).

Local baseline mode preserves the original defects. The public copy enables separate protections, sample-only accounts and ten-second updates for chat and announcements. Its registration and external uploads are disabled. This repository does not embed database credentials or session secrets.
