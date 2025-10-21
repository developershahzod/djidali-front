import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TourListPage from './pages/TourListPage';
import TourDetailPage from './pages/TourDetailPage';
import CategoryPage from './components/CategoryPage';
import NewAboutPage from './pages/NewAboutPage';
import NewContactPage from './pages/NewContactPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange';
import WhyUsPage from './pages/WhyUsPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#F5F5F0]">
          <ScrollToTopOnRouteChange />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<TourListPage />} />
            <Route path="/tour/:id" element={<TourDetailPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
            <Route path="/about" element={<NewAboutPage />} />
            <Route path="/contact" element={<NewContactPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
          <Footer />
          <ScrollToTopButton />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;