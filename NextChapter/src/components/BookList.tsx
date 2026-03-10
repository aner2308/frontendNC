import BookCard from "./BookCard";
import type { UserBook } from "../types/UserBook";

interface BookListProps {
  books: UserBook[];
}

const BookList = ({ books }: BookListProps) => {
  if (books.length === 0) {
    return <p>Inga böcker hittades.</p>;
  }

  return (
    <div className="book-grid">
      {books.map(book => (
        <BookCard
          key={book._id}
          title={book.title}
          author={book.author}
          status={book.status}
          pagesRead={book.pagesRead}
          cover={book.cover}
        />
      ))}
    </div>
  );
};

export default BookList;