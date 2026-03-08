import { useParams } from "react-router-dom";

const BookPage = () => {

  const { bookId } = useParams();

  return (
    <div>
      <h1>Boksidan</h1>
      <p>Bokens ID: {bookId}</p>
    </div>
  );
};

export default BookPage;