import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { NavLink } from "react-router-dom";

interface Book {
    id: string;
    title: string;
    author: string;
    cover?: string;
}

const Home = () => {
    const [results, setResults] = useState<Book[]>([]);

    const searchBooks = async (query: string) => {
        try {
            const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${API_KEY}`);

            if (!res.ok) {
                console.error("Google API fel:", res.status);
                setResults([]);
                return;
            }

            const data = await res.json();

            if(!data.items) {
                setResults([]);
                return;
            }

            const books: Book[] = data.items.map((item: any) => ({
                id: item.id,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors?.join(", ") ?? "Okänd författare",
                cover: item.volumeInfo.imageLinks?.thumbnail ?? null
            }));

            setResults(books);

        } catch(error) {
            console.error(error)
        }
    }


    return (
        <div>
      <h1>Hitta en bok</h1>

      <SearchBar onSearch={searchBooks} />

      <div>
        {results.map((book) => (
          <NavLink to={`/book/${book.id}`} key={book.id} className="book-result">
            {book.cover && <img src={book.cover} alt={book.title} />}
            <h4>{book.title}</h4>
            <p>{book.author}</p>
          </NavLink>
        ))}
      </div>
    </div>
    );
};

export default Home;