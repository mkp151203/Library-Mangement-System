import oracledb from 'oracledb';

oracledb.initOracleClient(); // Only if using Oracle Instant Client on Windows

const dbConfig = {
  user: 'librarian',
  password: 'Mehul2974',
  connectString: 'localhost/XE'
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
