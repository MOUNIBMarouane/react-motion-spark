
import React from "react";
import { BarChart2, Home, CreditCard, FileCode, User, LogIn, UserPlus, Settings, FileText, Users, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-dashboard-blue-dark border-r border-white/10 shrink-0">
      {/* Logo */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dashboard-accent flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">aennaki</h2>
            <p className="text-xs text-white/50">Admin</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="mb-6">
          <div className="px-3 py-2 text-xs uppercase text-white/40 font-medium">
            MAIN
          </div>
          <div className="sidebar-item active">
            <Home size={18} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item">
            <FileText size={18} />
            <span>Documents</span>
          </div>
          <div className="sidebar-item">
            <Users size={18} />
            <span>Users</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="px-3 py-2 text-xs uppercase text-white/40 font-medium">
            ACCOUNT
          </div>
          <div className="sidebar-item">
            <User size={18} />
            <span>Profile</span>
          </div>
          <div className="sidebar-item">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="sidebar-item w-full">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
