import { useState, useEffect } from "react";
import { getStudents } from "./api";
import StudentForm from "./components/StudentForm";
import SearchBar from "./components/SearchBar";
import StudentTable from "./components/StudentTable";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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
    fetchStudents();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Management System</h1>

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
  container: {
    maxWidth: "900px",
    margin: "auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#333",
    fontSize: "26px"
  },
  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#888",
    fontSize: "16px"
  }
};