import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { generateId, hasConflict, getTodayDateString } from '../utils';
import { X, Clock, Calendar as CalendarIcon, User, AlignLeft } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking; // If provided, we are editing
  rooms: Room[];
  existingBookings: Booking[];
  onSave: (booking: Booking) => void;
  onDelete?: (id: string) => void;
  initialDate?: string;
  initialRoomId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  rooms,
  existingBookings,
  onSave,
  onDelete,
  initialDate,
  initialRoomId
}) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    roomId: '',
    date: getTodayDateString(),
    startTime: '09:00',
    endTime: '10:00',
    requesterName: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        setFormData({ ...booking });
      } else {
        setFormData({
          roomId: initialRoomId || (rooms.length > 0 ? rooms[0].id : ''),
          date: initialDate || getTodayDateString(),
          startTime: '09:00',
          endTime: '10:00',
          requesterName: '',
          description: '',
          id: generateId()
        });
      }
      setError(null);
    }
  }, [isOpen, booking, initialDate, initialRoomId, rooms]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.roomId || !formData.date || !formData.startTime || !formData.endTime || !formData.requesterName) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.startTime! >= formData.endTime!) {
      setError('O horário de término deve ser após o horário de início.');
      return;
    }

    // Conflict Detection
    const newBooking = { ...formData } as Booking;
    if (hasConflict(newBooking, existingBookings)) {
      setError('Conflito detectado! Já existe um agendamento para esta sala neste horário.');
      return;
    }

    onSave(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {booking ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
              <span className="font-bold">Erro:</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sala</label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>Selecione uma sala</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Cap: {r.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" /> Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Início
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Fim
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Solicitante
            </label>
            <input
              type="text"
              value={formData.requesterName}
              onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
              className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" /> Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Assunto da reunião..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            {booking && onDelete && (
               <button
               type="button"
               onClick={() => {
                 if(confirm('Excluir este agendamento?')) {
                   onDelete(booking.id);
                   onClose();
                 }
               }}
               className="px-4 py-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg font-medium transition-colors"
             >
               Excluir
             </button>
            )}
            <div className="flex-1 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Salvar Agendamento
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
