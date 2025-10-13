import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Settings } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import CategoryDropdown from './CategoryDropdown';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlistData = localStorage.getItem('wishlist');
      const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
      setWishlistCount(wishlist.length);
    };

    updateWishlistCount();
    window.addEventListener('wishlist-updated', updateWishlistCount);
    return () => window.removeEventListener('wishlist-updated', updateWishlistCount);
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="/svgviewer-png-output.png"
              alt="Logo"
              className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 flex-1">
            <CategoryDropdown />
            <button
              onClick={() => navigate('/about')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Dashboard Link */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  if (user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER') {
                    navigate('/admin');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER' ? 'Admin Panel' : 'Panelaim'}
                </span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors relative group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm font-medium">{t('nav.wishlist')}</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-medium cursor-pointer pr-8 text-sm hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-all"
              >
                <option value="uz">UZB</option>
                <option value="ru">RUS</option>
                <option value="en">ENG</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Login */}
            <button
              onClick={handleAuthAction}
              className="flex items-center space-x-2 text-white bg-green-600 hover:bg-green-700 border border-green-600 rounded-lg px-4 py-2 hover:border-green-700 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <span className="text-sm">
                {isAuthenticated ? `${user?.firstName || ''} ${user?.lastName || ''} (Chiqish)` : t('nav.login')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
