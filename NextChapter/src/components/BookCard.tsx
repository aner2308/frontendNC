import { useState } from "react";
import { Link } from "react-router-dom";
import type { UserBook } from "../types/UserBook";
import "./BookCard.css"

//Löser felmeddelanden för thumbnails
const imageSecurity = ( url?: string) => url?.replace('http://','https://')

interface BookCardProps {
  book: UserBook;
  token: string;
  onStatusChange: (bookId: string, newStatus: "want-to-read" | "reading" | "finished", pagesRead?: number) => void;
  onDelete: (bookId: string) => void;
}

const BookCard = ({ book, onStatusChange, onDelete }: BookCardProps) => {
  const [status, setStatus] = useState(book.status);

  //Uppdaterar vid statusförändring
  const handleChange = async (newStatus: "want-to-read" | "reading" | "finished") => {
    setStatus(newStatus);
    onStatusChange(book.bookId, newStatus, newStatus === "finished" ? book.pagesRead : undefined);
  };

  //Utseende för bokkort
  return (
    <div className="book-card">
      <Link to={`/book/${book.bookId}`}>
        {book.cover && <img src={imageSecurity(book.cover)} alt={book.title} />}
        <h4>{book.title}</h4>
        <p>{book.author}</p>
      </Link>

      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as "want-to-read" | "reading" | "finished")}
      >
        <option value="want-to-read">Vill läsa</option>
        <option value="reading">Läser just nu</option>
        <option value="finished">Har läst</option>
      </select>

      <button onClick={() => onDelete(book.bookId)}>Ta bort</button>
    </div>
  );
};

export default BookCard;