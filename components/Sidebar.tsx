import React from 'react';
import { LayoutDashboard, Music, Video, ShieldCheck, Settings, LogOut, UserCircle } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  role: 'creator' | 'admin';
  onNavigate: (view: string) => void;
  onToggleRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, role, onNavigate, onToggleRole }) => {
  const menuItems = role === 'creator' 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'videos', label: 'My Content', icon: <Video size={20} /> },
        { id: 'library', label: 'Song Library', icon: <Music size={20} /> },
      ]
    : [
        { id: 'admin-dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'admin-review', label: 'Review Queue', icon: <ShieldCheck size={20} /> },
        { id: 'admin-songs', label: 'Manage Songs', icon: <Music size={20} /> },
      ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">UGC</span>
          Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{role} Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={onToggleRole}
            className="flex items-center gap-3 text-slate-400 hover:text-white text-sm w-full px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
            <UserCircle size={20} />
            <div className="text-left">
                <p className="text-xs text-slate-500">Switch Role</p>
                <p className="font-semibold capitalize">{role}</p>
            </div>
        </button>
      </div>
    </div>
  );
};