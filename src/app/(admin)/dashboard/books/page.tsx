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
     Books
    </div>
  )
}

export default BooksCRUD
