import React from 'react';
import { Calendar, Layout as LayoutIcon, Users } from 'lucide-react';
import { ViewMode } from '../types';

interface LayoutProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutIcon className="w-6 h-6 text-blue-400" />
            RoomScheduler
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Salas</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
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
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
};