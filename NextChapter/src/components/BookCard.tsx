import "./BookCard.css";

interface BookCardProps {
    title: string;
    author: string;
    status?: string;
    pagesRead?: number;
    cover?: string
}

const BookCard = ({ title, author, status, cover  }: BookCardProps) => {
    return (
        <div className="book-card">
            <img src={cover} alt={title} />
            <h4>{title}</h4>
            <p>{author}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default BookCard;