import React from 'react';
import AppRouter from './Router';
import { useUserEntry } from './contexts/UserEntryContext';
import UserEntry from './pages/UserEntry';
import "./tailwind.css";

const App: React.FC = () => {
  const { isUserEntryVisible, formType, hideUserEntry } = useUserEntry();

  return (
    <div className="app">
      {isUserEntryVisible && formType && (
        <UserEntry formType={formType} closeUserEntry={hideUserEntry} />
      )}
      <AppRouter />
    </div>
  );
}

export default App;