import { deleteStudent } from "../api";

export default function StudentTable({ students, onDeleted }) {

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            await deleteStudent(id);
            onDeleted();
        } catch (err) {
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
                        <th style={styles.th}>Department</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.noData}>
                                No students found
                            </td>
                        </tr>
                    ) : (
                        students.map((s, i) => (
                            <tr key={s._id} style={styles.row}>
                                <td style={styles.td}>{i + 1}</td>
                                <td style={styles.td}>{s.name}</td>
                                <td style={styles.td}>{s.rollNo}</td>
                                <td style={styles.td}>{s.department}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.btnDelete}
                                        onClick={() => handleDelete(s._id)}
                                    >
                                        Delete
                                    </button>
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
        background: "white", padding: "20px", borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    },
    title: { marginBottom: "16px", color: "#444", fontSize: "18px" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
    th: {
        background: "#4CAF50", color: "white",
        padding: "12px", textAlign: "left"
    },
    td: { padding: "12px", borderBottom: "1px solid #eee" },
    row: { cursor: "default" },
    noData: {
        textAlign: "center", color: "#888",
        padding: "20px", borderBottom: "1px solid #eee"
    },
    btnDelete: {
        padding: "6px 14px", background: "#e53935", color: "white",
        border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px"
    }
};