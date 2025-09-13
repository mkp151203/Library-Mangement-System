import express from 'express';
import { getConnection } from '../db.js';
import { authenticateToken } from '../middleware/jwt.js';
import { authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// 📊 Dashboard stats API
router.get('/stats', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const [totalBooks, booksIssued, activeStudents, overdueBooks] = await Promise.all([
      conn.execute(`SELECT COUNT(*) FROM books`),
      conn.execute(`SELECT COUNT(*) FROM issued_books WHERE returned = 'N'`),
      conn.execute(`SELECT COUNT(*) FROM user_profiles WHERE lower(role) = 'student'`),
      conn.execute(`
        SELECT COUNT(*) 
        FROM issued_books 
        WHERE returned = 'N' AND due_date < SYSDATE
      `),
    ]);

    res.json({
      totalBooks: totalBooks.rows[0][0],
      booksIssued: booksIssued.rows[0][0],
      activeStudents: activeStudents.rows[0][0],
      overdueBooks: overdueBooks.rows[0][0],
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  } finally {
    if (conn) await conn.close();
  }
});

// 🕓 Recent activities (last 5)
router.get('/recent-activities', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(`
        SELECT * FROM (
          SELECT 
            ib.id, 
            CASE 
              WHEN ib.returned = 'Y' THEN 'Book returned'
              ELSE 'Book issued'
            END AS action,
            b.title AS book,
            up.name AS student,
            TO_CHAR(
              CASE 
                WHEN ib.returned = 'Y' THEN ib.due_date 
                ELSE ib.issue_date 
              END, 'YYYY-MM-DD'
            ) AS action_date
          FROM issued_books ib
          JOIN books b ON ib.book_id = b.id
          JOIN user_profiles up ON ib.user_id = up.user_id
          ORDER BY 
            CASE 
              WHEN ib.returned = 'Y' THEN ib.due_date 
              ELSE ib.issue_date 
            END DESC
        )
        WHERE ROWNUM <= 5
      `);



    const activities = result.rows.map(row => ({
      id: row[0],
      action: row[1],
      book: row[2],
      student: row[3],
      date: row[4],
    }));

    res.json(activities);
  } catch (err) {
    console.error('Error fetching recent activities:', err);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  } finally {
    if (conn) await conn.close();
  }
});
router.get('/student/:userId', authenticateToken, authorizeRoles('student'), async (req, res) => {
  const userId = req.params.userId;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const connection = await getConnection();

    const [profileRes, dueRes] = await Promise.all([
      connection.execute(
        `SELECT books_issued FROM user_profiles WHERE user_id = :userId`,
        [userId],
        { outFormat: 4002 }
      ),
      connection.execute(
        `SELECT MIN(due_date) AS next_due_date 
           FROM issued_books 
           WHERE user_id = :userId AND returned = 'N'`,
        [userId],
        { outFormat: 4002 }
      )
    ]);

    const booksIssued = profileRes.rows[0]?.BOOKS_ISSUED || 0;
    const dueDate = dueRes.rows[0]?.NEXT_DUE_DATE;
    const formattedDueDate = dueDate
      ? new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : null;

    await connection.close();
    res.json({ booksIssued, nextDueDate: formattedDueDate });
  } catch (err) {
    console.error('❌ Error fetching student dashboard:', err);
    res.status(500).json({ error: 'Failed to load student dashboard' });
  }
});
export default router;
