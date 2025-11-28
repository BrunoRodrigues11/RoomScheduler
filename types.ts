export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  notes?: string;
  color?: string; // For UI differentiation
}

export interface Booking {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  requesterName: string;
  description: string;
  createdAt: number;
}

export type Role = 'admin' | 'sec' | 'common';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, this should be hashed. Here stored as plain text for demo.
  role: Role;
}

export type ViewMode = 'calendar' | 'rooms' | 'list' | 'users';

export const BUSINESS_START_HOUR = 7;
export const BUSINESS_END_HOUR = 20;