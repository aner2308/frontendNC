import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Sök efter bok..." value={query} onChange={(e) => setQuery(e.target.value)}/>
            <button type="submit">Sök</button>
        </form>
    )
}

export default SearchBar;