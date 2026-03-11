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

interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  rating: number;
  reviewText: string;
}

const BookPage = () => {
  const { bookId } = useParams();
  const { token } = useContext(AuthContext);

  const [book, setBook] = useState<Book | null>(null);
  const [userBook, setUserBook] = useState<UserBookStatus | null>(null);

  const [status, setStatus] = useState<"want-to-read" | "reading" | "finished">("want-to-read");
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

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

        // Hämta recensioner
        const reviewRes = await fetch(
          `http://localhost:5000/api/reviews/${bookId}`
        );

        const reviewData = await reviewRes.json();
        setReviews(reviewData);

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

  //Skapa eller uppdatera recension
  const saveReview = async () => {
    if (!token || !bookId) return;

    try {
      const url = editingReviewId
        ? `http://localhost:5000/api/reviews/${editingReviewId}`
        : "http://localhost:5000/api/reviews";

      const method = editingReviewId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          rating,
          reviewText,
        }),
      });

      const data = await res.json();

      if (!res.ok) return;

      setReviews(prev => {
        const exists = prev.find(r => r._id === data._id);

        if (exists) {
          return prev.map(r => r._id === data._id ? data : r);
        }

        return [...prev, data];
      });

      setReviewText("");
      setEditingReviewId(null);

    } catch (err) {
      console.error(err);
    }
  };

  //Starta redigering av recension
  const startEditReview = (review: Review) => {
    setEditingReviewId(review._id);
    setReviewText(review.reviewText);
    setRating(review.rating);
  };

  //Radera reension
  const deleteReview = async (id: string) => {
    if (!token) return;

    await fetch(
      `http://localhost:5000/api/reviews/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReviews(prev => prev.filter(r => r._id !== id));
  };

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
            <p>Finns i dina sparade böcker</p>

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

      <section className="reviews">
        <h3>Recensioner</h3>

        {reviews.length === 0 && <p>Inga recensioner ännu.</p>}

        {reviews.map(r => (
          <div key={r._id} className="review-card">
            <div className="review-header">
              <strong>{r.user.username}</strong>
              <span className="review-rating">
                {"⭐".repeat(r.rating)}
              </span>
            </div>
            <p>{r.reviewText}</p>

            {token && (
              <div className="review-actions">
                <button onClick={() => startEditReview(r)}>
                  Redigera
                </button>

                <button onClick={() => deleteReview(r._id)}>
                  Ta bort
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {token && (
        <div className="review-form">
          <h4>
            {editingReviewId ? "Redigera recension" : "Skriv recension"}
          </h4>

          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>

          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Vad tyckte du om boken?"
          />

          <button onClick={saveReview}>
            {editingReviewId ? "Uppdatera" : "Publicera"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPage;