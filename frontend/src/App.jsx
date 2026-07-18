import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./layouts/MainLayout";

import Toast from "./components/Toast";

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Toast />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
                path="/company/*"
                element={
                  <ProtectedRoute allowedRole="COMPANY">
                    <MainLayout>
                      <CompanyDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
            />

            <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRole="STUDENT">
                    <MainLayout>
                      <StudentDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
            />

            <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRole="ADMIN">
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}