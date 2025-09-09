import oracledb from 'oracledb';
import path from 'path';
import 'dotenv/config'; // make sure you have installed dotenv

// Set TNS_ADMIN to point to your wallet folder
process.env.TNS_ADMIN = path.resolve(process.env.TNS_ADMIN);

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,                  // from .env
      password: process.env.DB_PASSWORD,          // from .env
      connectString: process.env.DB_CONNECT_STRING,  // from .env
      walletLocation: path.resolve(process.env.TNS_ADMIN),
      walletPassword: process.env.WALLET_PASSWORD
    });

    console.log('Connected to Oracle DB!');
    return connection;
  } catch (err) {
    console.error('DB connection failed!');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
    throw err;
  }
}
