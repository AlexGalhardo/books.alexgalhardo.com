import Navbar from "../Components/Navbar";
import Head from "../Components/Head";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BooksRepository, { Book } from "../Repositories/Books.repository";
import BookFound from "../Components/BookFound";
import authorsJson from "../Repositories/Jsons/authors.json";
import ReactPaginate from "react-paginate";
import { TOTAL_BOOKS_PER_PAGE } from "../Utils/Envs";
import { iterateFromIndex } from "../Utils/Functions";

export default function Developer() {
    const { author_name } = useParams();
    const authorName = authorsJson.filter((author) => author.slug === author_name)[0].name;
    const pageTitle = `${authorName} Books`;
    const pageDescription = `See books made by author ${author_name}`;
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[] | null>(null);
    const [totalBooksFound, setTotalBooksFound] = useState<number | null>(null);
    const [paginationBooks, setPaginationBooks] = useState<Book[]>();
    const [pageCount, setPageCount] = useState(0);
    const [pageOffset, setPageOffset] = useState(0);

    const searchDeveloperGames = useCallback(async (authorName: string) => {
        const booksFound = new BooksRepository().getByAuthor(authorName);
        if (!booksFound.length) navigate("/");

        setTotalBooksFound(booksFound.length);
        setBooks(booksFound);
    }, []);

    useEffect(() => {
        if (author_name) {
            searchDeveloperGames(author_name);
        } else {
            navigate("/");
        }
    }, [author_name]);

    useEffect(() => {
        if (books?.length) {
            setPaginationBooks(iterateFromIndex(books!, 0));
            setPageCount(Math.ceil(books.length / TOTAL_BOOKS_PER_PAGE));
            setPageOffset(0);
        }
    }, [books]);

    const handlePageChange = (event: any) => {
        setPaginationBooks(iterateFromIndex(books!, event.selected));
        setPageCount(Math.ceil((books?.length as number) / TOTAL_BOOKS_PER_PAGE));
        setPageOffset(event.selected);
    };

    return (
        <>
            <Head title={pageTitle} description={pageDescription} />
            <Navbar />
            <div className="container" style={{ marginTop: "100px" }}>
                <div className="row mt-5">
                    {totalBooksFound && (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Author: <strong className="text-success">{authorName}</strong>{" "}
                            </span>
                            <span>
                                Found:{" "}
                                <strong className="text-danger">
                                    {totalBooksFound} {totalBooksFound > 1 ? "Books" : "Book"}
                                </strong>
                            </span>
                        </p>
                    )}

                    {totalBooksFound && totalBooksFound > TOTAL_BOOKS_PER_PAGE && (
                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            pageCount={pageCount}
                            pageRangeDisplayed={TOTAL_BOOKS_PER_PAGE}
                            onPageChange={handlePageChange}
                            containerClassName="pagination"
                            activeClassName="active"
                            className="pagination justify-content-center mb-5"
                            forcePage={pageOffset}
                        />
                    )}

                    {paginationBooks?.map((book) => <BookFound book={book} />)}

                    {totalBooksFound && totalBooksFound > TOTAL_BOOKS_PER_PAGE && (
                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            pageCount={pageCount}
                            pageRangeDisplayed={TOTAL_BOOKS_PER_PAGE}
                            onPageChange={handlePageChange}
                            containerClassName="pagination"
                            activeClassName="active"
                            className="pagination justify-content-center mb-5"
                            forcePage={pageOffset}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
