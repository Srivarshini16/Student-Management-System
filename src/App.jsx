import { useState, useEffect } from "react";
import { getStudents } from "./api";
import StudentForm from "./components/StudentForm";
import SearchBar from "./components/SearchBar";
import StudentTable from "./components/StudentTable";
import Login from "./components/Login";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

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
    if (user) fetchStudents();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setStudents([]);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Student Management System</h1>
        <div style={styles.userInfo}>
          <img
            src={user.picture}
            alt="avatar"
            style={styles.avatar}
          />
          <span style={styles.userName}>{user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <StudentForm onStudentAdded={() => fetchStudents()} />

      <SearchBar
        onSearch={(search, department) => fetchStudents(search, department)}
        onReset={() => fetchStudents()}
      />

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <StudentTable
          students={students}
          onDeleted={() => fetchStudents()}
        />
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "auto" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px"
  },
  heading: { color: "#333", fontSize: "24px" },
  userInfo: {
    display: "flex", alignItems: "center", gap: "10px"
  },
  avatar: {
    width: "36px", height: "36px",
    borderRadius: "50%"
  },
  userName: { fontSize: "14px", color: "#444" },
  logoutBtn: {
    padding: "6px 16px", background: "#e53935",
    color: "white", border: "none",
    borderRadius: "6px", cursor: "pointer", fontSize: "13px"
  },
  loading: {
    textAlign: "center", padding: "30px",
    color: "#888", fontSize: "16px"
  }
};