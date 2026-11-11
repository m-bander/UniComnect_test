import "dotenv/config";
import { Pool } from "pg";
import { initializeDatabase } from "./initialize";
import { reportServerError } from "../src/utils/reportServerError";

// Explicit one-time provisioning for a newly created, empty testing database.
// Normal builds never call this. Refuse databases with pre-existing application tables.
async function main() {
  if (process.env.TESTING_ENVIRONMENT !== "1" || process.env.DATABASE_MIGRATION_APPROVED !== "1") {
    throw new Error("Testing provisioning requires TESTING_ENVIRONMENT=1 and DATABASE_MIGRATION_APPROVED=1.");
  }
  if (!process.env.DATABASE_URL || !process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) {
    throw new Error("A private database URL and test account password of at least 16 characters are required.");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10000 });
  try {
    const existing = await pool.query("SELECT to_regclass('public.users') AS users, to_regclass('public.app_migration') AS migrations");
    if (existing.rows[0].users) {
      if (existing.rows[0].migrations) {
        const marker = await pool.query("SELECT name FROM app_migration WHERE name='testing-site-provisioned-v1'");
        if (marker.rowCount) {
          console.log("Testing database already provisioned; existing accounts and coursework preserved.");
          return;
        }
      }
      throw new Error("Refusing to provision a database with pre-existing application data.");
    }
    process.env.SEED_DEMO_USERS = "1";
    await initializeDatabase();
    await pool.query("INSERT INTO app_migration(name) VALUES('testing-site-provisioned-v1')");
    console.log("Isolated testing database provisioned. Credentials were not logged.");
  } finally { await pool.end(); }
}
main().catch(error => {
  reportServerError("testing.provision", error);
  console.error("Testing provisioning did not complete. Check private configuration and database state before retrying.");
  process.exitCode = 1;
});
