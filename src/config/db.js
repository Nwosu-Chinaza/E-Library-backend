import { Pool } from "pg";
import env from "./env.js";

// Create PostgreSQL connection pool
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

/**
 * Test the database connection when the server starts.
 */
export const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL Connected Successfully");
    console.log(`Database: ${env.DB_NAME}`);
    console.log(`Host: ${env.DB_HOST}:${env.DB_PORT}`);

    client.release();
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

// Export the connection pool
export default pool;