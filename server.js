const { Client } = require('pg');

// Northflank automatically provides DATABASE_URL or POSTGRES_URI 
// once you link your PostgreSQL Add-on to your service.
const dbConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_URI;

if (!dbConnectionString) {
  console.error("❌ Error: Add-on environment variable is missing!");
  process.exit(1);
}

const client = new Client({
  connectionString: dbConnectionString,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("🚀 Successfully connected to Northflank Database Add-on!");
    
    // Quick test query
    const res = await client.query('SELECT NOW()');
    console.log("⏰ Server time from database:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.stack);
  } finally {
    await client.end();
  }
}

connectDB();
