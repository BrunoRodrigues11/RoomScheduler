import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RoomManager } from './components/RoomManager';
import { CalendarView } from './components/CalendarView';
import { BookingList } from './components/BookingList';
import { BookingModal } from './components/BookingModal';
import { Room, Booking, ViewMode } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('calendar');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);
  const [modalInitialRoomId, setModalInitialRoomId] = useState<string | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    setRooms(StorageService.getRooms());
    setBookings(StorageService.getBookings());
  }, []);

  // Persist Rooms
  const handleSetRooms = (newRooms: Room[]) => {
    setRooms(newRooms);
    StorageService.saveRooms(newRooms);
  };

  // Persist Bookings
  const handleSaveBooking = (booking: Booking) => {
    let newBookings;
    if (editingBooking) {
      newBookings = bookings.map(b => b.id === booking.id ? booking : b);
    } else {
      newBookings = [...bookings, { ...booking, createdAt: Date.now() }];
    }
    setBookings(newBookings);
    StorageService.saveBookings(newBookings);
  };

  const handleDeleteBooking = (id: string) => {
    const newBookings = bookings.filter(b => b.id !== id);
    setBookings(newBookings);
    StorageService.saveBookings(newBookings);
    setIsModalOpen(false);
  };

  // Modal Handlers
  const openNewBooking = (date?: string, roomId?: string) => {
    setEditingBooking(undefined);
    setModalInitialDate(date);
    setModalInitialRoomId(roomId);
    setIsModalOpen(true);
  };

  const openEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setModalInitialDate(undefined);
    setModalInitialRoomId(undefined);
    setIsModalOpen(true);
  };

  return (
    <Layout currentView={view} onViewChange={setView}>
      {view === 'calendar' && (
        <CalendarView 
          rooms={rooms}
          bookings={bookings}
          onAddBooking={openNewBooking}
          onEditBooking={openEditBooking}
        />
      )}
      
      {view === 'rooms' && (
        <RoomManager 
          rooms={rooms} 
          setRooms={handleSetRooms} 
        />
      )}

      {view === 'list' && (
        <BookingList 
          bookings={bookings}
          rooms={rooms}
          onEdit={openEditBooking}
          onDelete={handleDeleteBooking}
        />
      )}

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={editingBooking}
        rooms={rooms}
        existingBookings={bookings}
        onSave={handleSaveBooking}
        onDelete={editingBooking ? handleDeleteBooking : undefined}
        initialDate={modalInitialDate}
        initialRoomId={modalInitialRoomId}
      />
    </Layout>
  );
};

export default App;