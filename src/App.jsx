import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import AdminProfile from "./pages/AdminProfile";
import UserProfile from "./pages/UserProfile";
import ChatPage from "./pages/ChatPage";
import { isAdmin } from "./config/admins";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return isAdmin(parsedUser.email) ? "admin" : "user";
    }
    return "user";
  });
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    const userRole = isAdmin(userData.email) ? "admin" : "user";
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    setRole("user");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} role={role} onLogout={handleLogout} />} />
      <Route path="/admin-profile" element={<AdminProfile user={user} />} />
      <Route path="/user-profile" element={<UserProfile user={user} />} />
      <Route path="/chat" element={<ChatPage user={user} role={role} onLogout={handleLogout} />} />
    </Routes>
  );
}

