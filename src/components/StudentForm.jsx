import { useState } from "react";
import { addStudent } from "../api";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

export default function StudentForm({ onStudentAdded }) {
    const [form, setForm] = useState({ name: "", rollNo: "", department: "" });
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleSubmit = async () => {
        const { name, rollNo, department } = form;

        if (!name || !rollNo || !department) {
            showMessage("All fields are required", "error");
            return;
        }

        try {
            await addStudent(form);
            showMessage("Student added successfully!", "success");
            setForm({ name: "", rollNo: "", department: "" });
            onStudentAdded();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to add student";
            showMessage(msg, "error");
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Add New Student</h2>

            {message.text && (
                <div style={message.type === "success" ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            <div style={styles.row}>
                <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    style={styles.input}
                    type="text"
                    name="rollNo"
                    placeholder="Roll Number"
                    value={form.rollNo}
                    onChange={handleChange}
                />
                <select
                    style={styles.input}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <button style={styles.btn} onClick={handleSubmit}>
                    Add Student
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: "white", padding: "20px", borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)", marginBottom: "24px"
    },
    title: { marginBottom: "16px", color: "#444", fontSize: "18px" },
    row: { display: "flex", gap: "12px", flexWrap: "wrap" },
    input: {
        flex: 1, padding: "10px", border: "1px solid #ccc",
        borderRadius: "6px", fontSize: "14px", minWidth: "150px"
    },
    btn: {
        padding: "10px 24px", background: "#4CAF50", color: "white",
        border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
    },
    success: {
        padding: "10px", borderRadius: "6px", marginBottom: "12px",
        background: "#d4edda", color: "#155724", fontSize: "14px"
    },
    error: {
        padding: "10px", borderRadius: "6px", marginBottom: "12px",
        background: "#f8d7da", color: "#721c24", fontSize: "14px"
    }
};