import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

// POST /issue — issue a book
router.post('/issue', async (req, res) => {
  const { studentId, bookId, dueDate } = req.body;

  const checkAvailabilityQuery = `
    SELECT available FROM books WHERE id = :bookId
  `;
  const issueQuery = `
    INSERT INTO issued_books (id, book_id, user_id, issue_date, due_date, returned)
    VALUES (issue_seq.NEXTVAL, :bookId, :studentId, SYSDATE, TO_DATE(:dueDate, 'YYYY-MM-DD'), 'N')
  `;
  const updateBookQuery = `
    UPDATE books SET available = 'N' WHERE id = :bookId
  `;
  const updateBooksIssuedQuery = `
    UPDATE user_profiles
    SET books_issued = NVL(books_issued, 0) + 1
    WHERE user_id = :studentId
  `;

  try {
    const connection = await getConnection();

    // Check availability
    const result = await connection.execute(
      checkAvailabilityQuery,
      { bookId }
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ error: 'Book not found' });
    }

    const available = result.rows[0][0];
    if (available !== 'Y') {
      await connection.close();
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Proceed to issue
    await connection.execute(issueQuery, { bookId, studentId, dueDate }, { autoCommit: true });
    await connection.execute(updateBookQuery, { bookId }, { autoCommit: true });
    await connection.execute(updateBooksIssuedQuery, { studentId }, { autoCommit: true });

    await connection.close();
    res.json({ message: 'Book issued successfully' });
  } catch (err) {
    console.error('❌ Error issuing book:', err);
    res.status(500).json({ error: 'Failed to issue book' });
  }
});

// POST /return — return a book
router.post('/return', async (req, res) => {
  const { studentId, bookId } = req.body;

  const returnQuery = `
    UPDATE issued_books
    SET returned = 'Y'
    WHERE book_id = :bookId AND user_id = :studentId AND returned = 'N'
  `;
  const updateBookQuery = `
    UPDATE books SET available = 'Y' WHERE id = :bookId
  `;
  const updateBooksIssuedQuery = `
    UPDATE user_profiles
    SET books_issued = books_issued - 1
    WHERE user_id = :studentId AND books_issued > 0
  `;

  try {
    const connection = await getConnection();

    // Update issued_books table
    const result = await connection.execute(returnQuery, { bookId, studentId }, { autoCommit: true });

    if (result.rowsAffected === 0) {
      await connection.close();
      return res.status(400).json({ error: 'No active issued book found for return' });
    }

    // Update book availability and user profile
    await connection.execute(updateBookQuery, { bookId }, { autoCommit: true });
    await connection.execute(updateBooksIssuedQuery, { studentId }, { autoCommit: true });

    await connection.close();
    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    console.error('❌ Error returning book:', err);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

export default router;
