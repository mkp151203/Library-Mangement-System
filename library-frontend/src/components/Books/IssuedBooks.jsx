import { useEffect, useState } from 'react';
import BackButton from '../common/BackButton';
import './IssuedBooks.css';
const API_URL = import.meta.env.VITE_API_URL;
function IssuedBooks() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturned, setShowReturned] = useState(false);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const role = localStorage.getItem('role');

        const response = await fetch(
          `${API_URL}/books/issued?userId=${userId}&role=${role}`
        );
        const data = await response.json();
        setIssuedBooks(data);
      } catch (error) {
        console.error('❌ Error fetching issued books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, []);

  const dueBooks = issuedBooks.filter(book => book.STATUS !== 'Returned');
  const returnedBooks = issuedBooks.filter(book => book.STATUS === 'Returned');

  return (
    <div className="issued-books-container">
      <BackButton />
      <h2>Issued Books</h2>

      {loading ? (
        <p>Loading issued books...</p>
      ) : (
        <>
          <div className="issued-books-grid">
            {dueBooks.map(book => (
              <div key={book.ID} className="issued-book-card">
                <img src={book.BOOK_COVER} alt={book.BOOK_TITLE} className="book-cover" />
                <div className="book-info">
                  <h3>{book.BOOK_TITLE}</h3>
                  <div className="info-row">
                    <span className="label">Student:</span>
                    <span>{book.STUDENT_NAME}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">ID:</span>
                    <span>{book.STUDENT_ID}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Issued:</span>
                    <span>{book.ISSUE_DATE}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Due:</span>
                    <span>{book.DUE_DATE}</span>
                  </div>
                  <div className={`status-badge ${book.STATUS.toLowerCase().replace(' ', '-')}`}>
                    {book.STATUS}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {returnedBooks.length > 0 && (
            <div className="returned-toggle">
              <button onClick={() => setShowReturned(prev => !prev)}>
                {showReturned ? 'Hide Returned Books' : 'Show Returned Books'}
              </button>

              {showReturned && (
                <div className="issued-books-grid">
                  {returnedBooks.map(book => (
                    <div key={book.ID} className="issued-book-card">
                      <img src={book.BOOK_COVER} alt={book.BOOK_TITLE} className="book-cover" />
                      <div className="book-info">
                        <h3>{book.BOOK_TITLE}</h3>
                        <div className="info-row">
                          <span className="label">Student:</span>
                          <span>{book.STUDENT_NAME}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">ID:</span>
                          <span>{book.STUDENT_ID}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Issued:</span>
                          <span>{book.ISSUE_DATE}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Due:</span>
                          <span>{book.DUE_DATE}</span>
                        </div>
                        <div className={`status-badge ${book.STATUS.toLowerCase().replace(' ', '-')}`}>
                          {book.STATUS}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default IssuedBooks;
