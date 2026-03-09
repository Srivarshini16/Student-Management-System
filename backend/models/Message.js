const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    fromEmail: {
        type: String,
        required: true,
        trim: true
    },
    fromName: {
        type: String,
        required: true,
        trim: true
    },
    fromPicture: {
        type: String,
        default: ''
    },
    toEmail: {
        type: String,
        trim: true,
        default: 'all' // 'all' means announcement
    },
    message: {
        type: String,
        trim: true,
        default: ''
    },
    fileUrl: {
        type: String,
        default: null
    },
    fileName: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['private', 'announcement'],
        default: 'private'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);