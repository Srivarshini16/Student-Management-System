import { useNavigate } from "react-router-dom";

function Avatar({ user }) {
    if (user.picture) {
        return <img src={user.picture} alt="avatar" style={styles.avatar} />;
    }
    const initials = (user.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div style={{ ...styles.avatar, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: '800', borderRadius: '50%' }}>
            {initials}
        </div>
    );
}

export default function AdminProfile({ user }) {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button style={styles.backBtn} onClick={() => navigate("/")}>
                    ← Back to Dashboard
                </button>
                <h1 style={styles.title}>Administrator Profile</h1>
            </header>

            <div style={styles.card}>
                <div style={styles.profileHeader}>
                    <Avatar user={user} />
                    <div style={styles.badge}>System Superuser</div>
                </div>

                <div style={styles.infoSection}>
                    <div style={styles.infoItem}>
                        <label style={styles.label}>Full Name</label>
                        <div style={styles.value}>{user.name}</div>
                    </div>
                    <div style={styles.infoItem}>
                        <label style={styles.label}>Official Email</label>
                        <div style={styles.value}>{user.email}</div>
                    </div>
                    <div style={styles.infoItem}>
                        <label style={styles.label}>Access Level</label>
                        <div style={styles.value}>Level 4 (Full Database Control)</div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <p style={styles.footerText}>Secure Admin Session Active</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "800px",
        margin: "60px auto",
        padding: "0 20px"
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
        marginBottom: "32px"
    },
    backBtn: {
        background: "white",
        border: "1px solid #e2e8f0",
        padding: "8px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        color: "#64748b",
        transition: "all 0.2s"
    },
    title: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "-0.025em"
    },
    card: {
        background: "white",
        borderRadius: "24px",
        padding: "48px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f1f5f9",
        textAlign: "center"
    },
    profileHeader: {
        marginBottom: "40px"
    },
    avatar: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "4px solid #eff6ff",
        marginBottom: "16px",
        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)"
    },
    badge: {
        background: "#f0fdf4",
        color: "#166534",
        padding: "6px 16px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
        border: "1px solid #dcfce7"
    },
    infoSection: {
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "400px",
        margin: "0 auto"
    },
    infoItem: {
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: "12px"
    },
    label: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#94a3b8",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "4px"
    },
    value: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b"
    },
    footer: {
        marginTop: "48px",
        paddingTop: "24px",
        borderTop: "1px solid #f1f5f9"
    },
    footerText: {
        fontSize: "12px",
        color: "#cbd5e1",
        fontWeight: "500"
    }
};

