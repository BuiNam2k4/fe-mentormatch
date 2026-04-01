import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import RightSidebar from "./components/layout/RightSidebar";
import CreatePost from "./components/feed/CreatePost";
import PostCard from "./components/feed/PostCard";
import AuthPage from "./components/auth/AuthPage";
import FindMentorPage from "./pages/FindMentorPage";
import MentorProfilePage from "./pages/MentorProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import MentorRegistrationPage from "./pages/MentorRegistrationPage";
import MenteeBookingsPage from "./pages/MenteeBookingsPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMentorRequestsPage from "./pages/admin/AdminMentorRequestsPage";
import FeedPage from "./pages/FeedPage";
import MentorSchedulePage from "./pages/MentorSchedulePage";
import AdminSkillPage from "./pages/admin/AdminSkillPage";
import MentorWalletPage from "./pages/MentorWalletPage";
import AdminWithdrawalPage from "./pages/admin/AdminWithdrawalPage";
import AdminDisputesPage from "./pages/admin/AdminDisputesPage";
import MenteeProfilePage from "./pages/MenteeProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import PaymentResultPage from "./pages/PaymentResultPage";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./contexts/AuthContext";

// Root component to redirect authenticated users
function RootRedirector() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/feed" replace />;
  }
  return <LandingPage />;
}

// User App Layout (with top Navbar)
function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<RootRedirector />} />
          <Route
            path="/feed"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <FeedPage />
                </div>
              </UserLayout>
            }
          />
          <Route
            path="/auth"
            element={
              <UserLayout>
                <AuthPage />
              </UserLayout>
            }
          />
          <Route
            path="/login"
            element={
              <UserLayout>
                <AuthPage />
              </UserLayout>
            }
          />
          <Route
            path="/search"
            element={
              <UserLayout>
                <FindMentorPage />
              </UserLayout>
            }
          />
          <Route
            path="/me"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-5xl mx-auto min-w-0">
                      <MyProfilePage />
                  </div>
                </div>
              </UserLayout>
            }
          />
          <Route
            path="/mentor/:id"
            element={
              <UserLayout>
                <MentorProfilePage />
              </UserLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <UserLayout>
                <ProfileSettingsPage />
              </UserLayout>
            }
          />
          <Route
            path="/schedule"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <div className="flex gap-8">
                    <Sidebar />
                    <div className="flex-1">
                      <MentorSchedulePage />
                    </div>
                  </div>
                </div>
              </UserLayout>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <div className="flex gap-8">
                    <Sidebar />
                    <div className="flex-1">
                      <MenteeBookingsPage />
                    </div>
                  </div>
                </div>
              </UserLayout>
            }
          />
          <Route
            path="/wallet"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <div className="flex gap-8">
                    <Sidebar />
                    <div className="flex-1">
                      <MentorWalletPage />
                    </div>
                  </div>
                </div>
              </UserLayout>
            }
          />
          <Route
            path="/register-mentor"
            element={
              <UserLayout>
                <MentorRegistrationPage />
              </UserLayout>
            }
          />
          <Route
            path="/mentee/:id"
            element={
              <UserLayout>
                <MenteeProfilePage />
              </UserLayout>
            }
          />
          <Route
            path="/payment-result"
            element={
              <UserLayout>
                <div className="container mx-auto px-4 py-8">
                  <PaymentResultPage />
                </div>
              </UserLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route
              path="mentor-requests"
              element={<AdminMentorRequestsPage />}
            />
            <Route path="skills" element={<AdminSkillPage />} />
            <Route path="withdrawals" element={<AdminWithdrawalPage />} />
            <Route path="disputes" element={<AdminDisputesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
