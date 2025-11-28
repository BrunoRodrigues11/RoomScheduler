import React, { useState } from 'react';
import { Room } from '../types';
import { generateId } from '../utils';
import { Plus, Trash2, Edit2, MapPin, Users, Info } from 'lucide-react';

interface RoomManagerProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

export const RoomManager: React.FC<RoomManagerProps> = ({ rooms, setRooms }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({
    name: '',
    location: '',
    capacity: 4,
    notes: '',
  });

  const handleSave = () => {
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
    if (confirm('Tem certeza que deseja excluir esta sala? Agendamentos passados podem perder a referência.')) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const startEdit = (room: Room) => {
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
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Salas</h2>
        <p className="text-slate-500">Cadastre e edite as salas disponíveis para reunião.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {isEditing ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
            {isEditing ? 'Editar Sala' : 'Nova Sala'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Sala</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Sala de Vidro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 2º Andar, Bloco B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacidade (Pessoas)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="Projetor, TV, Ar condicionado..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </button>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-800">{room.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.color || 'bg-gray-100'}`}>
                    {room.capacity} Lugares
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-500">
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
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => startEdit(room)}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {rooms.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
              <p>Nenhuma sala cadastrada. Adicione uma sala para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};