import { TOTAL_BOOKS_PER_PAGE } from "./Envs";
import { Book } from "../Repositories/Books.repository";
import { CSSProperties } from "react";

export function iterateFromIndex(books: Book[], pageOffset: number): Book[] {
    const newOffset = (pageOffset * TOTAL_BOOKS_PER_PAGE) % books.length;
    const arrayFromOffeset: Book[] = [];
    for (let i = newOffset; i < Number(newOffset + TOTAL_BOOKS_PER_PAGE); i++) {
        if (books[i]) arrayFromOffeset.push(books[i]);
        if (!books[i]) break;
    }

    return arrayFromOffeset;
}

export const amazonButton: CSSProperties = {
    border: "none",
    textDecoration: "none",
};
