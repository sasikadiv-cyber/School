import "dotenv/config";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required.");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const directory = path.resolve(process.env.BACKUP_DIR || ".data/backups");
mkdirSync(directory, { recursive: true });
const target = path.join(directory, `stc-${stamp}.dump`);

const result = spawnSync(
  "pg_dump",
  ["--format=custom", "--no-owner", "--no-privileges", "--file", target, databaseUrl],
  { stdio: "inherit" },
);
if (result.status !== 0) {
  throw new Error(`pg_dump failed with exit code ${result.status ?? "unknown"}.`);
}
console.log(`Database backup created: ${target}`);
