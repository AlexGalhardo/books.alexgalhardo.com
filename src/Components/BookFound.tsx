import { CSSProperties } from "react";
import { Book } from "../Repositories/Books.repository";

const amazonButton: CSSProperties = {
    border: "none",
    textDecoration: "none",
};

export default function BookFound({
    book,
    buttonRecommend,
    recommendRandomBook,
}: {
    book: Book | null | undefined;
    buttonRecommend?: boolean;
    recommendRandomBook?: any;
}) {
    return (
        <>
            <div className="col-lg-3 text-center">
                <img
                    id="game_image"
                    src={book?.cover_image}
                    className="shadow mx-auto d-block w-100 image-fluid mb-3"
                    alt="game_image"
                />
                {buttonRecommend && (
                    <button
                        className="button mt-3 w-80 btn mb-5 btn-success fw-bold fs-5"
                        onClick={recommendRandomBook}
                    >
                        <i className="bi bi-play-fill"></i>
                        Recommend Random Book
                    </button>
                )}
            </div>

            <div className="col-lg-6">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <a className="fs-2 text-decoration-none" href={`/book/${book?.slug}`}>
                            <span className="fw-bold">{book?.title} </span>
                        </a>

                        <p className="fs-2 fw-bold text-warning text-decoration-none">
                            ⭐<span id="game_igdb_rating">{book?.rating.score}</span>
                        </p>
                    </div>

                    <p>{book?.summary}</p>
                </div>
            </div>

            <div className="col-lg-3 mb-3">
                <div className="text-center">
                    <a target="_blank" href={book?.link_amazon} rel="noopener noreferrer" style={amazonButton}>
                        <img src="https://www.niftybuttons.com/amazon/amazon-button2.png" />
                    </a>
                </div>

                <ul className="mt-3">
                    <li className="">
                        <b>Author:</b>
                        <ul>
                            <li>
                                <a href={`/author/${book?.author?.slug}`}>{book?.author?.name}</a>
                            </li>
                        </ul>
                    </li>
                    {book?.publisher?.name && (
                        <li className="">
                            <b>Publisher:</b>
                            <ul>
                                <li>
                                    <a href={`/publisher/${book?.publisher?.slug}`}>{book?.publisher?.name}</a>
                                </li>
                            </ul>
                        </li>
                    )}
                    <li className="">
                        <b>Total Customer Reviews:</b>
                        <ul>
                            <li>
                                <a target="_blank" href={`${book?.customer_reviews_link}`}>
                                    {book?.rating.total_customer_reviews}
                                </a>
                            </li>
                        </ul>
                    </li>
                    {book?.total_pages && (
                        <li className="">
                            <b>Total Pages:</b>
                            <ul>
                                <li>{book?.total_pages.replace("páginas", "")}</li>
                            </ul>
                        </li>
                    )}
                    <li className="">
                        <b>Release Date:</b>
                        <ul>
                            <li>{book?.release_date}</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <span className="mt-5" />
        </>
    );
}
