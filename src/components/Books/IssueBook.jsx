import { useState } from 'react';
import BackButton from '../common/BackButton';
import './IssueBook.css';

function IssueBook() {
  const [issueForm, setIssueForm] = useState({
    studentId: '',
    bookId: '',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        setIssueForm({ studentId: '', bookId: '', dueDate: '' });
      } else {
        alert('❌ ' + data.error);
      }
    } catch (err) {
      console.error('Error issuing book:', err);
    }
  };
  

  return (
    <div className="issue-book-container">
      <BackButton />
      <h2>Issue Book</h2>
      <form className="issue-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            value={issueForm.studentId}
            onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Book ID:</label>
          <input
            type="text"
            value={issueForm.bookId}
            onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={issueForm.dueDate}
            onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
          />
        </div>
        <button type="submit">Issue Book</button>
      </form>
    </div>
  );
}

export default IssueBook;