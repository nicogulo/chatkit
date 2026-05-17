// Run with: node scripts/migrate-admin.mjs
import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read env from .env.local
const envFile = readFileSync(join(__dirname, "..", ".env.local"), "utf-8");
const env = Object.fromEntries(
  envFile.split("\n").filter(l => l && !l.startsWith("#")).map(l => {
    const [k, ...v] = l.split("=");
    return [k.trim(), v.join("=").trim()];
  })
);

const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = "jvemtakprezfbisllats";

// Try to connect via Supabase pooler
// The password for the pooler is the project's database password
// We don't have it, so let's try using the service role key approach

// Actually, let's try the Supabase API approach with the newer /sql endpoint
const sql = `
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' NOT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false NOT NULL;
UPDATE profiles SET role = 'admin' WHERE id = '99d126cc-0c0c-4b76-b303-69f547692ee1';
`;

// Use the Supabase SQL REST endpoint (available on newer projects)
const response = await fetch(`https://${PROJECT_REF}.supabase.co/rest/v1/rpc/pgmeta`, {
  method: "POST",
  headers: {
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

if (response.ok) {
  console.log("Migration successful!");
  const data = await response.json();
  console.log(data);
} else {
  console.log("RPC approach failed:", response.status, await response.text());
  console.log("\nPlease run this SQL manually in Supabase SQL Editor:\n");
  console.log(sql);
}
