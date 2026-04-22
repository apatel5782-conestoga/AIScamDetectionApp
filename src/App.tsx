import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import FraudDetectionPage from "./pages/FraudDetectionPage";
import FraudReportingCenterPage from "./pages/FraudReportingCenterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LegalCompliancePage from "./pages/LegalCompliancePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RecoveryCenterPage from "./pages/RecoveryCenterPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/analyze" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze" element={<FraudDetectionPage />} />
          <Route path="/reports" element={<FraudReportingCenterPage />} />
          <Route path="/recovery" element={<RecoveryCenterPage />} />
          <Route path="/compliance" element={<LegalCompliancePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/fraud-detection" element={<Navigate to="/analyze" replace />} />
          <Route path="/fraud-reporting" element={<Navigate to="/reports" replace />} />
          <Route path="/recovery-center" element={<Navigate to="/recovery" replace />} />
          <Route path="/legal-compliance" element={<Navigate to="/compliance" replace />} />
          <Route path="/fraud-map" element={<Navigate to="/about" replace />} />
          <Route path="/community-hub" element={<Navigate to="/about" replace />} />
          <Route path="/community-area" element={<Navigate to="/about" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
