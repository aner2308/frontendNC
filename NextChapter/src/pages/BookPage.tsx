import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./BookPage.css"

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover?: string;
  pageCount?: number;
}

interface UserBookStatus {
  _id: string;
  bookId: string;
  status: "want-to-read" | "reading" | "finished";
}

const BookPage = () => {
  const { bookId } = useParams();
  const { token } = useContext(AuthContext);

  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<UserBookStatus | null>(null);

  const [status, setStatus] =
    useState<"want-to-read" | "reading" | "finished">("want-to-read");

  const [message, setMessage] = useState("");

  // HÄMTA IN BOK
  useEffect(() => {
    if (!bookId) return;

    const fetchData = async () => {
      try {
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        // Hämta bok från Google
        const googleRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
        );

        const googleData = await googleRes.json();
        const volume = googleData.volumeInfo;

        setBook({
          id: googleData.id,
          title: volume.title,
          author: volume.authors?.join(", ") ?? "Okänd författare",
          description: volume.description,
          cover: volume.imageLinks?.thumbnail,
          pageCount: volume.pageCount
        });

        // Hämtar användarens böcker
        if (token) {
          const res = await fetch(
            "http://localhost:5000/api/books/user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userBooks: UserBookStatus[] = await res.json();

          const existing = userBooks.find(
            (b) => b.bookId === bookId
          );

          if (existing) {
            setUserBook(existing);
            setStatus(existing.status);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [bookId, token]);


  // LÄGG TILL / UPPDATERA BOK
  const saveBook = async () => {
    if (!token || !bookId) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookId,
            status,
            pagesRead: status === "finished" ? book?.pageCount : 0
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Kunde inte spara.");
        return;
      }

      setUserBook(data);
      setMessage("Sparat!");
    } catch {
      setMessage("Serverfel.");
    }
  };

  // TA BORT BOK
  const deleteBook = async () => {
    if (!token || !userBook) return;

    try {
      await fetch(
        `http://localhost:5000/api/books/${userBook._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserBook(null);
      setMessage("Boken borttagen.");
    } catch {
      setMessage("Kunde inte ta bort bok.");
    }
  };

  if (!book) return <p>Laddar bok...</p>;

  return (
    <div className="book-page">
      {book.cover && <img src={book.cover} alt={book.title} />}

      <h2>{book.title}</h2>
      <p>{book.author}</p>

      <p dangerouslySetInnerHTML={{ __html: book.description || "" }} />

      <div className="add-book-section">
        <h3>Min lässtatus</h3>

        {!userBook ? (
          <>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "want-to-read" | "reading" | "finished")}
            >
              <option value="want-to-read">Vill läsa</option>
              <option value="reading">Läser just nu</option>
              <option value="finished">Har läst</option>
            </select>

            <button onClick={saveBook}>
              Lägg till bok
            </button>
          </>
        ) : (
          <>
            <p>Redan i ditt bibliotek</p>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as | "want-to-read" | "reading" | "finished")}
            >
              <option value="want-to-read">Vill läsa</option>
              <option value="reading">Läser just nu</option>
              <option value="finished">Har läst</option>
            </select>

            <button onClick={saveBook}>
              Updatera status
            </button>

            <button onClick={deleteBook}>
              Ta bort från ditt biblitek
            </button>
          </>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default BookPage;