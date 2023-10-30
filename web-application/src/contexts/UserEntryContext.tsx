import React, { createContext, useContext, ReactNode, useState } from 'react';

interface UserEntryContextProps {
  showSignIn: () => void;
  showSignUp: () => void;
  showForgotPassword: () => void;
  hideUserEntry: () => void;
  isUserEntryVisible: boolean;
  formType: 'signin' | 'signup' | 'renewpass' | null;
}

const UserEntryContext = createContext<UserEntryContextProps | undefined>(undefined);

export const UserEntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserEntryVisible, setIsUserEntryVisible] = useState(false);
  const [formType, setFormType] = useState<'signin' | 'signup' | 'renewpass' | null>(null);

  const showSignIn = () => {
    setIsUserEntryVisible(true);
    setFormType('signin');
  };

  const showSignUp = () => {
    setIsUserEntryVisible(true);
    setFormType('signup');
  };
  
  const showForgotPassword = () => {
    setIsUserEntryVisible(true);
    setFormType('renewpass');
  };

  const hideUserEntry = () => {
    setIsUserEntryVisible(false);
  };

  return (
    <UserEntryContext.Provider value={{ showSignIn, showSignUp, showForgotPassword, hideUserEntry, isUserEntryVisible, formType }}>
      {children}
    </UserEntryContext.Provider>
  );
};
export const useUserEntry = () => {
  const context = useContext(UserEntryContext);
  if (context === undefined) {
    throw new Error('useUserEntry must be used within a UserEntryProvider');
  }
  return context;
};