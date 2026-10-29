# UniConnect

UniConnect is a university learning and communication website with student, instructor,
class representative, course head, and administrator workspaces.

Website: **https://unicomnect-test.vercel.app**

## Use the website

Create your own account at /signup and sign in at /login. Students can join courses,
download materials, submit assignments, receive grades, vote in polls, use the calendar,
and talk with their instructors and classmates. Instructor accounts require administrator approval.
The owner manages users, approvals, and courses through the administrator workspace.
Shared privileged starter accounts are retired after a real administrator is established.

The populated courses are illustrative starter content. Users can create and manage their own
normal accounts, courses, resources, assignments, announcements, and events.

## Run the application locally

Use Node.js 24 and Git. Clone this private repository using your own GitHub access.

```sh
git clone https://github.com/mohamedhany-44/UniComnect_test.git
cd UniComnect_test
npm install
npm run setup
npm run dev
```

Open **http://127.0.0.1:5173**. The backend uses port 3000.
Normal application data and session secrets are kept in the ignored **.data/** directory.
Stopping or restarting the app does not reset that data. Back up this directory before replacing
or moving a local installation. Each device has its own local database.
The hosted website uses persistent Neon PostgreSQL and is independent of these local copies.

On a fresh local installation, the starter administrator is admin@uniconnect.test with
password UniConnect123!. Use this local bootstrap account to establish your own administrator.
These shared privileged credentials are disabled on the hosted website once a real owner exists.
Do not delete .data to restart the app: deleting it removes your local database and sessions.

## Features

- Course catalogue with subjects, academic years, keyword search, and enrolment.
- Course libraries with lectures, tutorials, sheets, quizzes, assignments, and reading resources.
- Assignment uploads, turn-in state, instructor grading, and feedback.
- Course and class announcements, polls, notifications, calendar, and discussion groups.
- Personal profiles, profile pictures, and password changes.
- Instructor approvals, user and course administration, and administrator statistics.

PDF, PNG, JPEG, and WebP uploads currently support 1 MiB per file, 20 MiB per owner,
and 100 MiB total. Videos require a separate storage integration and are not enabled.
File links are unguessable shareable URLs; do not use them for confidential documents.
Hosted chat and announcement updates refresh approximately every ten seconds.

## Development and deployment

- `npm run dev`: normal persistent application.
- `npm run build`: backend compilation and frontend production build.
- `npm run dev:campus`: compatibility alias for the same persistent application.
- `npm run setup:testing`: install the browser required by optional automated tests.

Application startup lives in backend/app/. Shared database schemas and initial data live in
backend/database/. QA fixtures are not used by normal application startup.
Vercel builds from the repository root and serves the frontend and API together.
Required server secrets are DATABASE_URL, ACCESS_TOKEN_SECRET, and REFRESH_TOKEN_SECRET;
CLIENT_URL configures the frontend origin. Never expose these secrets in VITE variables.

## Optional testing workspace

Testing is separate from the normal application and does not need to run for users to use the site.

- `npm test`: current application regression checks using isolated temporary fixtures.
- `npm run dev:qa`: disposable, populated QA environment; resets when stopped.
- `npm run test:campus`: workflow checks against the local server; creates and removes synthetic records.
- `npm run test:public`: read-only health checks against the hosted website.
- `npm run test:report`: generated Playwright HTML report.
- `npm run test:baseline`: explicitly run the historical original defect baseline.

Stop normal local servers before starting isolated regression checks. Never publish the legacy
baseline to the internet. The original 25-pass/9-fail reports document an older implementation;
they are not the current application's test result. Do not run mutation-based testing on the live
website; use a local copy or a separate staging deployment and database.

## Documentation

Read [the current application guide](docs/APPLICATION-GUIDE.md) first.
The [earlier detailed documentation](docs/PROJECT-DOCUMENTATION.md),
[Word edition](docs/UniConnect-Project-Documentation.docx), and
[PDF edition](docs/UniConnect-Project-Documentation.pdf) are versioned snapshots from source 5d3b768.
Their descriptions of disposable local startup and shared hosted credentials are superseded by this guide.
See [hosting information](HOSTED.md) and [testing guidance](TESTING.md).

## Original application

Original authors: Moslem Ahmed, Marwan Mohammed, and Abdulrhman Jalal.
Source repositories: [UniConnectFrontEnd](https://github.com/MoslemAhmed1/UniConnectFrontEnd)
and [UniConnectBackEnd](https://github.com/MoslemAhmed1/UniConnectBackEnd).
This combined repository adds portable setup, hosted deployment, application fixes, and a separate
software testing workspace. It does not relicense upstream source code.
