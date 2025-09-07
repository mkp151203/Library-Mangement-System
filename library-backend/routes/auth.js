import express from 'express';
import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import { getConnection } from '../db.js';

const router = express.Router();

// 🔐 LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT * FROM users 
      WHERE UPPER(username) = UPPER(:username) 
      AND UPPER(role) = UPPER(:role)
    `;

    const result = await connection.execute(
      query,
      { username: username?.trim(), role: role?.trim() },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found. Check username and role.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.PASSWORD);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({
      message: 'Login successful',
      id: user.ID,
      username: user.USERNAME,
      role: user.ROLE
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// ✅ REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { username, password, role, specialCode } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let connection;

  try {
    connection = await getConnection();

    // Check if username already exists
    const existingUser = await connection.execute(
      `SELECT * FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // 🔐 If admin, check special code
    if (role === 'admin') {
      const adminRes = await connection.execute(
        `SELECT * FROM (
           SELECT password FROM users WHERE role = 'admin' ORDER BY id
         ) WHERE ROWNUM = 1`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const firstAdminPassword = adminRes.rows[0]?.PASSWORD;

      if (!firstAdminPassword) {
        return res.status(403).json({ message: 'No existing admin found for verification' });
      }

      const validCode = await bcrypt.compare(specialCode || '', firstAdminPassword);

      if (!validCode) {
        return res.status(403).json({ message: 'Invalid special code for admin registration' });
      }
    }

    // ✅ Hash password and insert new user
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      `INSERT INTO users (id, username, password, role) 
       VALUES (user_seq.NEXTVAL, :username, :password, :role)`,
      { username, password: hashedPassword, role },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) await connection.close();
  }
});

export default router;
