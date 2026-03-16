import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

//Sökruta för böcker
const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    //Om sökfält är ifyllt skickas sökning till Goggle Books API
    const handleSubmit = (e: React.ChangeEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
    };

    //Layout för sökruta
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Sök efter bok..." value={query} onChange={(e) => setQuery(e.target.value)}/>
            <button type="submit">Sök</button>
        </form>
    )
}

export default SearchBar;