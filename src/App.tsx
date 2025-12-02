import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import TourListPage from "./pages/TourListPage";
import TourDetailPage from "./pages/TourDetailPage";
import TourismTypeInfoPage from "./pages/TourismTypeInfoPage";
import NewAboutPage from "./pages/NewAboutPage";
import NewContactPage from "./pages/NewContactPage";
import EcotourismPage from "./pages/EcotourismPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import WhyUsPage from "./pages/WhyUsPage";
import NewsPage from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import CompletePage from "./pages/CompletePage";
import TourismTypesPage from "./pages/TourismTypesPage";
import BookingStepPage from "./pages/BookingStepPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminNewsPage from "./pages/admin/NewsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isBookingStepPage = location.pathname.startsWith("/booking");
  const isCompletePage = location.pathname.startsWith("/complete");

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-[#F5F5F0]">
          <ScrollToTopOnRouteChange />
          {!isAdminPage && !isBookingStepPage && !isCompletePage && <Header />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<TourListPage />} />
            <Route path="/tour/:id" element={<TourDetailPage />} />
            <Route path="/category/:slug" element={<TourismTypeInfoPage />} />
            <Route path="/about" element={<NewAboutPage />} />
            <Route path="/contact" element={<NewContactPage />} />
            <Route path="/ecotourism" element={<EcotourismPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/tourism-types" element={<TourismTypesPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/booking/:tourId" element={<BookingStepPage />} />
            <Route path="/complete" element={<CompletePage />} />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/tours"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/orders"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/categories"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/news"
              element={
                isAuthenticated ? (
                  <AdminNewsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/settings"
              element={
                isAuthenticated ? (
                  <AdminSettingsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <UserDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* Redirect to home for any other unknown path */}
          </Routes>
          {!isAdminPage && !isBookingStepPage && !isCompletePage && <Footer />}
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
