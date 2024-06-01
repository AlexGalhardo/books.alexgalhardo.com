import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./Components/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Style.css";
import Publisher from "./Pages/Publisher";
import RandomBook from "./Pages/RandomBook";
import Book from "./Pages/Book";
import Author from "./Pages/Author";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RandomBook />} />
                <Route path="/books/*" element={<RandomBook />} />
                <Route path="/author/:author_name" element={<Author />} />
                <Route path="/publisher/:publisher_name" element={<Publisher />} />
                <Route path="/book/:book_title_slug" element={<Book />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
