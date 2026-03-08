const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present'
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
