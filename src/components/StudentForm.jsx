import { useState, useEffect } from "react";
import { addStudent, updateStudent } from "../api";

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

export default function StudentForm({ onStudentAdded, editingStudent, onCancelEdit }) {
    const [form, setForm] = useState({ name: "", rollNo: "", email: "", department: "" });
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        if (editingStudent) {
            setForm({
                name: editingStudent.name,
                rollNo: editingStudent.rollNo,
                email: editingStudent.email || "",
                department: editingStudent.department
            });
        } else {
            setForm({ name: "", rollNo: "", email: "", department: "" });
        }
    }, [editingStudent]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleSubmit = async () => {
        const { name, rollNo, email, department } = form;

        if (!name || !rollNo || !email || !department) {
            showMessage("All fields are required", "error");
            return;
        }

        try {
            if (editingStudent) {
                await updateStudent(editingStudent._id, form);
                showMessage("Student details updated!", "success");
            } else {
                await addStudent(form);
                showMessage("New student added successfully!", "success");
            }
            setForm({ name: "", rollNo: "", email: "", department: "" });
            onStudentAdded();
        } catch (err) {
            const msg = err.response?.data?.message || "Action failed";
            showMessage(msg, "error");
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>
                {editingStudent ? "Edit Student Information" : "Enroll New Student"}
            </h2>

            {message.text && (
                <div style={message.type === "success" ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            <div style={styles.row}>
                <div style={styles.inputGroup}>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <input
                        style={styles.input}
                        type="text"
                        name="rollNo"
                        placeholder="Roll No"
                        value={form.rollNo}
                        onChange={handleChange}
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <select
                        style={styles.input}
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                    >
                        <option value="">Dept</option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div style={styles.btnGroup}>
                    <button style={styles.btn} onClick={handleSubmit}>
                        {editingStudent ? "Save Changes" : "Register"}
                    </button>
                    {editingStudent && (
                        <button style={styles.btnCancel} onClick={onCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
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
        flexWrap: "wrap",
        alignItems: "flex-end"
    },
    inputGroup: {
        flex: 1,
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        minWidth: "300px"
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
    btnGroup: {
        display: "flex",
        gap: "12px",
        flex: "1 1 100%",
        marginTop: "8px",
        "@media (min-width: 1024px)": {
            flex: "0 0 auto",
            marginTop: "0"
        }
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
        transition: "transform 0.1s, background-color 0.2s",
        flex: 1
    },
    btnCancel: {
        padding: "12px 28px",
        background: "#f1f5f9",
        color: "#475569",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "background-color 0.2s",
        flex: 1
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
