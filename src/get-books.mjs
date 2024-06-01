import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
import { randomUUID } from "crypto";
import slugify from "slugify";

const booksToFind = [
    "https://www.amazon.com/Grokking-Algorithms-Second-Aditya-Bhargava/dp/1633438538",
    "https://www.amazon.com/Introduction-Algorithms-fourth-Thomas-Cormen/dp/026204630X",
    "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
    "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119",
    "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF",
    "https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959",
    "https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164",
    "https://www.amazon.com/Communication-Engineers-developers-communicators-productivity-ebook/dp/B08W8MJNF8",
    "https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215",
    "https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850",
    "https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612",
    "https://www.amazon.com/Refactoring-Improving-Existing-Addison-Wesley-Signature/dp/0134757599",
    "https://www.amazon.com/Software-Engineering-Google-Lessons-Programming/dp/1492082791",
    "https://www.amazon.com/Staff-Engineer-Leadership-beyond-management/dp/1736417916",
    "https://www.amazon.com/Software-Engineers-Guidebook-Navigating-positions/dp/908338182X",
    "https://www.amazon.com/Staff-Engineers-Path-Individual-Contributors/dp/1098118731",
    "https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X",
    "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034",
    "https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/1942788290",
    "https://www.amazon.com/The-Unicorn-Project-Gene-Kim-audiobook/dp/B0812C82T9",
    "https://www.amazon.com/Computer-Programming-Volumes-1-4B-Boxed/dp/0137935102",
];

const books = [];
const authors = [];
const publishers = [];

function getNow() {
    const date = new Date().toLocaleDateString("pt-BR");
    const time = new Date().toLocaleTimeString("pt-BR");
    return `${date} ${time}`;
}

async function getBooksFromAmazon() {
    console.log("Starting books web scrapping from amazon.com ... ");

    const browser = await puppeteer.launch({
        headless: "new",
    });

    for (const urlAmazon of booksToFind) {
        const page = await browser.newPage();

        try {
            await page.goto(urlAmazon, { waitUntil: "domcontentloaded" }); // 'domcontentloaded', networkidle2,
            const content = await page.content();
            const $ = cheerio.load(content);

            $(
                'div#detailBullets_feature_div ul.detail-bullet-list li span.a-text-bold:contains("Ranking dos mais vendidos") + ul.zg_hrsr li span.a-list-item a',
            ).each(function () {
                categories.push({
                    id: randomUUID(),
                    name: $(this).text().trim(),
                    slug: slugify($(this).text().trim(), {
                        lower: true,
                        strict: true,
                    }),
                });
            });

            const elementAuthor =
                $('div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")')
                    .closest("span.author")
                    .find("a.a-link-normal")
                    .text()
                    .trim() !== ""
                    ? $(
                          'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor)")',
                      )
                          .closest("span.author")
                          .find("a.a-link-normal")
                          .text()
                          .trim()
                    : $(
                          'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Autor, Editor)")',
                      )
                          .closest("span.author")
                          .find("a.a-link-normal")
                          .text()
                          .trim();

            function getAuthor() {
                if (
                    $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim();
                else if (
                    $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author, Editor)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author, Editor)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim();
                else if (
                    $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author, Illustrator)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#bylineInfo span.author:not([style="display: none;"]) span.a-color-secondary:contains("(Author, Illustrator)")',
                    )
                        .closest("span.author")
                        .find("a.a-link-normal")
                        .text()
                        .trim();
            }

            const author = {
                id: randomUUID(),
                name: getAuthor(),
                slug: slugify(getAuthor() ?? elementAuthor, {
                    lower: true,
                    strict: true,
                }),
            };

            function getPublisher() {
                if ($("#rpi-attribute-book_details-publisher .rpi-attribute-value span").text().trim() !== null)
                    return $("#rpi-attribute-book_details-publisher .rpi-attribute-value span").text().trim();
                else if ($('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim() !== "")
                    return $('#detailBullets_feature_div .a-text-bold:contains("Editora")').next().text().trim();

                return null;
            }

            const publisher = {
                id: randomUUID(),
                name: getPublisher(),
                slug: slugify(getPublisher(), {
                    lower: true,
                    strict: true,
                }),
            };

            function getTotalPages() {
                if (
                    $(
                        'div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)',
                    )
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#detailBullets_feature_div li:contains("Número de páginas") span.a-list-item span:not(.a-text-bold)',
                    )
                        .text()
                        .trim();
                else if (
                    $('div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)')
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#detailBullets_feature_div li:contains("Capa comum") span.a-list-item span:not(.a-text-bold)',
                    )
                        .text()
                        .trim();
                else if (
                    $('div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)')
                        .text()
                        .trim() !== ""
                )
                    return $(
                        'div#detailBullets_feature_div li:contains("Capa dura") span.a-list-item span:not(.a-text-bold)',
                    )
                        .text()
                        .trim();
            }

            const bookFound = {
                id: randomUUID(),
                title: $("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle")
                    .text()
                    .trim(),
                slug: slugify(
                    $("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productTitle").text().trim(),
                    {
                        lower: true,
                        strict: true,
                    },
                ),
                cover_image: $("div#imgTagWrapperId img").attr("src"),
                link_amazon: urlAmazon,
                customer_reviews_link: `${urlAmazon}#customerReviews`,
                subtitle: $("div.a-section.a-spacing-none h1.a-spacing-none.a-text-normal span#productSubtitle")
                    .text()
                    .trim(),
                release_date: $("div#rpi-attribute-book_details-publication_date div.rpi-attribute-value")
                    .text()
                    .trim(),
                rating: {
                    score: $("span#acrPopover.reviewCountTextLinkedHistogram.noUnderline").attr("title")
                        ? $("span#acrPopover.reviewCountTextLinkedHistogram.noUnderline")
                              .attr("title")
                              .replace(" de 5 estrelas", "")
                              .replace(" out of 5 stars", "")
                        : null,
                    total_customer_reviews: $("a#acrCustomerReviewLink:first span#acrCustomerReviewText:first")
                        .text()
                        .replace("avaliações de clientes", "")
                        .replace("ratings", "")
                        .trim(),
                },
                total_pages: getTotalPages(),
                author,
                publisher,
                summary: $("#bookDescription_feature_div").text().trim(),
                created_at: new Date(),
                updated_at: null,
                created_at_pt_br: getNow(),
                updated_at_pt_br: null,
            };

            books.push(bookFound);
            if (!authors.some((item) => item.slug === author.slug)) {
                authors.push(author);
            }
            if (!publishers.some((item) => item.slug === publisher.slug)) {
                publishers.push(publisher);
            }
        } catch (error) {
            console.error(`Error processing ${urlAmazon}: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();

    const booksJSON = JSON.stringify(books, "utf-8", null, 4);
    const authorsJSON = JSON.stringify(authors, "utf-8", null, 4);
    const publishersJSON = JSON.stringify(publishers, "utf-8", null, 4);

    fs.writeFileSync("./src/Repositories/Jsons/books.json", booksJSON, "utf-8", 4);
    fs.writeFileSync("./src/Repositories/Jsons/authors.json", authorsJSON, "utf-8", 4);
    fs.writeFileSync("./src/Repositories/Jsons/publishers.json", publishersJSON, "utf-8", 4);

    console.log("...Finished web scrapping books from amazon.com!");
}

getBooksFromAmazon();
