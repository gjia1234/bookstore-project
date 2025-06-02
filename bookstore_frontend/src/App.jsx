import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Replace the URL with your server's API endpoint
        const response = await fetch('http://localhost:8000/GetBooks/');

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Bookstore</h1>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.ISBNNo} className="book-card">
            <h2>{book.Title}</h2>
            <p>{book.Quantity}</p>
            <p>{book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
