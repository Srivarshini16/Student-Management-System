import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../api";
import StudentForm from "../components/StudentForm";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";

export default function Home({ user, role, onLogout }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (role === "admin") fetchStudents();
    }, [role]);

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.brand}>
                    <h1 style={styles.heading}>Student Management System</h1>
                    <div style={role === "admin" ? styles.adminBadge : styles.userBadge}>
                        {role === "admin" ? "ADMIN PORTAL" : "STUDENT PORTAL"}
                    </div>
                </div>

                <div style={styles.userInfo}>
                    <div style={styles.userText}>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                    </div>
                    <img
                        src={user.picture}
                        alt="avatar"
                        style={styles.avatar}
                        onClick={() => navigate(role === "admin" ? "/admin-profile" : "/user-profile")}
                    />
                    <div style={styles.actions}>
                        <button
                            style={styles.profileBtn}
                            onClick={() => navigate(role === "admin" ? "/admin-profile" : "/user-profile")}
                        >
                            Profile
                        </button>
                        <button style={styles.logoutBtn} onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                {role === "admin" ? (
                    <>
                        <StudentForm onStudentAdded={() => fetchStudents()} />
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
                            />
                        )}
                    </>
                ) : (
                    <div style={styles.welcomeCard}>
                        <div style={styles.welcomeInfo}>
                            <img src={user.picture} alt="avatar" style={styles.bigAvatar} />
                            <h2 style={styles.welcomeTitle}>Welcome, {user.name}!</h2>
                            <p style={styles.welcomeSubtitle}>Manage your attendance and personal academic records.</p>
                        </div>
                        <div style={styles.quickActions}>
                            <button
                                style={styles.primaryBtn}
                                onClick={() => navigate("/user-profile")}
                            >
                                View My Dashboard →
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
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
    userBadge: {
        fontSize: "10px",
        fontWeight: "700",
        background: "#eff6ff",
        color: "#1e40af",
        padding: "2px 8px",
        borderRadius: "4px",
        border: "1px solid #dbeafe",
        alignSelf: "flex-start"
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    userText: {
        textAlign: "right",
        display: "none",
        "@media (min-width: 640px)": {
            display: "block"
        }
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
    },
    welcomeCard: {
        background: "white",
        padding: "60px 40px",
        borderRadius: "24px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        border: "1px solid #f1f5f9",
        maxWidth: "600px",
        margin: "40px auto"
    },
    welcomeInfo: {
        marginBottom: "32px"
    },
    bigAvatar: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        marginBottom: "24px",
        border: "4px solid #eff6ff"
    },
    welcomeTitle: {
        color: "#0f172a",
        fontSize: "28px",
        fontWeight: "800",
        marginBottom: "8px"
    },
    welcomeSubtitle: {
        color: "#64748b",
        fontSize: "16px"
    },
    quickActions: {
        display: "flex",
        justifyContent: "center"
    },
    primaryBtn: {
        padding: "14px 32px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "700",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)"
    }
};
