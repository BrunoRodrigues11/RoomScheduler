import React, { useState, useMemo } from 'react';
import { Room, Booking, BUSINESS_START_HOUR, BUSINESS_END_HOUR } from '../types';
import { timeToMinutes } from '../utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, addDays, subDays, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
  rooms: Room[];
  bookings: Booking[];
  onAddBooking: (date: string, roomId?: string) => void;
  onEditBooking: (booking: Booking) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  rooms,
  bookings,
  onAddBooking,
  onEditBooking
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigation handlers
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const today = () => setCurrentDate(new Date());
  
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');

  // Filter bookings for current date
  const todaysBookings = useMemo(() => {
    return bookings.filter(b => b.date === currentDateStr);
  }, [bookings, currentDateStr]);

  // Calculations for grid layout
  const totalHours = BUSINESS_END_HOUR - BUSINESS_START_HOUR;
  const hourWidthPct = 100 / totalHours;

  const getPositionStyle = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const dayStartMinutes = BUSINESS_START_HOUR * 60;
    
    // Clamp values to visible range
    const effectiveStart = Math.max(startMinutes, dayStartMinutes);
    const effectiveEnd = Math.min(endMinutes, BUSINESS_END_HOUR * 60);

    const startOffset = effectiveStart - dayStartMinutes;
    const duration = effectiveEnd - effectiveStart;
    
    const leftPct = (startOffset / (totalHours * 60)) * 100;
    const widthPct = (duration / (totalHours * 60)) * 100;

    return {
      left: `${leftPct}%`,
      width: `${widthPct}%`
    };
  };

  // Generate time labels
  const timeLabels = Array.from({ length: totalHours + 1 }, (_, i) => BUSINESS_START_HOUR + i);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={prevDay} className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"><ChevronLeft className="w-5 h-5"/></button>
            <button onClick={today} className="px-3 text-sm font-semibold text-slate-700 hover:text-blue-600">Hoje</button>
            <button onClick={nextDay} className="p-1 hover:bg-white rounded-md shadow-sm transition-all text-slate-600"><ChevronRight className="w-5 h-5"/></button>
          </div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 capitalize">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </h2>
        </div>
        
        <button 
          onClick={() => onAddBooking(currentDateStr)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Agendamento
        </button>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-[1000px] p-6">
          
          {/* Time Header */}
          <div className="flex mb-4">
            <div className="w-48 flex-shrink-0"></div> {/* Spacer for room names */}
            <div className="flex-1 flex relative h-8 text-slate-400 text-sm font-medium border-b border-slate-200">
              {timeLabels.map((hour, index) => (
                 <div 
                   key={hour} 
                   className="absolute transform -translate-x-1/2 flex flex-col items-center"
                   style={{ left: `${(index / totalHours) * 100}%` }}
                 >
                   <span>{String(hour).padStart(2, '0')}:00</span>
                   <div className="h-2 w-px bg-slate-300 mt-1"></div>
                 </div>
              ))}
            </div>
          </div>

          {/* Rooms Rows */}
          <div className="space-y-4">
            {rooms.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic">
                    Nenhuma sala cadastrada.
                </div>
            )}
            {rooms.map((room) => {
                const roomBookings = todaysBookings.filter(b => b.roomId === room.id);

                return (
                  <div key={room.id} className="flex group">
                    {/* Room Card (Left Column) */}
                    <div className="w-48 flex-shrink-0 pr-4 flex flex-col justify-center">
                      <div className="font-semibold text-slate-800">{room.name}</div>
                      <div className="text-xs text-slate-500">{room.location} • {room.capacity} lug.</div>
                    </div>

                    {/* Timeline Track */}
                    <div className="flex-1 relative h-16 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                      {/* Grid Lines */}
                      {timeLabels.map((_, index) => (
                        <div 
                          key={index}
                          className="absolute top-0 bottom-0 border-r border-dashed border-slate-200"
                          style={{ left: `${(index / totalHours) * 100}%` }}
                        />
                      ))}

                      {/* Booking Blocks */}
                      {roomBookings.map((booking) => {
                        const style = getPositionStyle(booking.startTime, booking.endTime);
                        return (
                          <div
                            key={booking.id}
                            onClick={() => onEditBooking(booking)}
                            style={style}
                            className="absolute top-1 bottom-1 rounded-md bg-blue-100 border border-blue-300 text-blue-800 text-xs p-1.5 cursor-pointer hover:bg-blue-200 hover:scale-[1.02] hover:shadow-md transition-all z-10 overflow-hidden whitespace-nowrap"
                            title={`${booking.startTime} - ${booking.endTime}: ${booking.description}`}
                          >
                            <div className="font-bold truncate">{booking.requesterName}</div>
                            <div className="truncate opacity-80">{booking.description || 'Sem descrição'}</div>
                          </div>
                        );
                      })}

                      {/* Add Button on Empty Slots (Concept: Click anywhere to add) */}
                      <div 
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-black/5"
                        onClick={(e) => {
                            // Don't trigger if clicking a booking
                            if (e.target !== e.currentTarget) return;
                            onAddBooking(currentDateStr, room.id);
                        }}
                      ></div>

                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};