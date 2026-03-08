const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    rollNo: {
        type: String,
        required: [true, 'Roll number is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

// This is the exact schema from the problem statement. `unique: true` on `rollNo` handles duplicate prevention at the database level.


