import "dotenv/config";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

if (process.env.ALLOW_RESTORE !== "YES") {
  throw new Error("Restore blocked. Re-run with ALLOW_RESTORE=YES after verifying the target database.");
}
const backup = process.env.BACKUP_FILE;
if (!backup || !existsSync(backup)) {
  throw new Error("BACKUP_FILE must point to an existing pg_dump custom-format backup.");
}
const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required.");

console.log(`Restoring ${path.resolve(backup)}. Existing public objects will be replaced.`);
const result = spawnSync(
  "pg_restore",
  [
    "--clean",
    "--if-exists",
    "--no-owner",
    "--no-privileges",
    "--dbname",
    databaseUrl,
    backup,
  ],
  { stdio: "inherit" },
);
if (result.status !== 0) {
  throw new Error(`pg_restore failed with exit code ${result.status ?? "unknown"}.`);
}
console.log("Database restore completed.");
