import { deleteStudent } from "../api";

export default function StudentTable({ students, onDeleted, onEdit, onMarkAttendance }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            await deleteStudent(id);
            onDeleted();
        } catch {
            alert("Failed to delete student");
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>All Students</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>#</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Roll Number</th>
                        <th style={styles.th}>Email Address</th>
                        <th style={styles.th}>Department</th>
                        <th style={styles.th}>Daily Attendance</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={styles.noData}>
                                No students found
                            </td>
                        </tr>
                    ) : (
                        students.map((s, i) => (
                            <tr key={s._id} style={styles.row}>
                                <td style={styles.td}>{i + 1}</td>
                                <td style={styles.td}>
                                    <div style={styles.nameCell}>{s.name}</div>
                                </td>
                                <td style={styles.td}>{s.rollNo}</td>
                                <td style={styles.td}>
                                    <div style={styles.emailCell}>{s.email || "no-email@set.com"}</div>
                                </td>
                                <td style={styles.td}>{s.department}</td>
                                <td style={styles.td}>
                                    <div style={styles.attendanceActions}>
                                        <button
                                            style={styles.btnPresent}
                                            onClick={() => onMarkAttendance(s.email, 'Present')}
                                        >
                                            P
                                        </button>
                                        <button
                                            style={styles.btnAbsent}
                                            onClick={() => onMarkAttendance(s.email, 'Absent')}
                                        >
                                            A
                                        </button>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.actions}>
                                        <button
                                            style={styles.btnEdit}
                                            onClick={() => onEdit(s)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={styles.btnDelete}
                                            onClick={() => handleDelete(s._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    card: {
        background: "white",
        padding: "0",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
    },
    title: {
        padding: "24px",
        margin: "0",
        color: "#0f172a",
        fontSize: "20px",
        fontWeight: "700",
        borderBottom: "1px solid #f1f5f9"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px"
    },
    th: {
        background: "#f8fafc",
        color: "#64748b",
        padding: "16px 24px",
        textAlign: "left",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.025em",
        borderBottom: "1px solid #f1f5f9"
    },
    td: {
        padding: "16px 24px",
        borderBottom: "1px solid #f1f5f9",
        color: "#475569"
    },
    row: {
        transition: "background-color 0.2s"
    },
    noData: {
        textAlign: "center",
        color: "#94a3b8",
        padding: "48px 24px",
        fontSize: "16px",
        fontWeight: "500"
    },
    btnDelete: {
        padding: "8px 16px",
        background: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fee2e2",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s ease"
    },
    btnEdit: {
        padding: "8px 16px",
        background: "#eff6ff",
        color: "#2563eb",
        border: "1px solid #dbeafe",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "all 0.2s ease"
    },
    actions: {
        display: "flex",
        gap: "8px"
    },
    attendanceActions: {
        display: "flex",
        gap: "4px"
    },
    btnPresent: {
        width: "30px",
        height: "30px",
        borderRadius: "6px",
        border: "1px solid #dcfce7",
        background: "#f0fdf4",
        color: "#16a34a",
        fontWeight: "800",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    btnAbsent: {
        width: "30px",
        height: "30px",
        borderRadius: "6px",
        border: "1px solid #fee2e2",
        background: "#fef2f2",
        color: "#dc2626",
        fontWeight: "800",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    nameCell: {
        fontWeight: "700",
        color: "#1e293b"
    },
    emailCell: {
        fontSize: "13px",
        color: "#64748b"
    }
};
