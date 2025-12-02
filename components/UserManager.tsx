import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { StorageService } from '../services/storage';
import { generateId } from '../utils';
import { Plus, Trash2, Shield, User as UserIcon } from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    password: '',
    role: 'common'
  });

  useEffect(() => {
    setUsers(StorageService.getUsers());
  }, []);

  const handleSave = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return alert('Preencha todos os campos.');

    const userToAdd: User = {
      id: generateId(),
      name: newUser.name!,
      email: newUser.email!,
      password: newUser.password!,
      role: newUser.role as Role
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    setNewUser({ name: '', email: '', password: '', role: 'common' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      StorageService.saveUsers(updatedUsers);
    }
  };

  const getRoleBadge = (role: Role) => {
    switch(role) {
        case 'admin': return <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold uppercase">Admin</span>;
        case 'sec': return <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-bold uppercase">Secretaria</span>;
        default: return <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-bold uppercase">Comum</span>;
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciar Usuários</h2>
        <p className="text-slate-500 dark:text-slate-400">Cadastre usuários e defina permissões de acesso.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <Plus className="w-4 h-4"/> Novo Usuário
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Perfil de Acesso</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="common">Comum (Apenas Agendamentos)</option>
                <option value="sec">Secretaria (Salas e Agendamentos)</option>
                <option value="admin">Administrador (Total)</option>
              </select>
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-2"
              >
                Cadastrar Usuário
            </button>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {users.map((user) => (
             <div key={user.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {user.role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{user.name}</h4>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                       {user.email} • {getRoleBadge(user.role)}
                    </div>
                  </div>
                </div>
                
                {/* Don't allow deleting self or the last admin ideally, simpler here */}
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Excluir Usuário"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
