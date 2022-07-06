"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const web_push_1 = require("web-push");
class NotificationService {
    constructor() {
        this.subscriptions = [];
        this.subscriptionOriginMap = new Map();
        const vapidKeys = {
            publicKey: 'BGk2Rx3DEjXdRv9qP8aKrypFoNjISAZ54l-3V05xpPOV-5ZQJvVH9OB9Rz5Ug7H_qH6CEr40f4Pi3DpjzYLbfCA',
            privateKey: 'D-k70ba0x5ucasrJMfsROWq8Xtt2smbzh98mbXTfhQM'
        };
        web_push_1.setVapidDetails('mailto:team@angular-buch.com', vapidKeys.publicKey, vapidKeys.privateKey);
    }
    addSubscription(subscription, origin) {
        this.subscriptions.push(subscription);
        this.subscriptions = _.uniq(this.subscriptions);
        this.subscriptionOriginMap.set(subscription.endpoint, origin);
    }
    hasSubscriber() {
        return this.subscriptions.length > 0;
    }
    notifySubscribers(payload) {
        this.subscriptions.forEach(sub => {
            var _a;
            const origin = this.subscriptionOriginMap.get(sub.endpoint);
            const notificationPayload = Object.assign({}, payload);
            if ((_a = payload.data) === null || _a === void 0 ? void 0 : _a.book) {
                notificationPayload.data = {
                    book: payload.data.book,
                    onActionClick: {
                        default: {
                            operation: 'openWindow',
                            url: `${origin}/books/${payload.data.book.isbn}`
                        }
                    }
                };
            }
            this.notify(notificationPayload, sub);
        });
    }
    notify(notification, subscription) {
        web_push_1.sendNotification(subscription, JSON.stringify({ notification }))
            .catch((error) => console.error(error));
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification-service.js.map