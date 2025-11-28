import { Booking } from './types';

// Convert HH:mm to minutes from midnight
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check for overlapping bookings
export const hasConflict = (
  newBooking: Omit<Booking, 'createdAt'>,
  existingBookings: Booking[]
): boolean => {
  const newStart = timeToMinutes(newBooking.startTime);
  const newEnd = timeToMinutes(newBooking.endTime);

  return existingBookings.some((b) => {
    // Skip checking against itself if editing
    if (b.id === newBooking.id) return false;

    // Must be same room and same date to conflict
    if (b.roomId !== newBooking.roomId || b.date !== newBooking.date) return false;

    const existingStart = timeToMinutes(b.startTime);
    const existingEnd = timeToMinutes(b.endTime);

    // Conflict logic: (StartA < EndB) and (EndA > StartB)
    return newStart < existingEnd && newEnd > existingStart;
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};