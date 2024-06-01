<div align="center">
 	<h1 align="center"><a href="https://books.alexgalhardo.com" target="_blank">books.alexgalhardo.com</a></h1>
</div>

## Introduction

- A simple catalog of books to learn more about technology and software engineering.

## Web Scrapping

- Source Code: <https://github.com/AlexGalhardo/web-scraping-books-amazon>

## Local Development Setup

1. Clone this repository
```bash
git clone git@github.com:AlexGalhardo/books.alexgalhardo.com.git
```

2. Enter repository
```bash
cd books.alexgalhardo.com/
```

3. Run setup.sh
```bash
chmod +x setup.sh && ./setup.sh
```

## Build for deploy
a. Create build
```bash
bun run build
```

b. Preview production build
```bash
bun run preview
```

c. Open production build local server (build + preview)
```bash
bun run start
```

## Start web scrapping get books from amazon.com
```bash
bun run get:books
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) January 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
