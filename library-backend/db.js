import oracledb from 'oracledb';

// 💡 Fetch credentials from environment variables
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING // e.g., "IP:1521/ORCL"
};

export async function getConnection() {
  try {
    // Thin mode automatically used in Node-oracledb >= v5
    const connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Oracle DB connected');
    return connection;
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    throw err;
  }
}
