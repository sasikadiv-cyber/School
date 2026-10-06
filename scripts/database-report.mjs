import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required.");
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
try {
  const tablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  const columnsResult = await client.query(`
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);

  const tables = [];
  for (const { table_name: tableName } of tablesResult.rows) {
    // Table names come from information_schema; quote defensively.
    const quoted = `"${String(tableName).replaceAll('"', '""')}"`;
    const count = await client.query(`SELECT count(*)::int AS count FROM ${quoted}`);
    tables.push({ table: tableName, rows: count.rows[0].count });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    database: "redacted",
    tables,
    columns: columnsResult.rows,
  };
  const directory = path.resolve(process.env.REPORT_DIR || ".data/reports");
  mkdirSync(directory, { recursive: true });
  const target = path.join(
    directory,
    `database-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  writeFileSync(target, JSON.stringify(report, null, 2));
  console.table(tables);
  console.log(`Database report created: ${target}`);
} finally {
  await client.end();
}
