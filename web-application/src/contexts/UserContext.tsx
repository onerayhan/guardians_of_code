import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface UserContextProps {
  user: { id: string } | null;
  login: (userId: string) => void;
  logout: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextProps | null>(null);

// Define the provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);

  const login = (userId: string) => {
    setUser({ id: userId });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the user context
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};