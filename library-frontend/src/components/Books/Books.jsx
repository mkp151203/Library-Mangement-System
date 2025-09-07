import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../common/BackButton';
import './Books.css';
const API_URL = import.meta.env.VITE_API_URL;
function Books() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: '',
    cover: ''
  });

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch books:', err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/books`, newBook);
      setNewBook({
        title: '',
        author: '',
        genre: '',
        publishedYear: '',
        cover: ''
      });
      fetchBooks();
    } catch (err) {
      console.error('❌ Failed to add book:', err);
    }
  };

  const handleDeleteBook = async (id, title) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    
    // Only proceed with deletion if user clicked OK
    if (isConfirmed) {
      try {
        await axios.delete(`${API_URL}/books/${id}`);
        fetchBooks();
      } catch (err) {
        alert(err.response?.data?.error || '❌ Failed to delete book');
      }
    }
    // If canceled, do nothing
  };

  return (
    <div className="books-container">
      <BackButton />
      <h2>Library Books</h2>

      {userRole !== 'student' && (
        <form className="add-book-form" onSubmit={handleAddBook}>
          <input
            type="text"
            placeholder="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Published Year"
            value={newBook.publishedYear}
            onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={newBook.cover}
            onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
          />
          <button type="submit">Add Book</button>
        </form>
      )}

      {userRole === 'student' && (
        <p style={{ color: 'gray', fontStyle: 'italic' }}>
          🔒 Only librarians can add books.
        </p>
      )}

      <div className="books-list">
        {books.map((book) => (
          <div key={book.ID} className="book-card">
            <img
              src={book.COVER}
              alt={book.TITLE}
              className="book-cover"
            />
            <div className="book-card-content">
              <h3>{book.TITLE}</h3>
              <p className="book-id"><strong>ID:</strong> {book.ID}</p>
              <p className="book-author">By {book.AUTHOR}</p>
              <p className="book-genre">{book.GENRE} ({book.PUBLISHEDYEAR})</p>
              <p className={book.AVAILABLE === 'Y' ? 'status-available' : 'status-unavailable'}>
                {book.AVAILABLE === 'Y' ? 'Available' : 'Checked Out'}
              </p>
              {userRole !== 'student' && book.AVAILABLE === 'Y' && (
                <button
                  className="delete-book-btn"
                  onClick={() => handleDeleteBook(book.ID, book.TITLE)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;