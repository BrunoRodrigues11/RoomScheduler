import React from 'react';
import { Calendar, Layout as LayoutIcon, Users, LogOut, Shield } from 'lucide-react';
import { ViewMode } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutIcon className="w-6 h-6 text-blue-400" />
            RoomScheduler
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Salas</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          <button
            onClick={() => onViewChange('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Calendário</span>
          </button>

          {/* Admin and Sec can manage rooms, Common can only view in list/cal */}
          <button
            onClick={() => onViewChange('rooms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'rooms'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutIcon className="w-5 h-5" />
            <span className="font-medium">Salas</span>
          </button>

          <button
            onClick={() => onViewChange('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Todos Agendamentos</span>
          </button>

          {/* Only Admin sees Users tab */}
          {user?.role === 'admin' && (
             <button
             onClick={() => onViewChange('users')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
               currentView === 'users'
                 ? 'bg-blue-600 text-white'
                 : 'text-slate-300 hover:bg-slate-800'
             }`}
           >
             <Shield className="w-5 h-5" />
             <span className="font-medium">Usuários</span>
           </button>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                 {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium truncate">{user?.name}</p>
                 <p className="text-xs text-slate-400 capitalize">{user?.role === 'sec' ? 'Secretaria' : user?.role}</p>
              </div>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
           >
             <LogOut className="w-4 h-4" /> Sair
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
};