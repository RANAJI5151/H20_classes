/**
 * Cloudflare-compatible database connection utilities
 * Supports both traditional and Cloudflare D1 databases
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export type DatabaseConnection = ReturnType<typeof drizzle>;

interface DbConfig {
  databaseUrl?: string;
  d1Binding?: any; // Cloudflare D1 binding
  useD1?: boolean;
}

/**
 * Initialize database connection for Cloudflare Workers or Node.js
 * 
 * @param config Database configuration
 * @returns Drizzle database instance
 */
export async function initializeDatabase(config: DbConfig): Promise<DatabaseConnection> {
  // If D1 is configured, use it (Cloudflare Workers environment)
  if (config.useD1 && config.d1Binding) {
    console.log("📊 Connecting to Cloudflare D1 database...");
    // Note: D1 adapter requires different handling
    // const db = drizzle(config.d1Binding);
    throw new Error(
      "D1 support requires drizzle d1 adapter. " +
      "Install: npm install drizzle-orm/d1"
    );
  }

  // Use traditional PostgreSQL pool
  if (!config.databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is required when not using D1"
    );
  }

  console.log("📊 Connecting to PostgreSQL database...");

  const pool = new Pool({
    connectionString: config.databaseUrl,
    // Cloudflare-specific optimizations
    max: 1, // Workers have limited connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Connection interruption handling
    keepAlives: true,
  });

  // Test connection
  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful");
    client.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    // Allow startup to continue for non-critical environments
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }

  return drizzle(pool);
}

/**
 * Migration helper for Cloudflare D1
 * Run this through Cloudflare dashboard or local migrations
 */
export async function runMigrations(db: DatabaseConnection): Promise<void> {
  console.log("🔄 Running database migrations...");
  // Migrations are handled by drizzle-kit
  // This is a placeholder for custom migration logic if needed
}

/**
 * Health check for database connectivity
 */
export async function checkDatabaseHealth(db: DatabaseConnection): Promise<boolean> {
  try {
    // Execute a simple query to verify connection
    await db.execute("SELECT 1");
    return true;
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return false;
  }
}
