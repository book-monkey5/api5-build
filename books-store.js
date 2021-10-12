"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const book_factory_1 = require("./model/book-factory");
const some_books_1 = require("./model/some-books");
class BooksStore {
    constructor() {
        this.booksCache = [];
        this.isSecure = false;
        this.securePrefix = '[SECURE] ';
        this.populateCache();
    }
    get books() {
        let books = this.onlyPublicBooks(this.booksCache);
        if (this.isSecure) {
            books = [...this.onlySecureBooks(this.booksCache), ...books];
        }
        return this.removeSecureInfo(books);
    }
    sortBooks(books) {
        return _(books).sortBy(b => b.title).value();
    }
    addSecureTitle(books) {
        return books.map(book => {
            const title = book.secure ? this.securePrefix + book.title : book.title;
            return Object.assign(Object.assign({}, book), { title });
        });
    }
    removeSecureInfo(books) {
        return books.map(book => {
            const { secure } = book, rest = __rest(book, ["secure"]);
            return rest;
        });
    }
    onlyPublicBooks(books) {
        return this.sortBooks(books.filter(book => !book.secure));
    }
    onlySecureBooks(books) {
        return this.addSecureTitle(this.sortBooks(books.filter(book => book.secure)));
    }
    setSecure(isSecure = false) {
        this.isSecure = isSecure;
    }
    getAll() {
        return this.books;
    }
    ;
    getAllBySearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        const containsSearchTerm = (checked) => ~checked.toLowerCase().indexOf(searchTerm);
        return this.books
            .filter(b => !!(containsSearchTerm(b.isbn) ||
            containsSearchTerm(b.title) ||
            _.some(b.authors, containsSearchTerm) ||
            containsSearchTerm(b.published) ||
            containsSearchTerm(b.subtitle) ||
            containsSearchTerm(b.description)));
    }
    ;
    getByIsbn(isbn) {
        isbn = book_factory_1.BookFactory.normalizeIsbn(isbn);
        return this.books.find(book => book.isbn === isbn);
    }
    ;
    findByAuthorName(author) {
        return this.books.filter(b => b.authors.includes(author));
    }
    getAllAuthors() {
        return _(this.books)
            .flatMap(b => b.authors)
            .uniq()
            .value();
    }
    isbnExists(isbn) {
        const book = this.booksCache.find(book => book.isbn === isbn);
        return !!book;
    }
    create(book) {
        const newBook = Object.assign(Object.assign({}, book), { title: this.stripSecurePrefix(book.title), secure: this.isSecure });
        this.booksCache = [...this.booksCache, newBook];
    }
    ;
    update(book) {
        const oldBook = this.booksCache.find(b => b.isbn === book.isbn);
        const newBook = Object.assign(Object.assign({}, book), { title: this.stripSecurePrefix(book.title), secure: oldBook.secure });
        this.booksCache = this.booksCache.map(b => (b.isbn === book.isbn) ? newBook : b);
    }
    ;
    delete(isbn) {
        isbn = book_factory_1.BookFactory.normalizeIsbn(isbn);
        this.booksCache = this.booksCache.filter(book => book.isbn !== isbn);
    }
    ;
    populateCache() {
        this.booksCache = some_books_1.SomeBooks.getAll();
    }
    stripSecurePrefix(title) {
        if (title.startsWith(this.securePrefix)) {
            return title.substr(this.securePrefix.length);
        }
        else {
            return title;
        }
    }
    reset() {
        this.populateCache();
    }
    ;
}
exports.BooksStore = BooksStore;
//# sourceMappingURL=books-store.js.map