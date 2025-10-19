import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const languageOptions: Array<{ value: 'ru' | 'uz' | 'en'; label: string }> = useMemo(() => ([
    { value: 'ru', label: 'RU' },
    { value: 'uz', label: 'UZ' },
    { value: 'en', label: 'EN' },
  ]), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: 'ru' | 'uz' | 'en') => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const dashboardLink = user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER'
    ? '/admin'
    : '/dashboard';

  return (
    <header className="fixed top-5 left-6 right-6 z-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between h-[80px]">
          <div className="flex items-center flex-shrink-0" style={{ width: '220px' }}>
            <button onClick={handleLogoClick} className="flex items-center space-x-3 focus:outline-none">
              <img
                src="/logo.png"
                alt="DJIDALI"
                className="h-[50px] w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </button>
          </div>

          <nav className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => navigate('/')}
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all text-[14px] font-normal px-5 py-2.5 rounded-lg"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => navigate('/tours')}
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all text-[14px] font-normal px-5 py-2.5 rounded-lg"
            >
              {t('nav.categories')}
            </button>
            <button
              onClick={() => navigate('/why-us')}
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all text-[14px] font-normal px-5 py-2.5 rounded-lg"
            >
              {t('nav.whyUs')}
            </button>
          
            <button
              onClick={() => navigate('/contact')}
              className="text-white/90 hover:text-white hover:bg-white/10 transition-all text-[14px] font-normal px-5 py-2.5 rounded-lg"
            >
              {t('nav.contact')}
            </button>
          </nav>

          <div className="flex items-center space-x-3 flex-shrink-0" style={{ width: '250px', justifyContent: 'flex-end' }}>
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-1 text-white hover:text-white/80 transition-all"
              >
                <span className="text-[14px] font-medium uppercase">
                  {languageOptions.find(opt => opt.value === language)?.label}
                </span>
                <img
                  src="/language-dropdown-arrow.svg"
                  alt=""
                  className="w-5 h-5"
                />
              </button>

              {/* Dropdown Menu */}
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden min-w-[80px]">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleLanguageChange(option.value)}
                      className={`w-full px-4 py-2.5 text-left text-[14px] font-medium uppercase transition-all ${
                        language === option.value
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={dashboardLink}
                  className="text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-full px-4 py-2 transition-all text-[13px] font-medium"
                >
                  {user?.role === 'ADMIN' || user?.role === 'SALES_MANAGER' ? t('nav.adminPanel') : t('nav.userPanel')}
                </Link>
                <button
                  onClick={handleAuthAction}
                  className="text-white/80 hover:text-white border border-white/20 rounded-full px-4 py-2 transition-all text-[13px] font-medium"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-full px-6 py-2 transition-all text-[13px] font-medium"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
