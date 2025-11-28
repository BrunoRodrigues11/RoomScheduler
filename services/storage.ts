import { Room, Booking, User } from '../types';

const ROOMS_KEY = 'rs_rooms';
const BOOKINGS_KEY = 'rs_bookings';
const USERS_KEY = 'rs_users';

// Default data for first run
const DEFAULT_ROOMS: Room[] = [
  { id: '1', name: 'Sala Copacabana', location: '1º Andar', capacity: 10, notes: 'Possui projetor e quadro branco', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: '2', name: 'Sala Ipanema', location: '1º Andar', capacity: 6, notes: 'TV para conferência', color: 'bg-green-100 border-green-300 text-green-800' },
  { id: '3', name: 'Auditório Leblon', location: 'Térreo', capacity: 50, notes: 'Sistema de som integrado', color: 'bg-purple-100 border-purple-300 text-purple-800' },
];

const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@empresa.com',
  password: 'admin',
  role: 'admin'
};

export const StorageService = {
  getRooms: (): Room[] => {
    const data = localStorage.getItem(ROOMS_KEY);
    if (!data) {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(DEFAULT_ROOMS));
      return DEFAULT_ROOMS;
    }
    return JSON.parse(data);
  },

  saveRooms: (rooms: Room[]) => {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  },

  getBookings: (): Booking[] => {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
      return [DEFAULT_ADMIN];
    }
    return JSON.parse(data);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};