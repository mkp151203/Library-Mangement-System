import oracledb from 'oracledb';

// You no longer need to import dotenv here if it's already configured
// at the application's entry point (e.g., server.js).

oracledb.initOracleClient(); // Only if using Oracle Instant Client on Windows

// 💡 Fetch credentials from environment variables
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Oracle DB connected');
    return connection;
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    throw err;
  }
}