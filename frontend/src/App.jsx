import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

// Layout
import MainLayout from "./layouts/MainLayout";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import BrowseJobs from "./pages/student/BrowseJobs";
import StudentApplications from "./pages/student/StudentApplications";
import StudentProfile from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSettings from "./pages/student/StudentSettings";

// Company Pages
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/company/PostJob";
import ManageJobs from "./pages/company/ManageJobs";
import Applicants from "./pages/company/Applicants";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyAnalytics from "./pages/company/CompanyAnalytics";
import CompanySettings from "./pages/company/CompanySettings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import PendingApprovals from "./pages/admin/PendingApprovals";
import StudentDirectory from "./pages/admin/StudentDirectory";
import CompanyDirectory from "./pages/admin/CompanyDirectory";
import JobsList from "./pages/admin/JobsList";
import Reports from "./pages/admin/Reports";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

import Toast from "./components/Toast";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Student Subroutes */}
          <Route
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<BrowseJobs />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/settings" element={<StudentSettings />} />
          </Route>

          {/* Company Subroutes */}
          <Route
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/post-job" element={<PostJob />} />
            <Route path="/company/jobs" element={<ManageJobs />} />
            <Route path="/company/applicants" element={<Applicants />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/analytics" element={<CompanyAnalytics />} />
            <Route path="/company/settings" element={<CompanySettings />} />
          </Route>

          {/* Admin Subroutes */}
          <Route
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pending" element={<PendingApprovals />} />
            <Route path="/admin/students" element={<StudentDirectory />} />
            <Route path="/admin/companies" element={<CompanyDirectory />} />
            <Route path="/admin/jobs" element={<JobsList />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}