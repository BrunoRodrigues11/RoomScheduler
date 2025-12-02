import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StorageService } from '../services/storage';
import { User } from '../types';
import { Layout as LayoutIcon, Lock, Mail, CheckCircle2, Shield, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcomeUser, setWelcomeUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-check credentials to show welcome message before actual login/redirect
    const users = StorageService.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Show welcome screen
      setWelcomeUser(foundUser);
      
      // Wait 2 seconds then login (which triggers redirect in App.tsx)
      setTimeout(async () => {
        await login(email, password);
      }, 2000);
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'sec': return 'Secretaria';
      default: return 'Colaborador';
    }
  };

  if (welcomeUser) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Bem-vindo(a), {welcomeUser.name.split(' ')[0]}!
          </h2>
          
          <div className="flex justify-center mt-4">
             <div className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
                ${welcomeUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700' 
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}
             `}>
                {welcomeUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                <span>Perfil: {getRoleLabel(welcomeUser.role)}</span>
             </div>
          </div>
          
          {welcomeUser.role === 'admin' && (
             <p className="mt-4 text-xs text-purple-600 dark:text-purple-400 font-medium">
               Acesso total ao sistema concedido.
             </p>
          )}

          <div className="mt-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 dark:border-slate-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4">
             <LayoutIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">RoomScheduler</h1>
          <p className="text-slate-500 dark:text-slate-400">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm mt-2"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>Credenciais padrão: admin@empresa.com / admin</p>
        </div>
      </div>
    </div>
  );
};