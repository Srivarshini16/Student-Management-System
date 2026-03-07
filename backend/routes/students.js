const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /students — Add a new student
router.post('/', async (req, res) => {
    try {
        const { name, rollNo, department } = req.body;

        // Validation
        if (!name || !rollNo || !department) {
            return res.status(400).json({ message: 'Name, Roll Number, and Department are all required' });
        }

        // Check for duplicate roll number
        const existing = await Student.findOne({ rollNo });
        if (existing) {
            return res.status(400).json({ message: 'Roll number already exists' });
        }

        const student = new Student({ name, rollNo, department });
        await student.save();

        res.status(201).json({ message: 'Student added successfully', student });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /students — Get all students or search/filter
router.get('/', async (req, res) => {
    try {
        const { search, department } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNo: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ];
        }

        if (department) {
            filter.department = { $regex: department, $options: 'i' };
        }

        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE /students/:id — Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;