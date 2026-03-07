const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance
router.post('/', async (req, res) => {
    try {
        const { studentEmail, status } = req.body;
        const record = new Attendance({ studentEmail, status });
        await record.save();
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get attendance report (for admin)
router.get('/report', async (req, res) => {
    try {
        const report = await Attendance.find().sort({ date: -1 });
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get student attendance by email
router.get('/student/:email', async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentEmail: req.params.email }).sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
