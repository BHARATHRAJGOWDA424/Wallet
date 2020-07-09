const mongoose = require('mongoose');
const AttachmentType = require('../domain/enumerations/AttachmentType');
const Attachment = require('../domain/entities/Attachment');

const AttachmentSchema = mongoose.Schema({
    originalname: String,
    mimetype: String,
    etag: String,
    contentType: String,
    key: String,
    type: {
        type: Number,
        enum: [
            AttachmentType.Avatar,
        ],
    },
    resized: [{
        etag: String,
        contentType: String,
        key: String,
        id: String
    }],
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

AttachmentSchema.loadClass(Attachment);

module.exports = mongoose.model('Attachment', AttachmentSchema);
