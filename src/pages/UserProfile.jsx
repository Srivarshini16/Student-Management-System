export default function UserProfile({ user }) {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Student Profile</h1>
            <div style={styles.card}>
                <img src={user.picture} alt="avatar" style={styles.avatar} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div style={styles.badge}>Student User</div>
            </div>
            <div style={styles.attendanceSection}>
                <h3>Attendance Report</h3>
                <p>No attendance data available yet.</p>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: "800px", margin: "40px auto", textAlign: "center" },
    title: { color: "#333", marginBottom: "20px" },
    card: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    avatar: { width: "100px", height: "100px", borderRadius: "50%", marginBottom: "20px" },
    badge: { background: "#2196F3", color: "white", padding: "4px 12px", borderRadius: "4px", display: "inline-block", marginTop: "10px" },
    attendanceSection: { marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }
};
