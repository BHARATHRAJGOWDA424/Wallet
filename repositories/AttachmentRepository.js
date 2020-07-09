const AttachmentModel = require('../schemas/AttachmentModel');
const BaseRepository = require('./BaseRepository');

module.exports = class AttachmentRepository extends BaseRepository {

    constructor() {
        super();
    }

    model() {
        return AttachmentModel
    }

    async addProfilePic(files, user) {
        if (files != undefined) {
            let file = files[0]
            if (file != undefined) {
                file.user = user._id
                file.type = 0
                let avatar = await this.add(file)
                user.avatar = avatar._id
                user = await user.save()
                return user
            }
        }
    }
}