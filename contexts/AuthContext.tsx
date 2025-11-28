import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check session storage on load (simple persistence)
    const storedUser = sessionStorage.getItem('rs_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users = StorageService.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === pass);
    
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser; // Don't keep pass in state ideally
      const safeUser = { ...userWithoutPass, password: foundUser.password } as User; // Keeping it simple for this demo
      
      setUser(safeUser);
      sessionStorage.setItem('rs_current_user', JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('rs_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);