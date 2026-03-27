import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import CommunityFraudExperienceHubPage from "./pages/CommunityFraudExperienceHubPage";
import CommunityAreaTalkPage from "./pages/CommunityAreaTalkPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DashboardPage from "./pages/DashboardPage";
import FraudDetectionPage from "./pages/FraudDetectionPage";
import FraudReportingCenterPage from "./pages/FraudReportingCenterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LegalCompliancePage from "./pages/LegalCompliancePage";
import LocationRiskIntelligencePage from "./pages/LocationRiskIntelligencePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RecoveryCenterPage from "./pages/RecoveryCenterPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/fraud-detection" element={<FraudDetectionPage />} />
        <Route path="/fraud-map" element={<LocationRiskIntelligencePage />} />
        <Route path="/fraud-reporting" element={<FraudReportingCenterPage />} />
        <Route path="/community-hub" element={<CommunityFraudExperienceHubPage />} />
        <Route path="/community-area" element={<CommunityAreaTalkPage />} />
        <Route path="/recovery-center" element={<RecoveryCenterPage />} />
        <Route path="/legal-compliance" element={<LegalCompliancePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
