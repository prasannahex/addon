const http = require('http');
const { Client } = require('pg');

const PORT = process.env.PORT || 3000;

const dbConnectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URI ||
  process.env.NF_GENAI_POSTGRESQL_POSTGRES_URI;

if (!dbConnectionString) {
  console.error('❌ Error: Database connection string not found');
  process.exit(1);
}

const client = new Client({
  connectionString: dbConnectionString,
});

async function start() {
  try {
    // Connect to PostgreSQL
    await client.connect();

    console.log('🚀 Successfully connected to Northflank Database Add-on!');

    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Server time from database:', result.rows[0].now);

    // Health endpoint
    const server = http.createServer(async (req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            status: 'healthy',
            database: 'connected',
          })
        );
      }

      if (req.url === '/') {
        const dbResult = await client.query('SELECT NOW()');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            message: 'Northflank PostgreSQL connected',
            dbTime: dbResult.rows[0].now,
          })
        );
      }

      res.writeHead(404);
      res.end('Not Found');
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🌐 Server listening on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

start();
