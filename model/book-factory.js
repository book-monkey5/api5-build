"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
exports.PLACEHOLDER_IMG_URL = 'https://api5.angular-buch.com/images/placeholder_book.svg';
class BookFactory {
    static empty() {
        return {
            isbn: '',
            title: '',
            authors: [''],
            published: new Date().toISOString(),
            subtitle: '',
            rating: 3,
            thumbnailUrl: exports.PLACEHOLDER_IMG_URL,
            description: ''
        };
    }
    static fromJson(json) {
        const book = BookFactory.empty();
        if (this.validString(json.isbn)) {
            book.isbn = BookFactory.normalizeIsbn(json.isbn);
        }
        if (this.validString(json.title)) {
            book.title = json.title.trim();
        }
        if (this.validArray(json.authors)) {
            let authors = [];
            for (let author of json.authors) {
                if (this.validString(author)) {
                    authors.push(author.trim());
                }
            }
            if (authors.length) {
                book.authors = authors;
            }
        }
        if (this.validString(json.published) &&
            this.validDate(json.published)) {
            book.published = BookFactory.normalizeDate(json.published);
        }
        if (this.validString(json.subtitle)) {
            book.subtitle = json.subtitle.trim();
        }
        if (this.validNumber(json.rating)) {
            book.rating = BookFactory.normalizeRating(json.rating);
        }
        if (this.validString(json.thumbnailUrl)) {
            book.thumbnailUrl = json.thumbnailUrl;
        }
        if (this.validString(json.description)) {
            book.description = json.description.trim();
        }
        return book;
    }
    static normalizeIsbn(isbn) {
        let i = isbn + '';
        return i.replace(/[^0-9]/g, '');
    }
    static normalizeRating(rating) {
        let r = +rating;
        return (r < 0) ? 0 : (r > 5) ? 5 : r;
    }
    static normalizeDate(date) {
        const d = new Date(date);
        return date_fns_1.format(d, 'yyyy-MM-dd');
    }
    static validString(str) {
        return str === '' || (str && typeof str == 'string');
    }
    static validDate(date) {
        return (new Date(date)).toString() != 'Invalid Date';
    }
    static validArray(arr) {
        return arr && Array.isArray(arr) && arr.length;
    }
    static validObject(obj) {
        return obj && typeof obj == 'object';
    }
    static validNumber(no) {
        return no && typeof no == 'number';
    }
}
exports.BookFactory = BookFactory;
console.log(BookFactory.normalizeDate('2021-10-01'));
//# sourceMappingURL=book-factory.js.map