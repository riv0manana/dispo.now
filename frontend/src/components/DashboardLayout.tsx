import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { client } from "../lib/sdk";
import { useEffect } from "react";

export function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!client.isAuthenticated()) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  const handleLogout = () => {
    client.logout();
    navigate({ to: '/' });
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link to="/" className="block hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="dispo.now" className="h-8 w-auto" />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors [&.active]:text-emerald-400 [&.active]:bg-zinc-900"
            activeProps={{ className: "active" }}
          >
            <LayoutDashboard size={18} />
            Projects
          </Link>
          <Link 
            to="/docs" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <BookOpen size={18} />
            Documentation
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
