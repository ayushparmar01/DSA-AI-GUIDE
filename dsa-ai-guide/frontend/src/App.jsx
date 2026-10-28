import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { AssessmentPage } from './pages/Assessment/AssessmentPage';
import { AssessmentResultPage } from './pages/Assessment/AssessmentResultPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { RoadmapPage } from './pages/Roadmap/RoadmapPage';
import { TopicsPage } from './pages/Topics/TopicsPage';
import { TopicDetailPage } from './pages/Topics/TopicDetailPage';
import { ProblemsPage } from './pages/Problems/ProblemsPage';
import { ProblemDetailPage } from './pages/Problems/ProblemDetailPage';
import { LeetCodeImportPage } from './pages/LeetCode/LeetCodeImportPage';
import { RevisionPage } from './pages/Revision/RevisionPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { AIMentorPage } from './pages/AIMentor/AIMentorPage';
import { MockInterviewPage } from './pages/MockInterview/MockInterviewPage';
import { ContestPage } from './pages/Contest/ContestPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AdminPage } from './pages/Admin/AdminPage';

// Protected Route Guard
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner text="Authenticating Session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
};

// Main Layout with Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col bg-[#0B0F17] text-gray-100">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Onboarding & Diagnostic Assessment */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment"
                  element={
                    <ProtectedRoute>
                      <AssessmentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment/result"
                  element={
                    <ProtectedRoute>
                      <AssessmentResultPage />
                    </ProtectedRoute>
                  }
                />

                {/* Main App Dashboard & Modules (with Sidebar Layout) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roadmap"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RoadmapPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/topics"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TopicsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/topics/:id"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <TopicDetailPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/problems"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ProblemsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/problems/:slug"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ProblemDetailPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leetcode-import"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <LeetCodeImportPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/revision"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RevisionPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AnalyticsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-mentor"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AIMentorPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mock-interview"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <MockInterviewPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contest"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ContestPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ProfilePage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Management Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <DashboardLayout>
                        <AdminPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
