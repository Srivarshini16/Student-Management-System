import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import StudentsList from "./pages/StudentsList";
import AddStudent from "./pages/AddStudent";
import Login from "./pages/Login";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentsList />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}