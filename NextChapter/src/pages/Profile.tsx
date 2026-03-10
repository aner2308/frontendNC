import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";
import StatsCard from "../components/StatsCard";
import BookList from "../components/BookList";
import type { BookStatusType, UserBook } from "../types/UserBook";

interface BookStatus {
    _id: string;
    bookId: string;
    status: "want-to-read" | "reading" | "finished";
    pagesRead?: number;
}

const Profile = () => {
    const { token, logout } = useContext(AuthContext);
    const [books, setBooks] = useState<UserBook[]>([]);
    const [error, setError] = useState("");

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    useEffect(() => {
        const fetchBooks = async () => {
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5000/api/books/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    setError("Kunde inte hämta böcker.");
                    return;
                }

                const statuses: BookStatus[] = await res.json();

                // Filtrera bort tomma googleBookId
                const validStatuses = statuses.filter(s => s.bookId);

                const booksWithInfo: UserBook[] = await Promise.all(
                    validStatuses.map(async (status) => {
                        try {

                            const googleRes = await fetch(
                                `https://www.googleapis.com/books/v1/volumes/${status.bookId}?key=${API_KEY}`
                            );

                            const googleData = await googleRes.json();
                            const volume = googleData.volumeInfo;

                            return {
                                ...status,
                                title: volume?.title || "Okänd titel",
                                author: volume?.authors?.[0] || "Okänd författare",
                                cover: volume?.imageLinks?.thumbnail || null,
                            };
                        } catch {
                            return {
                                ...status,
                                title: "Okänd titel",
                                author: "Okänd författare",
                                cover: null,
                            };
                        }
                    })
                );

                setBooks(booksWithInfo);
            } catch {
                setError("Kunde inte nå servern.");
            }
        };

        fetchBooks();
    }, [token]);

    //UPPDATERA STATUS
    const updateStatus = async (bookId: string, newStatus: "want-to-read" | "reading" | "finished", pagesRead?: number) => {
        try {
            const res = await fetch("http://localhost:5000/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ bookId, status: newStatus, pagesRead }),
            });

            if (!res.ok) {
                const data = await res.json();
                console.error(data.message);
                return;
            }

            setBooks(prev => prev.map(b => b.bookId === bookId ? { ...b, status: newStatus, pagesRead: pagesRead ?? b.pagesRead } : b));
        } catch (err) {
            console.error(err);
        }
    };

    //RADERA BOK
    const deleteBook = async (bookId: string) => {
        try {
            const book = books.find(b => b.bookId === bookId);
            if (!book) return;

            await fetch(`http://localhost:5000/api/books/${book._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            setBooks(prev => prev.filter(b => b.bookId !== bookId));
        } catch (err) {
            console.error(err);
        }
    };

    // Statistik
    const totalBooksRead = books.filter(b => b.status === "finished").length;

    const totalPagesRead = books
        .filter(b => b.status === "finished")
        .reduce((sum, b) => sum + (b.pagesRead || 0), 0);

    const booksReading = books.filter(b => b.status === "reading").length;

    return (
        <div className="profile-container">
            <h2>Min profil</h2>

            {error && <p className="error">{error}</p>}

            <div className="stats-grid">
                <StatsCard label="Böcker lästa" value={totalBooksRead} />
                <StatsCard label="Sidor lästa" value={totalPagesRead} />
                <StatsCard label="Böcker läses just nu" value={booksReading} />
            </div>

            <section>
                <h3>Mina böcker</h3>
                <BookList books={books} token={token} onStatusChange={updateStatus} onDelete={deleteBook} />
            </section>

            <button onClick={logout}>Logga ut</button>
        </div>
    );
};

export default Profile;