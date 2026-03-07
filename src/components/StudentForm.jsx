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
        background: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        marginBottom: "32px",
        border: "1px solid #f1f5f9"
    },
    title: {
        marginBottom: "20px",
        color: "#0f172a",
        fontSize: "20px",
        fontWeight: "700"
    },
    row: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap"
    },
    input: {
        flex: 1,
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        fontSize: "14px",
        minWidth: "200px",
        backgroundColor: "#f8fafc",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none"
    },
    btn: {
        padding: "12px 28px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
        transition: "transform 0.1s, background-color 0.2s"
    },
    success: {
        padding: "12px 16px",
        borderRadius: "10px",
        marginBottom: "20px",
        background: "#f0fdf4",
        color: "#166534",
        fontSize: "14px",
        fontWeight: "500",
        border: "1px solid #dcfce7"
    },
    error: {
        padding: "12px 16px",
        borderRadius: "10px",
        marginBottom: "20px",
        background: "#fef2f2",
        color: "#991b1b",
        fontSize: "14px",
        fontWeight: "500",
        border: "1px solid #fee2e2"
    }
};
