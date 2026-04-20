import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Map,
  ShoppingBag,
  FolderTree,
  Settings,
  Menu,
  X,
  Newspaper,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { cn } from "../lib/utils";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
  comingSoon?: boolean;
}

const NavItem = ({
  icon,
  label,
  to,
  active,
  collapsed,
  comingSoon,
}: NavItemProps) => {
  if (comingSoon) {
    return (
      <div
        className="group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded text-slate-500 cursor-not-allowed opacity-60"
        title={collapsed ? `${label} — Coming soon` : undefined}
      >
        <span className="flex h-5 w-5 items-center justify-center shrink-0">
          {icon}
        </span>
        {!collapsed && (
          <>
            <span className="truncate">{label}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
              Soon
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors",
        active
          ? "bg-primary-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white",
      )}
      title={collapsed ? label : undefined}
    >
      <span className="flex h-5 w-5 items-center justify-center shrink-0">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
};

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

const AdminLayout = ({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: t("admin.dashboard"),
      to: "/admin",
    },
    {
      icon: <Map className="h-5 w-5" />,
      label: t("admin.tours"),
      to: "/admin/tours",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: t("admin.orders"),
      to: "/admin/orders",
    },
    {
      icon: <FolderTree className="h-5 w-5" />,
      label: t("admin.categories"),
      to: "/admin/categories",
    },
    {
      icon: <Newspaper className="h-5 w-5" />,
      label: t("admin.news"),
      to: "/admin/news",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: t("admin.settings"),
      to: "/admin/settings",
      comingSoon: true,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-8 bottom-0 left-0 right-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Enterprise Navy */}
      <aside
        className={cn(
          "fixed top-8 bottom-0 left-0 z-50 flex flex-col bg-navy-900 transition-all duration-200 lg:relative lg:top-0",
          collapsed ? "w-16" : "w-60",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-slate-700/50 px-4",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-white font-semibold text-sm">
                Djidali Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-7 w-7 flex items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={isActive(item.to)}
              collapsed={collapsed}
              comingSoon={(item as any).comingSoon}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-700/50 p-3">
          {!collapsed && user && (
            <div className="mb-2 px-2 py-2 rounded bg-slate-800/50">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {t("admin.account")}
              </p>
              <p className="text-sm font-medium text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-600/20 text-primary-300">
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium rounded text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? t("admin.logout") : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>{t("admin.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar - Clean, minimal */}
        <header className="h-14 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-8 w-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              {subtitle && (
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {subtitle}
                </p>
              )}
              <h1 className="text-lg font-semibold text-slate-900">
                {title || "Дашборд"}
              </h1>
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* Page Content - Cool Gray background */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
