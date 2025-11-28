import React, { useState } from 'react';
import { Booking, Room } from '../types';
import { format, parseISO } from 'date-fns';
import { Search, Clock, MapPin, Calendar } from 'lucide-react';

interface BookingListProps {
  bookings: Booking[];
  rooms: Room[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, rooms, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');

  const getRoomName = (id: string) => rooms.find(r => r.id === id)?.name || 'Sala desconhecida';

  // Sort by date/time desc
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime();
  });

  const filteredBookings = sortedBookings.filter(b => 
    b.requesterName.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase()) ||
    getRoomName(b.roomId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Lista de Agendamentos</h2>
           <p className="text-slate-500">Histórico completo de reservas.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, sala..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
          />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Horário</th>
                <th className="px-6 py-4">Sala</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2 font-medium text-slate-900">
                         <Calendar className="w-4 h-4 text-slate-400" />
                         {format(parseISO(booking.date), 'dd/MM/yyyy')}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-slate-400" />
                         {booking.startTime} - {booking.endTime}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-slate-400" />
                         {getRoomName(booking.roomId)}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{booking.requesterName}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{booking.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onEdit(booking)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};