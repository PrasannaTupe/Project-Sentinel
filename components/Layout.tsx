
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, MOCK_USER } from '../constants';
import { LogOut, Search, Hexagon } from 'lucide-react';
import { GlobalAI } from './GlobalAI';
import { useApp } from '../store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { searchTerm, setSearchTerm, user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 flex flex-col p-4 z-40">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center neon-border-purple">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            SENTINEL
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          {/* Clickable Profile Section */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 mb-4 hover:bg-white/5 p-2 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-blue-500/50 transition-colors">
              <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
              <p className="text-xs text-blue-400 font-mono">LVL {user.level}</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-black/40">
        {/* Top Header */}
        <header className="h-16 glass-dark border-b border-white/5 px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-96 focus-within:border-blue-500/50 transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meetings, tasks, decisions..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600 text-white"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              AI AGENT: ACTIVE
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>

      <GlobalAI />
    </div>
  );
};
