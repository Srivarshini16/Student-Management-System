import { useState, useEffect } from "react";
import { getStudents } from "../api";
import { Search, Filter, Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await getStudents(params);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Students</h1>
        <button className="btn btn-primary" onClick={() => navigate("/students/add")}>
          <Plus size={16} />
          Add Student
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        {/* Table Toolbar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search students by name or roll..." 
              style={{ width: "100%", paddingLeft: "2.5rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn" style={{ border: "1px solid var(--border)" }}>
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table itself */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Name</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Roll Number</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Department</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading students...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No students found.</td></tr>
              ) : (
                students.map((st) => (
                  <tr key={st._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--secondary)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>{st.name}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{st.rollNumber}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ padding: "0.25rem 0.6rem", background: "var(--bg)", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600 }}>{st.department}</span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <button className="btn btn-icon"><Edit2 size={16} /></button>
                      <button className="btn btn-icon" style={{ color: "var(--danger)" }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
