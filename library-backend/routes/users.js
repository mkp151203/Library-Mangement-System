import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

// GET user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const conn = await getConnection();
    console.log('📥 Executing Query:', `SELECT * FROM user_profiles WHERE user_id = :id`, 'with bind:', [req.params.id]);

    const result = await conn.execute(
      `SELECT * FROM user_profiles WHERE user_id = :id`,
      [req.params.id]
    );
    await conn.close();

    if (result.rows.length === 0) {
      return res.status(404).json(null);
    }

    const row = result.rows[0];
    const user = {
      id: row[0],
      name: row[1],
      email: row[2],
      role: row[3],
      department: row[4],
      year: row[5],
      joinDate: row[6],
      booksIssued: row[7],
      avatar: row[8],
    };

    res.json(user);
  } catch (err) {
    console.error('❌ Fetch user failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Create user profile
router.post('/', async (req, res) => {
  const { id, name, email, role, avatar, department, year, joinDate, booksIssued } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO user_profiles (
        user_id, name, email, role, avatar, department, year, join_date, books_issued
      ) VALUES (
        :id, :name, :email, :role, :avatar, :department, :year, TO_DATE(:joinDate, 'YYYY-MM-DD'), :booksIssued
      )`,
      { id, name, email, role, avatar, department, year, joinDate, booksIssued },
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: 'User profile created successfully' });
  } catch (err) {
    console.error('❌ Insert user profile failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: Update user profile
router.put('/:id', async (req, res) => {
  const { name, email, role, avatar, department, year, joinDate, booksIssued } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE user_profiles SET
         name = :name,
         email = :email,
         role = :role,
         avatar = :avatar,
         department = :department,
         year = :year,
         join_date = TO_DATE(:joinDate, 'YYYY-MM-DD'),
         books_issued = :booksIssued
       WHERE user_id = :id`,
      { id: req.params.id, name, email, role, avatar, department, year, joinDate, booksIssued },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error('❌ Update user profile failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
