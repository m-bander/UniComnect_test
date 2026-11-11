// Explicitly mutating checks for the isolated testing site only, never an existing production database.
// Usage: node qa/hosted-auth-smoke.mjs <private-access-json> --isolated-testing
import fs from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

if (process.argv[3] !== "--isolated-testing") throw new Error("Explicit --isolated-testing acknowledgement is required.");
const access = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const base = access.website;
const cleanup = [];
let passed = 0;
function check(name, actual, expected) {
  assert.equal(actual, expected, name);
  passed++;
  console.log(`PASS ${name}`);
}
function client() {
  return { cookie: "", token: "" };
}
async function request(session, route, method = "GET", data) {
  const response = await fetch(new URL("/api" + route, base), {
    method, headers: { "Content-Type": "application/json", Origin: base,
      ...(session.cookie ? { Cookie: session.cookie } : {}),
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(30000),
  });
  for (const value of response.headers.getSetCookie()) session.cookie = value.split(";")[0];
  const body = await response.json().catch(() => null);
  if (body?.accessToken) session.token = body.accessToken;
  return { status: response.status, body, headers: response.headers };
}
async function login(email, password = access.password) {
  const session = client();
  const result = await request(session, "/auth/login", "POST", { email, password });
  check(`login ${email}`, result.status, 200);
  check("password omitted from login response", result.body.user.password, undefined);
  return { ...session, user: result.body.user };
}

const admin = client();
try {
  check("database readiness", (await request(client(), "/ready")).status, 200);
  check("public catalogue", (await request(client(), "/catalog")).status, 200);
  check("anonymous access blocked", (await request(client(), "/users")).status, 401);
  Object.assign(admin, await login("admin@uniconnect.test"));
  check("admin user listing", (await request(admin, "/users")).status, 200);
  const student = await login("student@uniconnect.test");
  check("student enrolled courses", (await request(student, "/me/courses/enrolled")).status, 200);
  check("student admin access rejected", (await request(student, "/users")).status, 401);
  const instructor = await login("instructor@uniconnect.test");
  check("instructor teaching courses", (await request(instructor, "/me/courses/teaching")).status, 200);
  check("pending instructor blocked", (await request(client(), "/auth/login", "POST", { email: "pending@uniconnect.test", password: access.password })).status, 401);

  const marker = randomUUID();
  const email = `smoke-${marker}@uniconnect.test`;
  const password = `Smoke!${randomUUID()}`;
  const data = { first_name: "Smoke", parent_name: "Student", email, password, role: "student", year: "3", code: `SMOKE-${marker}` };
  check("student signup", (await request(client(), "/users/register", "POST", data)).status, 201);
  const fresh = await login(email, password);
  cleanup.push(fresh.user.id);
  check("duplicate signup rejected", (await request(client(), "/users/register", "POST", data)).status, 400);
  check("wrong password rejected", (await request(client(), "/auth/login", "POST", { email, password: "IncorrectSmokePassword!" })).status, 401);
  check("protected profile", (await request(fresh, "/users/me")).status, 200);
  const oldSession = { ...fresh };
  check("refresh rotation", (await request(fresh, "/auth/refresh")).status, 201);
  check("old refresh token invalidated", (await request(oldSession, "/auth/refresh")).status, 401);
  check("logout", (await request(fresh, "/auth/logout")).status, 200);
  check("logout revokes protected access", (await request(fresh, "/users/me")).status, 401);

  const teacherEmail = `smoke-teacher-${marker}@uniconnect.test`;
  check("instructor signup", (await request(client(), "/users/register", "POST", { ...data, email: teacherEmail, role: "professor/ta" })).status, 201);
  const lookup = await request(admin, `/users?search=${encodeURIComponent(teacherEmail)}`);
  const teacher = lookup.body.data.users.find(user => user.email === teacherEmail);
  assert.ok(teacher, "new instructor can be found by admin");
  cleanup.push(teacher.id);
  check("new instructor requires approval", (await request(client(), "/auth/login", "POST", { email: teacherEmail, password })).status, 401);
  check("admin approves instructor", (await request(admin, `/users/${teacher.id}/approve`, "PUT")).status, 200);
  await login(teacherEmail, password);
  console.log(`Completed ${passed} hosted checks against the isolated testing site. No credentials or tokens were logged.`);
} finally {
  for (const id of cleanup) {
    const response = await request(admin, `/users/${id}`, "DELETE");
    assert.equal(response.status, 200, "remove only this run's temporary smoke account");
  }
  for (const session of [admin]) {
    if (session.cookie) await request(session, "/auth/logout");
  }
}
