import React, { useState } from 'react';
import { Room } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Edit2, MapPin, Users, Info, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RoomManagerProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

export const RoomManager: React.FC<RoomManagerProps> = ({ rooms, setRooms }) => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'sec';

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    location: '',
    capacity: 4,
    notes: '',
  });

  const handleSave = () => {
    if (!canManage) return;
    if (!formData.name || !formData.location) return alert('Nome e Localização são obrigatórios.');

    if (isEditing) {
      const updatedRooms = rooms.map((r) =>
        r.id === isEditing ? { ...r, ...formData } as Room : r
      );
      setRooms(updatedRooms);
    } else {
      const newRoom: Room = {
        id: generateId(),
        name: formData.name!,
        location: formData.location!,
        capacity: Number(formData.capacity) || 0,
        notes: formData.notes || '',
        color: 'bg-indigo-100 border-indigo-300 text-indigo-800' // Default color
      };
      setRooms([...rooms, newRoom]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!canManage) return;
    if (confirm('Tem certeza que deseja excluir esta sala? Agendamentos passados podem perder a referência.')) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const startEdit = (room: Room) => {
    if (!canManage) return;
    setIsEditing(room.id);
    setFormData(room);
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ name: '', location: '', capacity: 4, notes: '' });
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gerenciar Salas</h2>
        <p className="text-slate-500 dark:text-slate-400">
            {canManage 
                ? 'Cadastre e edite as salas disponíveis para reunião.' 
                : 'Visualize as salas disponíveis.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section - Only visible/enabled for Admin/Sec */}
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit transition-colors ${!canManage ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                {isEditing ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                {isEditing ? 'Editar Sala' : 'Nova Sala'}
             </h3>
             {!canManage && <Lock className="w-4 h-4 text-slate-400" />}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Sala</label>
              <input
                type="text"
                disabled={!canManage}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400"
                placeholder="Ex: Sala de Vidro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Localização</label>
              <input
                type="text"
                disabled={!canManage}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 2º Andar, Bloco B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacidade (Pessoas)</label>
              <input
                type="number"
                disabled={!canManage}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observações</label>
              <textarea
                disabled={!canManage}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="Projetor, TV, Ar condicionado..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={!canManage}
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600"
              >
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </button>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {!canManage && (
             <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg text-sm mb-2 flex items-center gap-2">
                 <Info className="w-4 h-4" />
                 Seu perfil permite apenas visualizar as salas.
             </div>
          )}

          {rooms.map((room) => (
            <div key={room.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white">{room.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.color || 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {room.capacity} Lugares
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {room.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Capacidade: {room.capacity}
                  </div>
                  {room.notes && (
                    <div className="flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      {room.notes}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Only show actions if Admin or Sec */}
              {canManage && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                    onClick={() => startEdit(room)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                    <Edit2 className="w-4 h-4" />
                    Editar
                    </button>
                    <button
                    onClick={() => handleDelete(room.id)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              )}
            </div>
          ))}
          
          {rooms.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
              <p>Nenhuma sala cadastrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
