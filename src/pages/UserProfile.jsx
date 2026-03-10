import { useEffect, useState } from "react";
import { getStudentAttendance } from "../api";
import { useNavigate } from "react-router-dom";

function Avatar({ user }) {
    if (user.picture) {
        return <img src={user.picture} alt="avatar" style={styles.avatar} />;
    }
    const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div style={{ ...styles.avatar, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '800', borderRadius: '50%' }}>
            {initials}
        </div>
    );
}

export default function UserProfile({ user }) {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await getStudentAttendance(user.email);
                setAttendance(res.data);
            } catch (err) {
                console.error("Failed to fetch attendance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [user.email]);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate("/")}>
                    ← Back
                </button>
                <h1 style={styles.title}>Student Dashboard</h1>
            </header>

            <div style={styles.card}>
                <Avatar user={user} />
                <h2 style={styles.name}>{user.name}</h2>
                <div style={styles.email}>{user.email}</div>
                <div style={styles.badge}>VERIFIED STUDENT</div>
            </div>

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Attendance History</h3>
                {loading ? (
                    <div style={styles.infoText}>Analyzing records...</div>
                ) : attendance.length === 0 ? (
                    <div style={styles.infoText}>No attendance records found in system.</div>
                ) : (
                    <div style={styles.list}>
                        {attendance.map((record) => (
                            <div key={record._id} style={styles.item}>
                                <div style={styles.date}>
                                    {new Date(record.date).toLocaleDateString()}
                                </div>
                                <div style={record.status === 'Present' ? styles.statusPresent : styles.statusAbsent}>
                                    {record.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: "700px", margin: "60px auto", padding: "0 20px" },
    header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
    backBtn: {
        background: "white", padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", cursor: "pointer",
        fontWeight: "600", color: "#64748b"
    },
    title: { fontSize: "24px", fontWeight: "800", color: "#0f172a" },
    card: { background: "white", padding: "48px", borderRadius: "24px", textAlign: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" },
    avatar: { width: "110px", height: "110px", borderRadius: "50%", marginBottom: "20px", border: "4px solid #f8fafc" },
    name: { fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" },
    email: { color: "#64748b", marginBottom: "20px", fontSize: "14px" },
    badge: { background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", display: "inline-block", border: "1px solid #dbeafe" },
    section: { marginTop: "32px" },
    sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" },
    infoText: { padding: "40px", textAlign: "center", background: "#f8fafc", borderRadius: "16px", color: "#94a3b8", fontSize: "14px" },
    list: { display: "flex", flexDirection: "column", gap: "12px" },
    item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "white", borderRadius: "12px", border: "1px solid #f1f5f9" },
    date: { fontWeight: "600", color: "#475569" },
    statusPresent: { color: "#16a34a", fontWeight: "700", fontSize: "12px", background: "#f0fdf4", padding: "2px 8px", borderRadius: "4px" },
    statusAbsent: { color: "#dc2626", fontWeight: "700", fontSize: "12px", background: "#fef2f2", padding: "2px 8px", borderRadius: "4px" }
};
