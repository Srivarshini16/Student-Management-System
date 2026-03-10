import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, markAttendance } from "../api";
import StudentForm from "../components/StudentForm";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";

function Avatar({ user, style, onClick }) {
    if (user.picture) {
        return <img src={user.picture} alt="avatar" style={style} onClick={onClick} />;
    }
    const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div onClick={onClick} style={{ ...style, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', borderRadius: '50%', fontSize: '14px' }}>
            {initials}
        </div>
    );
}

export default function Home({ user, onLogout }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const navigate = useNavigate();

    const fetchStudents = async (search = "", department = "") => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (department) params.department = department;
            const res = await getStudents(params);
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (studentEmail, status) => {
        if (!studentEmail) {
            alert("No email assigned to this student!");
            return;
        }
        try {
            await markAttendance({ studentEmail, status });
        } catch (err) {
            console.error("Attendance Error:", err);
            alert("Failed to sync attendance");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.brand}>
                    <h1 style={styles.heading}>Student Management System</h1>
                    <div style={styles.adminBadge}>ADMIN PORTAL</div>
                </div>

                <div style={styles.userInfo}>
                    <div className="desktop-only" style={styles.userText}>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                    </div>
                    <Avatar
                        user={user}
                        style={styles.avatar}
                        onClick={() => navigate("/admin-profile")}
                    />
                    <div style={styles.actions}>
                        <button
                            style={styles.chatBtn}
                            onClick={() => navigate('/chat')}
                        >
                            Chat
                        </button>
                        <button
                            style={styles.profileBtn}
                            onClick={() => navigate("/admin-profile")}
                        >
                            Profile
                        </button>
                        <button style={styles.logoutBtn} onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content — always admin view */}
            <main style={styles.main}>
                <StudentForm
                    editingStudent={editingStudent}
                    onStudentAdded={() => {
                        fetchStudents();
                        setEditingStudent(null);
                    }}
                    onCancelEdit={() => setEditingStudent(null)}
                />
                <SearchBar
                    onSearch={(search, department) => fetchStudents(search, department)}
                    onReset={() => fetchStudents()}
                />
                {loading ? (
                    <div style={styles.loading}>
                        <div className="spinner"></div>
                        <span>Syncing records...</span>
                    </div>
                ) : (
                    <StudentTable
                        students={students}
                        onDeleted={() => fetchStudents()}
                        onEdit={(student) => {
                            setEditingStudent(student);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onMarkAttendance={handleMarkAttendance}
                    />
                )}
            </main>
        </div>
    );
}

const styles = {
    chatBtn: {
        padding: "8px 16px",
        background: "#f1f5f9",
        color: "#475569",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
    },
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        paddingBottom: "24px",
        borderBottom: "1px solid #e2e8f0"
    },
    brand: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    heading: {
        color: "#0f172a",
        fontSize: "26px",
        fontWeight: "800",
        letterSpacing: "-0.025em"
    },
    adminBadge: {
        fontSize: "10px",
        fontWeight: "700",
        background: "#f0fdf4",
        color: "#166534",
        padding: "2px 8px",
        borderRadius: "4px",
        border: "1px solid #dcfce7",
        alignSelf: "flex-start"
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    userText: {
        textAlign: "right",
    },
    userName: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#1e293b"
    },
    userEmail: {
        fontSize: "12px",
        color: "#64748b"
    },
    avatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: "pointer",
        border: "2px solid #3b82f6",
        padding: "2px",
        background: "white"
    },
    actions: {
        display: "flex",
        gap: "8px"
    },
    profileBtn: {
        padding: "8px 16px",
        background: "#f1f5f9",
        color: "#475569",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
    },
    logoutBtn: {
        padding: "8px 16px",
        background: "#fee2e2",
        color: "#dc2626",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
    },
    main: {
        display: "flex",
        flexDirection: "column",
        gap: "32px"
    },
    loading: {
        textAlign: "center",
        padding: "60px",
        color: "#94a3b8",
        fontSize: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
    }
};
