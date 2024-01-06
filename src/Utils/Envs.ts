export const API_URL =
    import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_API_URL_DEV
        : import.meta.env.VITE_API_URL_PROD;

export const APP_URL =
    import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_APP_URL_DEV
        : import.meta.env.VITE_APP_URL_PROD;

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "Books API";

export const TOTAL_BOOKS_PER_PAGE = Number(import.meta.env.VITE_TOTAL_BOOKS_PER_PAGE) ?? 5;
