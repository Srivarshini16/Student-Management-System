import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, Settings, School } from "lucide-react";

export default function Layout() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <School size={24} />
          <span>EduManage</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            end
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink 
            to="/students" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            end
          >
            <Users size={20} />
            Students
          </NavLink>
          <NavLink 
            to="/students/add" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <UserPlus size={20} />
            Add Student
          </NavLink>
        </nav>
        <div style={{ padding: "1.5rem 1rem", borderTop: "1px solid var(--border)" }}>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-search">
             {/* Potential global search placeholder */}
          </div>
          <div className="topbar-actions">
            {/* User Profile placeholder */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              A
            </div>
          </div>
        </header>

        {/* Page Content area where nested routes render */}
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
