import { defineConfig } from "drizzle-kit";

if (!process.env.NETLIFY_DATABASE_URL) {
  throw new Error("NETLIFY_DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL,
  },
});
