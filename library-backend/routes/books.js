import express from 'express';
import { getConnection } from '../db.js';
import { authenticateToken } from '../middleware/jwt.js';
import { authorizeRoles } from '../middleware/auth.js';
const router = express.Router();

// GET all books
router.get('/',authenticateToken, async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM books`,
      [],
      { outFormat: 4002 } // oracledb.OUT_FORMAT_OBJECT
    );
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching books:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST a new book
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { title, author, genre, publishedYear, cover } = req.body;

  try {
    const connection = await getConnection();

    let result = await connection.execute(`SELECT MAX(id) AS max_id FROM books`);
    let id = result.rows[0].MAX_ID || 0;

    let inserted = false;

    while (!inserted) {
      id++;

      try {
        await connection.execute(
          `INSERT INTO books (id, title, author, genre, publishedYear, available, cover)
           VALUES (:id, :title, :author, :genre, :publishedYear, :available, :cover)`,
          {
            id,
            title,
            author,
            genre,
            publishedYear,
            available: 'Y',
            cover: cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'
          },
          { autoCommit: true }
        );

        inserted = true;
        res.json({ message: 'Book added successfully', id });
      } catch (err) {
        if (err.errorNum !== 1) {
          throw err; // only handle duplicate ID, otherwise throw
        }
        // Else: ID already exists, try next
      }
    }

    await connection.close();
  } catch (err) {
    console.error('❌ Error adding book:', err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});



// DELETE a book by ID
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
  
    try {
      const connection = await getConnection();
  
      // Step 1: Delete related issued_book entries
      await connection.execute(
        `DELETE FROM issued_books WHERE book_id = :id`,
        { id }
      );
  
      // Step 2: Delete from books table
      await connection.execute(
        `DELETE FROM books WHERE id = :id`,
        { id },
        { autoCommit: true }
      );
  
      await connection.close();
      res.json({ message: '✅ Book and related records deleted successfully' });
    } catch (err) {
      console.error('❌ Error deleting book:', err);
      res.status(500).json({ error: 'Failed to delete book' });
    }
  });
  

// GET issued books
router.get('/issued', async (req, res) => {
  const { userId, role } = req.query;

  try {
    const connection = await getConnection();

    let baseQuery = `
      SELECT 
        ib.id,
        b.title AS book_title,
        b.cover AS book_cover,
        up.name AS student_name,
        up.user_id AS student_id,
        TO_CHAR(ib.issue_date, 'YYYY-MM-DD') AS issue_date,
        TO_CHAR(ib.due_date, 'YYYY-MM-DD') AS due_date,
        CASE 
          WHEN ib.returned = 'Y' THEN 'Returned'
          WHEN ib.due_date < SYSDATE THEN 'Overdue'
          WHEN ib.due_date <= SYSDATE + 2 THEN 'Due Soon'
          ELSE 'On Time'
        END AS status
      FROM issued_books ib
      JOIN books b ON ib.book_id = b.id
      JOIN user_profiles up ON ib.user_id = up.user_id
    `;

    let binds = {};
    if (role === 'student') {
      baseQuery += ` WHERE ib.user_id = :userId`;
      binds = { userId };
    }

    const result = await connection.execute(baseQuery, binds, { outFormat: 4002 });

    await connection.close();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching issued books:', err);
    res.status(500).json({ error: 'Failed to fetch issued books' });
  }
});

export default router;
