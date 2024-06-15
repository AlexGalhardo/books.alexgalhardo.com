import { useCallback, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import ErrorAlertMessage from "../Components/Alerts/ErrorAlertMessage";
import ReactPaginate from "react-paginate";
import BooksRepository, { Book } from "../Repositories/Books.repository";
import Head from "../Components/Head";
import BookFound from "../Components/BookFound";
import { iterateFromIndex } from "../Utils/Functions";
import { TOTAL_BOOKS_PER_PAGE } from "../Utils/Envs";
import ProgressBar from "../Components/ProgressBar";
export default function RandomBook() {
    const [error, setError] = useState<string | null>();
    const [book, setBook] = useState<Book | null>(null);
    const [books, setBooks] = useState<Book[] | null>(null);
    const [foundMoreThanOne, setFoundMoreThanOne] = useState<boolean>(false);
    const [totalBooksFound, setTotalBooksFound] = useState<number | null>(null);
    const [paginationBooks, setPaginationBooks] = useState<Book[]>();
    const [pageCount, setPageCount] = useState(0);
    const [pageOffset, setPageOffset] = useState(0);
    const [bookTitleSearched, setBookTitleSearched] = useState("");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const recommendRandomBook = useCallback(async () => {
        setError("");
        const randomBook = new BooksRepository().getRandom();

        setBook({
            ...randomBook,
        });
        setPageCount(0);
    }, []);

    const searchBookByTitle = useCallback(async (bookTitle: string | null) => {
        if (bookTitle) {
            const searchBookTitle = new BooksRepository().searchAllBooksSimilarTitle(bookTitle);
            const randomBook = new BooksRepository().getRandom();

            if (!searchBookTitle.length) {
                setBookTitleSearched(bookTitle);
                setError(`Nothing Found for Search: ${bookTitle}... Recommending random book`);
                setTotalBooksFound(null);
                setBooks(null);
                setPageCount(0);
                setFoundMoreThanOne(false);

                setBook({
                    ...randomBook,
                });
            }

            if (searchBookTitle.length > 1) {
                setError("");
                setFoundMoreThanOne(true);
                setTotalBooksFound(searchBookTitle.length);
                setBooks(searchBookTitle);
                setPageCount(Math.ceil((books?.length as number) / TOTAL_BOOKS_PER_PAGE));
            } else if (searchBookTitle.length === 1) {
                setError("");
                setBooks(null);
                setFoundMoreThanOne(false);
                setPageCount(0);
                setBook({
                    ...searchBookTitle[0],
                });
            }
        }
    }, []);

    useEffect(() => {
        if (queryParams.get("search")) {
            const search = queryParams.get("search");
            searchBookByTitle(search);
        } else {
            recommendRandomBook();
        }
    }, [queryParams.get("search")]);

    useEffect(() => {
        if (books?.length) {
            setPaginationBooks(iterateFromIndex(books, 0));
            setPageCount(Math.ceil(books?.length / TOTAL_BOOKS_PER_PAGE));
            setPageOffset(0);
        }
    }, [books]);

    useEffect(() => {
        if (book) {
            setBooks(null);
            setFoundMoreThanOne(false);
            setPageCount(0);
            setTotalBooksFound(0);
        }
    }, [book]);

    const handlePageChange = (event: any) => {
        setPaginationBooks(iterateFromIndex(books!, event.selected));
        setPageCount(Math.ceil((books?.length as number) / TOTAL_BOOKS_PER_PAGE));
        setPageOffset(event.selected);
    };

    return (
        <>
            <Head
                title="books.alexgalhardo.com"
                description="Software Engineering books recomendation."
            />
			<ProgressBar />
            <Navbar />
            <div className="container col-lg-9" style={{ marginTop: "100px" }}>
                <div className="row mt-5">
                    {/* {error && <ErrorAlertMessage message={error} />} */}

                    {error && (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Not Found: <strong className="text-danger">{bookTitleSearched}</strong>{" "}
                            </span>
                            <span className="text-info">Recommending Random Book...</span>
                        </p>
                    )}

                    {totalBooksFound !== 0 ? (
                        <p className="fs-3 mb-5 alert alert-light d-flex justify-content-between">
                            <span>
                                Searching: <strong className="text-success">{queryParams.get("search")}</strong>
                            </span>
                            <span>
                                Found:{" "}
                                <strong className="text-danger">
                                    {" "}
                                    {totalBooksFound} {totalBooksFound! > 1 ? "Books" : "Book"}
                                </strong>
                            </span>
                        </p>
                    ) : null}

                    {totalBooksFound && totalBooksFound > TOTAL_BOOKS_PER_PAGE ? (
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
                    ) : null}

                    {!foundMoreThanOne ? (
                        <BookFound book={book} buttonRecommend={true} recommendRandomBook={recommendRandomBook} />
                    ) : null}

                    {foundMoreThanOne &&
                        books &&
                        totalBooksFound &&
                        paginationBooks?.map((book: Book) => <BookFound book={book} />)}

                    {totalBooksFound && totalBooksFound > TOTAL_BOOKS_PER_PAGE ? (
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
                    ) : null}
                </div>
            </div>
        </>
    );
}
