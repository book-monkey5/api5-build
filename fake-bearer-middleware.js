"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fakeBearerMiddleware(req, res, next) {
    const authToken = '1234567890';
    if (req.headers.authorization === `Bearer ${authToken}`) {
        res.locals.authorized = true;
    }
    else {
        res.locals.authorized = false;
    }
    next();
}
exports.fakeBearerMiddleware = fakeBearerMiddleware;
;
//# sourceMappingURL=fake-bearer-middleware.js.map