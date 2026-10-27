import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/drizzle";
import { seedFixture } from "../qa/seed-fixture";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const pool = new Pool({connectionString:process.env.DATABASE_URL,max:1});
  const client=await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(710276)");
    const result=await client.query("SELECT to_regclass('public.users') AS existing");
    if (!result.rows[0].existing) {
      const folder=path.resolve(__dirname,"../qa/schema");
      for(const file of fs.readdirSync(folder).filter(f=>f.endsWith(".sql")).sort()) {
        await client.query(fs.readFileSync(path.join(folder,file),"utf8"));
      }
    }
    await client.query(fs.readFileSync(path.join(__dirname,"001_procedures.sql"),"utf8"));
    const count=await client.query("SELECT count(*)::integer AS count FROM users");
    if(count.rows[0].count===0) {
      await seedFixture(drizzle(client,{schema}), process.env.DEMO_PASSWORD || "UniConnect123!");
      console.log("Hosted sample accounts and course initialized.");
    } else console.log("Existing users preserved; no sample records overwritten.");
    await client.query("COMMIT");
  }catch(error){await client.query("ROLLBACK");throw error}
  finally{client.release();await pool.end()}
}
main().catch(error=>{console.error("Database initialization failed:",error.message);process.exitCode=1});
