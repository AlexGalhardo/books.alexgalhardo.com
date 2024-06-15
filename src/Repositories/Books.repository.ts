import * as stringSimilarity from "string-similarity";

import booksDatabase from "./Jsons/books.json";

export interface Author {
	id: string;
	name?: string;
	slug: string;
}

export interface Publisher {
	id: string;
	name?: string;
	slug: string;
}

export interface Categorie {
	id: string;
	name: string;
	slug: string;
}

export interface Book {
	id: string;
	title: string;
	slug: string;
	cover_image?: string;
	link_amazon: string;
	customer_reviews_link: string;
	subtitle: string;
	release_date: string;
	rating: {
		score?: string | null;
		total_customer_reviews?: string;
	};
	total_pages?: string | null;
	author: Author;
	publisher: Publisher;
	summary: string;
	created_at: string;
	updated_at: string | null;
	created_at_pt_br: string;
	updated_at_pt_br: string | null;
}

export interface BooksRepositoryPort {
	getRandom(): Book;
	getById(bookId: string): Book;
	getByTitleSlug(bookTitle: string): Book;
	searchAllBooksSimilarTitle(bookTitle: string): Book[];
	getByAuthor(authorName: string): Book[];
	getByPublisher(publisherName: string): Book[];
}

export default class BooksRepository implements BooksRepositoryPort {
	constructor(private books: Book[] = booksDatabase) { }

	public getById(bookId: string): Book {
		return this.books.filter((book: Book) => book.id === bookId)[0];
	}

	public getRandom(): Book {
		return this.books[Math.floor(Math.random() * this.books.length)];
	}

	public getByTitleSlug(bookTitle: string): Book {
		return this.books.filter((book: Book) => book.slug.toLowerCase().includes(bookTitle.toLowerCase()))[0];
	}

	public searchAllBooksSimilarTitle(bookTitle: string): Book[] {
		const booksFound = this.books.filter((book: Book) =>
			book.title.toLowerCase().includes(bookTitle.toLowerCase()),
		);

		const matches = stringSimilarity.findBestMatch(
			bookTitle,
			this.books.map((book) => book.title),
		);

		matches.ratings.forEach((similarity) => {
			if (similarity.rating >= 0.5) {
				if (!booksFound.some((book) => book.title.toLowerCase() === similarity.target.toLowerCase())) {
					booksFound.push(this.books.filter((book) => book.title === similarity.target)[0]);
				}
			}
		});

		return booksFound;
	}

	public getByAuthor(authorName: string): Book[] {
		return this.books.filter((book: Book) => book.author?.slug.toLowerCase().includes(authorName.toLowerCase()));
	}

	public getByPublisher(publisherName: string): Book[] {
		return this.books.filter((book: Book) =>
			book?.publisher?.slug.toLowerCase().includes(publisherName.toLowerCase()),
		);
	}
}
