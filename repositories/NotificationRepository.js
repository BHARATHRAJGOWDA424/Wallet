// const NotificationModel = require('../schema/NotificationModel');
const BaseRepository = require('./BaseRepository');

module.exports = class NotificationsRepository extends BaseRepository {

    constructor() {
        super();
    }

    model() {
        // return NotificationModel
    }

    async findByPagination(user, pageIndex, pageSize) {

        let query = { user: user }
        return super.findByPagination(query, pageIndex, pageSize, null, null, { createdAt: -1 });

    }

    async findUnreadCount(user) {

        let query = { user: user, isRead: false }
        return this.count(query);

    }
}