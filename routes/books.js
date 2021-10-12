"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const book_factory_1 = require("../model/book-factory");
class BooksRoute {
    constructor(store, notificationService) {
        this.store = store;
        this.notificationService = notificationService;
    }
    static create(router, bookStore, notificationService) {
        const booksRoute = new BooksRoute(bookStore, notificationService);
        const methodsToBind = [
            'getAll', 'getAllBySearch', 'reset', 'create',
            'getByISBN', 'checkISBN', 'update', 'delete'
        ];
        _.bindAll(booksRoute, methodsToBind);
        router.get('/', booksRoute.getAll);
        router.get('/search/:search', booksRoute.getAllBySearch);
        router.delete('/', booksRoute.reset);
        router.post('/', booksRoute.create);
        router.get('/:isbn', booksRoute.getByISBN);
        router.get('/:isbn/check', booksRoute.checkISBN);
        router.put('/:isbn', booksRoute.update);
        router.delete('/:isbn', booksRoute.delete);
    }
    getAll(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        res.json(this.store.getAll());
        next();
    }
    ;
    getAllBySearch(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const searchTerm = req.params.search;
        res.json(this.store.getAllBySearch(searchTerm));
        next();
    }
    ;
    getByISBN(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const isbn = req.params.isbn;
        const book = this.store.getByIsbn(isbn);
        if (!book) {
            return res.status(404).send('Book does not exist');
        }
        res.json(book);
        next();
    }
    ;
    checkISBN(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const isbn = req.params.isbn;
        const bookExist = this.store.isbnExists(isbn);
        res.json(bookExist);
        next();
    }
    ;
    create(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const bookJson = req.body;
        const isbn = bookJson.isbn;
        if (!isbn) {
            return res.status(400).send('Invalid data: ISBN number is mandatory');
        }
        if (this.store.isbnExists(isbn)) {
            return res.status(409).send('Book does already exist');
        }
        const book = book_factory_1.BookFactory.fromJson(bookJson);
        this.store.create(book);
        res.status(201).json(book);
        if (this.notificationService.hasSubscriber()) {
            const notificationPayload = {
                title: `🆕📕 ${book.title}`,
                body: `ISBN: ${book.isbn}`,
                icon: book.thumbnailUrl || book_factory_1.PLACEHOLDER_IMG_URL,
                vibrate: [100, 50, 100],
                data: { url: `${req.headers.origin}/books/${book.isbn}` }
            };
            this.notificationService.notifySubscribers(notificationPayload);
        }
        next();
    }
    ;
    update(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const bookJson = req.body;
        const isbn = bookJson.isbn;
        if (!isbn) {
            return res.status(400).send('Invalid data: ISBN number is mandatory');
        }
        if (req.params.isbn != isbn) {
            return res.status(400).send('Invalid data: ISBN from query and body must match');
        }
        if (!this.store.isbnExists(isbn)) {
            return res.status(404).send('Book does not exist');
        }
        const book = book_factory_1.BookFactory.fromJson(bookJson);
        this.store.update(book);
        res.status(200).json(book);
        next();
    }
    ;
    delete(req, res, next) {
        this.store.setSecure(res.locals.authorized);
        const isbn = req.params.isbn;
        this.store.delete(isbn);
        res.send(200);
        next();
    }
    ;
    reset(req, res, next) {
        this.store.reset();
        if (res && next) {
            res.send(200);
            next();
        }
    }
    ;
}
exports.BooksRoute = BooksRoute;
//# sourceMappingURL=books.js.map