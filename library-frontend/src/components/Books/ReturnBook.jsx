import { useState } from 'react';
import BackButton from '../common/BackButton';
import './ReturnBook.css';
const API_URL = import.meta.env.VITE_API_URL;
function ReturnBook() {
  const [returnForm, setReturnForm] = useState({
    bookId: '',
    studentId: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnForm)
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        setReturnForm({ studentId: '', bookId: '' });
      } else {
        alert('❌ ' + data.error);
      }
    } catch (err) {
      console.error('Error returning book:', err);
    }
  };
  

  return (
    <div className="return-book-container">
      <BackButton />
      <h2>Return Book</h2>
      <form className="return-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book ID:</label>
          <input
            type="text"
            value={returnForm.bookId}
            onChange={(e) => setReturnForm({ ...returnForm, bookId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            value={returnForm.studentId}
            onChange={(e) => setReturnForm({ ...returnForm, studentId: e.target.value })}
          />
        </div>
        <button type="submit">Return Book</button>
      </form>
    </div>
  );
}

export default ReturnBook;