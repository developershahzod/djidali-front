import React, { ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Map, ShoppingBag, Tag, Settings, Menu, X, Users, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    )}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

const AdminLayout = ({ children, title, actions }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useLanguage();
  
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t('admin.dashboard'), to: '/admin' },
    { icon: <Map className="w-5 h-5" />, label: t('admin.tours'), to: '/admin/tours' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: t('admin.orders'), to: '/admin/orders' },
    { icon: <Users className="w-5 h-5" />, label: t('admin.users'), to: '/admin/users' },
    { icon: <Tag className="w-5 h-5" />, label: t('admin.categories'), to: '/admin/categories' },
    { icon: <BarChart2 className="w-5 h-5" />, label: t('admin.analytics'), to: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: t('admin.settings'), to: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
            <div className="text-xl font-semibold text-gray-900 dark:text-white">Djidali Admin</div>
            <button
              type="button"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin.title')}</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  active={location.pathname === item.to}
                />
              ))}
            </nav>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                {title || 'Dashboard'}
              </h2>
              {actions}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
