'use client'
import React from 'react'

const BooksCRUD = () => {
    const [books, setBooks] = React.useState([])

    React.useEffect(() => {
        fetch('/api/books')
        .then(res => res.json())
        .then(data => setBooks(data))
    }, [])
  return (
    <div>
      {books.map((book: any) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  )
}

export default BooksCRUD
