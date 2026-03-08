const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /students — Add a new student
router.post('/', async (req, res) => {
    try {
        const { name, rollNo, email, department } = req.body;

        // Validation
        if (!name || !rollNo || !email || !department) {
            return res.status(400).json({ message: 'Name, Roll Number, Email, and Department are all required' });
        }

        // Check for duplicate roll number or email
        const existingRollNo = await Student.findOne({ rollNo });
        if (existingRollNo) {
            return res.status(400).json({ message: 'Roll number already exists' });
        }

        const existingEmail = await Student.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address already exists' });
        }

        const student = new Student({ name, rollNo, email: email.toLowerCase(), department });
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
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { name: { $regex: safeSearch, $options: 'i' } },
                { rollNo: { $regex: safeSearch, $options: 'i' } },
                { department: { $regex: safeSearch, $options: 'i' } }
            ];
        }


        if (department) {
            const safeDept = department.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.department = { $regex: safeDept, $options: 'i' };
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

// PUT /students/:id — Update student
router.put('/:id', async (req, res) => {
    try {
        const { name, rollNo, email, department } = req.body;

        if (!name || !rollNo || !email || !department) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if roll number or email is changed and if it exists for another student
        const existingRollNo = await Student.findOne({ rollNo, _id: { $ne: req.params.id } });
        if (existingRollNo) {
            return res.status(400).json({ message: 'Roll number already exists' });
        }

        const existingEmail = await Student.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address already exists' });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name, rollNo, email: email.toLowerCase(), department },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;