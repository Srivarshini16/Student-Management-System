import { useState } from "react";
import { addStudent } from "../api";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

export default function AddStudent() {
  const [formData, setFormData] = useState({ name: "", rollNumber: "", department: "", email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber) {
      alert("Name and Roll Number are required.");
      return;
    }
    setLoading(true);
    try {
      await addStudent(formData);
      navigate("/students");
    } catch (err) {
      console.error(err);
      alert("Error adding student!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <button 
        className="btn btn-icon" 
        style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0" }}
        onClick={() => navigate("/students")}
      >
        <ArrowLeft size={16} /> Back to students
      </button>
      
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Add New Student</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Student Name</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Roll Number</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="e.g. 21BCE0001"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Department</label>
            <select 
              className="form-select"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: "0" }}>
            <label className="form-label">Email</label>
            <input 
              className="form-input" 
              type="email" 
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn" style={{ background: "transparent", border: "1px solid var(--border)" }} onClick={() => navigate("/students")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
