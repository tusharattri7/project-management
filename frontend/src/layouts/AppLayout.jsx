import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FolderKanban,
  LogOut,
  User,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="font-semibold text-slate-800 text-lg">
              Project Management
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === "/"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Projects
            </Link>
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-medium text-xs">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.username}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
