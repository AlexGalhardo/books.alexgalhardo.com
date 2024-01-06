import { useCallback, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import BooksRepository, { Book } from "../Repositories/Books.repository";
import Head from "../Components/Head";
import BookFound from "../Components/BookFound";
import { container } from "../Utils/Functions";

export default function BookPage() {
    const { book_title_slug } = useParams();
    const pageDescription = `See information about ${book_title_slug}`;
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>();
    const searchGameByTitle = useCallback(async (bookTitleSlug: string) => {
        const bookFound = new BooksRepository().getByTitleSlug(bookTitleSlug);
        if (!bookFound) {
            setBook(null);
            navigate("/");
        }

        setBook(bookFound);
    }, []);

    useEffect(() => {
        if (book_title_slug) {
            searchGameByTitle(book_title_slug);
        } else {
            navigate("/");
        }
    }, [book_title_slug]);

    return (
        <>
            <Head title={book?.title} description={pageDescription} />
            <Navbar />
            <div className="container " style={container}>
                <div className="row mt-5">
                    <BookFound book={book} />
                </div>
            </div>
        </>
    );
}
