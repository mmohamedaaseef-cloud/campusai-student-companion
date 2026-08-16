import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Brain,
  NotebookPen,
  BookOpen,
  ListTodo,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/Toast';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/assistant', label: 'AI Assistant', icon: Brain, end: false },
  { to: '/dashboard/notes', label: 'My Notes', icon: NotebookPen, end: false },
  { to: '/dashboard/subjects', label: 'Subjects', icon: BookOpen, end: false },
  { to: '/dashboard/tasks', label: 'Study Tasks', icon: ListTodo, end: false },
  { to: '/dashboard/profile', label: 'Profile', icon: User, end: false },
];

export function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { show } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    show('Signed out successfully', 'info');
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          Campus<span className="text-sky-500">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {profile?.full_name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
              {profile?.full_name || 'Student'}
            </p>
            <p className="truncate text-xs text-slate-400">{profile?.department || 'Department'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {profile?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
