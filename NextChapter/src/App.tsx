import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookPage from "./pages/BookPage";

function App() {
  return (

    //Routes för mina pages
    <BrowserRouter>
      <Routes>

        <Route path="/" element={< Home />} />
        <Route path="/login" element={< Login />} />
        <Route path="/register" element={< Register />} />
        <Route path="/profile" element={< Profile />} />
        <Route path="/book/:bookId" element={< BookPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;