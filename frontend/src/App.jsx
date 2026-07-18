import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/company/*"
                element={
                  <ProtectedRoute allowedRole="COMPANY">
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}