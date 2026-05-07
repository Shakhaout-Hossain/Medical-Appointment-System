import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  LogOut,
  Menu,
  X,
  Stethoscope,
  UserCog,
  FileText,
  Bell,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Update sidebar state on initial load and handle resize specifically for mobile/desktop transitions
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change (only on mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const items: { icon: any; label: string; path: string }[] = [];

    if (role === 'PATIENT') {
      items.push(
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
        { icon: Stethoscope, label: 'Find Doctors', path: '/dashboard/doctors' },
      );
    } else if (role === 'DOCTOR') {
      items.push(
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
        { icon: FileText, label: 'Prescriptions', path: '/dashboard/prescriptions' },
      );
    } else if (role === 'ADMIN') {
      items.push(
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Patients', path: '/dashboard/patients' },
        { icon: UserCheck, label: 'Doctors', path: '/dashboard/doctors' },
        { icon: UserCog, label: 'Approvals', path: '/dashboard/approvals' },
      );
    }

    return items;
  };

  const menuItems = getMenuItems();
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  const roleColors: Record<string, string> = {
    PATIENT: 'from-violet-500 to-purple-600',
    DOCTOR: 'from-sky-500 to-cyan-600',
    ADMIN: 'from-rose-500 to-pink-600',
  };
  const roleGrad = role ? roleColors[role] ?? 'from-violet-500 to-purple-600' : 'from-violet-500 to-purple-600';

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${roleGrad} shadow-lg flex-shrink-0`}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-white tracking-tight">MediConnect</h1>
              <p className="text-xs text-slate-400 capitalize">{role?.toLowerCase()} Portal</p>
            </div>
            <button
              className="ml-auto text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
            {menuItems.map((item, i) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto opacity-60 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleGrad} flex items-center justify-center flex-shrink-0 shadow`}
              >
                <span className="text-white font-bold text-xs">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="nav-item w-full hover:!bg-red-500/20 hover:!text-red-400 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for sidebar on desktop to prevent content overlap */}
      {sidebarOpen && <div className="hidden lg:block w-60 flex-shrink-0 transition-all duration-300 ease-in-out" aria-hidden="true" />}

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight truncate">{title}</h2>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Welcome back,{' '}
                  <span className="font-medium text-primary-600">{user?.fullName?.split(' ')[0]}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Notification bell */}
              <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleGrad} flex items-center justify-center shadow-sm cursor-default flex-shrink-0`}
              >
                <span className="text-white font-bold text-xs">{initials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8 lg:px-10 lg:py-8 animate-fade-in min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
