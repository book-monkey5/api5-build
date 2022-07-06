"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class NotificationsRoute {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    static create(router, notificationService) {
        const notificationsRoute = new NotificationsRoute(notificationService);
        const methodsToBind = ['requestSubscription'];
        _.bindAll(notificationsRoute, methodsToBind);
        router.post('/', notificationsRoute.requestSubscription);
    }
    requestSubscription(req, res, next) {
        const notificationRequest = req.body;
        if (!notificationRequest) {
            return res.status(400).send('Invalid data: Notification Object is mandatory');
        }
        if (!notificationRequest.endpoint
            || !notificationRequest.keys
            || !notificationRequest.keys.auth
            || !notificationRequest.keys.p256dh) {
            return res.status(422).send('Malformed Notification Object');
        }
        this.notificationService.addSubscription(notificationRequest, req.headers.referer);
        res.status(200).send({ message: 'successfully subscribed' });
        const notificationPayload = {
            title: '🐵 Push Notifications activated ✉️',
            body: 'You will be notified of new books',
            vibrate: [50, 50]
        };
        this.notificationService.notify(notificationPayload, notificationRequest);
        next();
    }
    ;
}
exports.NotificationsRoute = NotificationsRoute;
//# sourceMappingURL=notifications.js.map