import BookCard from "./BookCard";
import type { UserBook } from "../types/UserBook";

interface BookListProps {
  books: UserBook[];
  token: string;
  onStatusChange: (bookId: string, newStatus: "want-to-read" | "reading" | "finished", pagesRead?: number) => void;
  onDelete: (bookId: string) => void;
}

const BookList = ({ books, token, onStatusChange, onDelete }: BookListProps) => {
  if (books.length === 0) return <p>Inga böcker hittades.</p>;

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          token={token}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BookList;