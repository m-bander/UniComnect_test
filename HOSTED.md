# Shared hosted demo

Live URL: https://unicomnect-test.vercel.app

Frontend and API: Vercel Hobby.
Database: Neon Free, Frankfurt. Data is hosted independently of the original local machine.

Sample login: student@uniconnect.test / UniConnect123!.
Other seeded roles use the sample accounts listed in README.md.

## Verified

Public URL smoke run: 2026-10-27T17:26:40.284Z.
21 passed, 0 failed, using a fresh HTTP client without Vercel authentication cookies.
Verified login, enrolled course data, assignment data, persistent refresh sessions, statistics, password-field removal,
student grade protection, cross-student record protection and anonymous chat denial.
The public student dashboard was also verified through the browser.

## Demo behavior

Anyone with the URL can access the public app and sign in using the synthetic sample accounts.
All visitors share one hosted database.
Registration and external uploads are disabled in the public demo.
Chat and announcement updates refresh every ten seconds.
The original local QA mode preserves the original defect baseline for graduation-project testing.

## Repeat public checks

From the repository root: npm run test:public.
From backend/: node qa/public-smoke.cjs https://unicomnect-test.vercel.app.

## Hosting settings

Vercel project: unicomnect-test in the Test workspace.
GitHub source: mohamedhany-44/UniComnect_test, main branch.
Neon database: unicomnect-test-db, Free plan.
Database URL and session secrets are held in Vercel sensitive environment variables and are not committed.
Git pushes trigger Vercel deployments. The build preserves existing users and does not reset hosted data.
