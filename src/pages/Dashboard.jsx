export default function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        
        <div className="card">
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Total Students</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>3,482</div>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>New Enrollments</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>+124</div>
        </div>

        <div className="card">
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Departments</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>8</div>
        </div>

      </div>

      <div className="card" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
        Analytics placeholder
      </div>
    </div>
  );
}
